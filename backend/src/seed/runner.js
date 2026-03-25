const sequelize = require('../db/index');
const { seedRolesAndPermissions } = require('./rolesAndPermissions.seed');
const { seedUsersAndRestaurants } = require('./usersAndRestaurants.seed');

async function runSeed() {
  try {
    await sequelize.authenticate();
    console.log('✅ DB connected');

    await sequelize.sync({ alter: true });
    console.log('✅ Models synced');

    // 1. Roles & permissions first (users may depend on roles)
    await seedRolesAndPermissions();
    console.log('✅ Roles & permissions seeded');

    // 2. Restaurants & users
    await seedUsersAndRestaurants();
    console.log('✅ Users & restaurants seeded');

    console.log('🎉 All seeds complete');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding:', error);
    process.exit(1);
  }
}

runSeed();