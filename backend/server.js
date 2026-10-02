require('dotenv').config();
const app = require('./src/app');
const { sequelize } = require('./src/models');

const PORT = process.env.PORT || 5000;

async function start() {
  try {
    await sequelize.authenticate();
    console.log('✓ Database connected.');

    await sequelize.sync({ alter: true });
    console.log('✓ Models synchronized.');

    app.listen(PORT, () => {
      console.log(`✓ Server running on http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error('✗ Failed to start:', err);
    process.exit(1);
  }
}

start();
