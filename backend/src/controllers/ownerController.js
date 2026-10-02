const { fn, col } = require('sequelize');
const { Store, Rating, User } = require('../models');
const { roundAverage } = require('../utils/rating');

exports.getOwnerDashboard = async (req, res, next) => {
  try {
    const store = await Store.findOne({ where: { owner_id: req.user.id } });
    if (!store) {
      return res.status(404).json({ message: 'No store found for this owner.' });
    }

    const avg = await Rating.findOne({
      where: { store_id: store.id },
      attributes: [[fn('AVG', col('rating')), 'averageRating']],
      raw: true,
    });

    const ratings = await Rating.findAll({
      where: { store_id: store.id },
      include: [{ model: User, as: 'user', attributes: ['name', 'email'] }],
      attributes: ['rating', 'created_at', 'updated_at'],
      order: [['created_at', 'DESC']],
    });

    const raters = ratings.map((r) => ({
      name: r.user.name,
      email: r.user.email,
      rating: r.rating,
      createdAt: r.created_at,
      updatedAt: r.updated_at,
    }));

    res.json({
      store: { id: store.id, name: store.name, email: store.email, address: store.address },
      averageRating: roundAverage(avg.averageRating),
      raters,
    });
  } catch (err) {
    next(err);
  }
};
