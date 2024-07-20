import connection from "./connection";
import User from "./model/User"
import WeeklyPoints from "./model/WeeklyPoints"



const migrate = async (force: boolean) => {
    // if (force) {
    //     await connection.query("SET FOREIGN_KEY_CHECKS = 0;");
    // }

    await User.sync({ force })
    await WeeklyPoints.sync({ force })

    if (force) {
        // await connection.query("SET FOREIGN_KEY_CHECKS = 1;");
        process.exit(0)
    }
}



if (module == require.main) migrate(true);
export default migrate