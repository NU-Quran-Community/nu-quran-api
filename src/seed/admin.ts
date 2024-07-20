import { Model } from "sequelize";
import User from "../db/model/User";


const user = {
    "name": "Hossam Hamza",
    "email": "Hos.Ahmed@nu.edu.eg",
    "role": "admin",
    "password": "12345"
}



const seed_admin = async (): Promise<Model> => {
    await User.sync();
    const u1 = new User(user)
    return await u1.save();
}


export default seed_admin;