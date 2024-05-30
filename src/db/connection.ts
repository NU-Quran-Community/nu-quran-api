const { Sequelize } = require('sequelize');
import get_config from "../config/config";

const db_url = get_config("NODE_ENV") == 'prod' ? get_config("DB_URL") : get_config("DB_DEV_URL")
const connection = new Sequelize(db_url);

export default connection