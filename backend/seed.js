// Wipes and recreates all tables, then loads sample data. Run with: node seed.js
require('dotenv').config();
const bcrypt = require('bcryptjs');
const { sequelize, User, Store, Rating } = require('./src/models');

async function seed() {
  try {
    await sequelize.authenticate();
    console.log('✓ Database connected.');

    await sequelize.sync({ force: true });
    console.log('✓ Tables recreated.');

    const adminHash = await bcrypt.hash('Admin@1234', 10);
    const ownerHash = await bcrypt.hash('Owner@1234', 10);
    const userHash = await bcrypt.hash('User@12345', 10);

    await User.create({
      name: 'System Administrator',
      email: 'admin@storerating.com',
      password: adminHash,
      address: '100 Tech HQ Plaza, Silicon Valley, CA',
      role: 'admin',
    });

    const ownerList = [
      { name: 'Robert Bartholomew Vance', email: 'owner@storerating.com', address: '456 Commerce Ave, Market Town' },
      { name: 'Sarah Jennifer Connor', email: 'owner2@storerating.com', address: '789 Retail Row, Metro Center' },
      { name: 'Michael Gary Scott Senior', email: 'owner3@storerating.com', address: '1725 Slough Avenue, Scranton, PA' },
      { name: 'Laura Katherine Whitfield', email: 'owner4@storerating.com', address: '18 Harbor Lane, Portland, OR' },
      { name: 'Daniel Marcus Greenfield', email: 'owner5@storerating.com', address: '260 Orchard Road, Sacramento, CA' },
      { name: 'Naomi Elizabeth Fairchild', email: 'owner6@storerating.com', address: '71 College Street, Madison, WI' },
    ];

    const owners = [];
    for (const o of ownerList) {
      owners.push(await User.create({ ...o, password: ownerHash, role: 'owner' }));
    }

    const userList = [
      { name: 'Alice Elizabeth Smith', email: 'user1@storerating.com', address: '12 Maple Street, Boston' },
      { name: 'Bob Alexander Johnson Jr.', email: 'user2@storerating.com', address: '44 Oak Avenue, Chicago' },
      { name: 'Charlie Benjamin Brown Jr.', email: 'user3@storerating.com', address: '99 Pine Road, Seattle' },
      { name: 'Diana Themyscira Prince', email: 'user4@storerating.com', address: '202 Gotham Blvd, Metropolis' },
      { name: 'Ethan Michael Hunt Junior', email: 'user5@storerating.com', address: '500 Mission St, San Francisco' },
      { name: 'Fiona Monica Gallagher', email: 'user6@storerating.com', address: '300 Southside Ave, Chicago' },
    ];

    const users = [];
    for (const u of userList) {
      users.push(await User.create({ ...u, password: userHash, role: 'user' }));
    }
    console.log(`✓ Created 1 Admin, ${owners.length} Owners, and ${users.length} Users.`);

    // one store per owner
    const storesData = [
      {
        name: 'TechHub Electronics & Gadgets',
        email: 'contact@techhub.com',
        address: '101 Innovation Parkway, Suite 400',
        owner_id: owners[0].id,
      },
      {
        name: 'Artisan Gourmet Coffee',
        email: 'hello@artisancoffee.com',
        address: '42 Brew Station Alley, Downtown',
        owner_id: owners[3].id,
      },
      {
        name: 'Urban Chic Apparel Boutique',
        email: 'support@urbanchic.com',
        address: '88 Fashion District Plaza',
        owner_id: owners[1].id,
      },
      {
        name: 'Fresh Harvest Organics',
        email: 'info@freshharvest.com',
        address: '50 Green Eco Blvd, Suburbia',
        owner_id: owners[4].id,
      },
      {
        name: 'Dunder Mifflin Paper Co.',
        email: 'sales@dundermifflin.com',
        address: '1725 Slough Avenue, Scranton',
        owner_id: owners[2].id,
      },
      {
        name: 'Cosmic Books & Comics',
        email: 'books@cosmicreading.com',
        address: '304 Reader Way, University District',
        owner_id: owners[5].id,
      },
    ];

    const stores = [];
    for (const s of storesData) {
      stores.push(await Store.create(s));
    }
    console.log(`✓ Created ${stores.length} Stores.`);

    // [user index, store index, rating]
    const ratingData = [
      [0, 0, 5], [1, 0, 4], [2, 0, 5], [3, 0, 4],
      [0, 1, 5], [1, 1, 5], [4, 1, 4],
      [2, 2, 3], [3, 2, 4], [5, 2, 4],
      [1, 3, 5], [4, 3, 4],
      [0, 4, 5], [5, 4, 5], [2, 4, 4],
      [3, 5, 5], [4, 5, 4],
    ];

    for (const [u, s, rating] of ratingData) {
      await Rating.create({ user_id: users[u].id, store_id: stores[s].id, rating });
    }
    console.log(`✓ Added ${ratingData.length} sample ratings across stores.`);

    console.log('\n── Seeding Complete ──');
    console.log('📌 Test Credentials:');
    console.log('  • Admin:       admin@storerating.com   / Admin@1234');
    console.log('  • Owners:      owner@storerating.com, owner2@ ... owner6@storerating.com / Owner@1234');
    console.log('  • Users:       user1@storerating.com to user6@storerating.com / User@12345');

    process.exit(0);
  } catch (err) {
    console.error('✗ Seed failed:', err);
    process.exit(1);
  }
}

seed();
