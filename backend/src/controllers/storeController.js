const { Op, fn, col, literal } = require('sequelize');
const { Store, Rating } = require('../models');
const { roundAverage } = require('../utils/rating');

exports.listStores = async (req, res, next) => {
  try {
    const where = {};
    if (req.query.name) {
      where.name = { [Op.like]: `%${req.query.name}%` };
    }
    if (req.query.address) {
      where.address = { [Op.like]: `%${req.query.address}%` };
    }

    const sortColumns = ['name', 'email', 'address', 'rating'];
    const sortBy = sortColumns.includes(req.query.sortBy) ? req.query.sortBy : 'name';
    const orderDir = req.query.order === 'desc' ? 'DESC' : 'ASC';

    const stores = await Store.findAll({
      where,
      attributes: { include: [[fn('AVG', col('ratings.rating')), 'overallRating']] },
      include: [{ model: Rating, as: 'ratings', attributes: [] }],
      group: ['Store.id'],
      order: sortBy === 'rating'
        ? [[literal('overallRating'), orderDir]]
        : [[sortBy, orderDir]],
      subQuery: false,
    });

    const myRatings = await Rating.findAll({
      where: { user_id: req.user.id, store_id: { [Op.in]: stores.map((s) => s.id) } },
      attributes: ['store_id', 'rating'],
      raw: true,
    });
    const myRatingMap = {};
    myRatings.forEach((r) => {
      myRatingMap[r.store_id] = r.rating;
    });

    const result = stores.map((s) => {
      const store = s.toJSON();
      store.overallRating = roundAverage(store.overallRating);
      store.myRating = myRatingMap[store.id] || null;
      return store;
    });

    res.json(result);
  } catch (err) {
    next(err);
  }
};

exports.submitRating = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const storeId = parseInt(req.params.id, 10);

    const store = await Store.findByPk(storeId);
    if (!store) {
      return res.status(404).json({ message: 'Store not found.' });
    }

    const existing = await Rating.findOne({ where: { user_id: userId, store_id: storeId } });
    if (existing) {
      return res.status(409).json({ message: 'You have already rated this store. Use PUT to modify.' });
    }

    const rating = await Rating.create({
      user_id: userId,
      store_id: storeId,
      rating: req.body.rating,
    });

    res.status(201).json({ message: 'Rating submitted.', rating });
  } catch (err) {
    next(err);
  }
};

exports.updateRating = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const storeId = parseInt(req.params.id, 10);

    const existing = await Rating.findOne({ where: { user_id: userId, store_id: storeId } });
    if (!existing) {
      return res.status(404).json({ message: 'You have not rated this store yet.' });
    }

    existing.rating = req.body.rating;
    await existing.save();

    res.json({ message: 'Rating updated.', rating: existing });
  } catch (err) {
    next(err);
  }
};
