import seed_admin from "./admin";
import seed_weekly_points from "./weekly_points";


const main = async () => {
    const u = await seed_admin();
    await seed_weekly_points(u.getDataValue("pk"));

    console.log("Seeding finished successfully.")
    process.exit(0)
}

main();