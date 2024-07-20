import WeeklyPoints from "../db/model/WeeklyPoints";


const user = {
    "name": "Hossam Hamza",
    "email": "Hos.Ahmed@nu.edu.eg",
    "role": "admin",
    "password": "12345"
}



const seed_weekly_points = async (user_pk: number): Promise<void> => {
    await WeeklyPoints.sync();
    const weeks = await WeeklyPoints.bulkCreate([
        { user_pk, date: '2024-05-09', points: 2, state: "present" },
        { user_pk, date: new Date(), points: 3, state: "present" }
    ])
}


export default seed_weekly_points;