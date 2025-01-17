import get_config from "./config";
import session from "express-session"
const pgStore = require('connect-pg-simple')(session);
import pg from "pg"
const pgPool = new pg.Pool({ connectionString: get_config("DB_DEV_URL") })
// const pool = mysql.createPool(get_config("DB_DEV_URL"));


const options = {
    clearExpired: true,
    // How frequently expired sessions will be cleared; milliseconds:
    checkExpirationInterval: 900000,
    createDatabaseTable: true,
    pool: pgPool,
    createTableIfMissing: true
    // ssl: process.env.NODE_ENV === 'production',
};


const sessionStore = new pgStore(options);
const ConfiguredSession = session({
    secret: get_config("COOKIE_SECRET"),
    resave: false,
    saveUninitialized: false,
    store: sessionStore,
    cookie: {
        maxAge: parseInt(get_config("COOKIE_EXPIRATION_DAYS")) * 24 * 60 * 60 * 1000, // session timeout of 600 seconds
        // expires
    }
});


export default ConfiguredSession