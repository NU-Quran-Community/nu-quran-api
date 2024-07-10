import User from "../db/model/User";


const user = {
    "name": "Hossam Hamza",
    "email": "Hos.Ahmed@nu.edu.eg",
    "role": "admin",
    "password": "12345"
}



const seed_admin = async (): Promise<void> => {
    await User.sync();
    const u1 = new User(user)
    await u1.save()

    console.log("Seeding finished successfully.")
    process.exit(0)
}


export default seed_admin;