const { Op, fn, col, literal } = require('sequelize');
const bcrypt = require('bcryptjs');
const { User, Store, Rating } = require('../models');
const { roundAverage } = require('../utils/rating');

function buildWhere(query, fields) {
  const where = {};
  fields.forEach((f) => {
    if (query[f]) {
      where[f] = { [Op.like]: `%${query[f]}%` };
    }
  });
  return where;
}

exports.dashboard = async (req, res, next) => {
  try {
    const totalUsers = await User.count();
    const totalStores = await Store.count();
    const totalRatings = await Rating.count();
    res.json({ totalUsers, totalStores, totalRatings });
  } catch (err) {
    next(err);
  }
};

exports.addUser = async (req, res, next) => {
  try {
    const { name, email, password, address, role } = req.body;

    const existing = await User.findOne({ where: { email } });
    if (existing) {
      return res.status(409).json({ message: 'Email already registered.' });
    }

    const hash = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, password: hash, address, role });

    res.status(201).json({
      message: 'User created.',
      user: { id: user.id, name: user.name, email: user.email, role: user.role },
    });
  } catch (err) {
    next(err);
  }
};

exports.listUsers = async (req, res, next) => {
  try {
    const where = buildWhere(req.query, ['name', 'email', 'address']);

    // a valid role is matched exactly, anything else falls back to LIKE
    const { role } = req.query;
    if (role) {
      where.role = ['admin', 'user', 'owner'].includes(role)
        ? role
        : { [Op.like]: `%${role}%` };
    }

    const sortColumns = ['name', 'email', 'address', 'role', 'created_at'];
    const sortBy = sortColumns.includes(req.query.sortBy) ? req.query.sortBy : 'name';
    const order = req.query.order === 'desc' ? 'DESC' : 'ASC';

    const users = await User.findAll({
      where,
      order: [[sortBy, order]],
      attributes: ['id', 'name', 'email', 'address', 'role', 'created_at'],
    });

    res.json(users);
  } catch (err) {
    next(err);
  }
};

exports.getUserDetails = async (req, res, next) => {
  try {
    const user = await User.findByPk(req.params.id, {
      attributes: ['id', 'name', 'email', 'address', 'role', 'created_at'],
    });

    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    const result = user.toJSON();

    if (user.role === 'owner') {
      const store = await Store.findOne({
        where: { owner_id: user.id },
        attributes: ['id', 'name', 'email', 'address'],
      });

      if (store) {
        const avg = await Rating.findOne({
          where: { store_id: store.id },
          attributes: [[fn('AVG', col('rating')), 'averageRating']],
          raw: true,
        });
        result.store = { ...store.toJSON(), averageRating: roundAverage(avg.averageRating) };
      }
    }

    res.json(result);
  } catch (err) {
    next(err);
  }
};

exports.addStore = async (req, res, next) => {
  try {
    const { name, email, address, ownerId } = req.body;

    const owner = await User.findByPk(ownerId);
    if (!owner || owner.role !== 'owner') {
      return res.status(400).json({ message: 'Invalid owner. User must have owner role.' });
    }

    const existingStore = await Store.findOne({ where: { owner_id: ownerId } });
    if (existingStore) {
      return res.status(409).json({ message: 'This owner already has a store.' });
    }

    const existingEmail = await Store.findOne({ where: { email } });
    if (existingEmail) {
      return res.status(409).json({ message: 'A store with that email already exists.' });
    }

    const store = await Store.create({ name, email, address, owner_id: ownerId });

    res.status(201).json({ message: 'Store created.', store });
  } catch (err) {
    next(err);
  }
};

exports.listStores = async (req, res, next) => {
  try {
    const where = buildWhere(req.query, ['name', 'email', 'address']);
    const sortColumns = ['name', 'email', 'address', 'rating'];
    const sortBy = sortColumns.includes(req.query.sortBy) ? req.query.sortBy : 'name';
    const orderDir = req.query.order === 'desc' ? 'DESC' : 'ASC';

    const stores = await Store.findAll({
      where,
      attributes: { include: [[fn('AVG', col('ratings.rating')), 'averageRating']] },
      include: [{ model: Rating, as: 'ratings', attributes: [] }],
      group: ['Store.id'],
      order: sortBy === 'rating'
        ? [[literal('averageRating'), orderDir]]
        : [[sortBy, orderDir]],
      subQuery: false,
    });

    const result = stores.map((s) => {
      const store = s.toJSON();
      store.averageRating = roundAverage(store.averageRating);
      return store;
    });

    res.json(result);
  } catch (err) {
    next(err);
  }
};
