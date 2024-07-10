import bcrypt from "bcrypt"
import get_config from "../config/config"


const hash = async (password: string) => {
    return await bcrypt.hash(password + get_config("PEPPER"), parseInt(get_config("SALT_ROUNDS")))
}

export default hash