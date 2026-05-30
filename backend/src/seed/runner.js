// adjust path
const { seedRolesAndPermissions } = require("./rolesAndPermissions.seed"); // adjust path

async function runSeed() {
  try {
    console.log("✅ DB connected");

    await seedRolesAndPermissions();
    console.log("✅ Seeding done");

    process.exit(0);
  } catch (error) {
    console.error("❌ Error seeding:", error);
    process.exit(1);
  }
}

runSeed();
