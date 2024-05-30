import dot_env from "dotenv"
import {join} from "path"

if(process.env.NODE_ENV != 'prod'){
    dot_env.config({ path: join(__dirname, "..", "..", ".env")})
}


function get_config(prop: string){
    return process.env[prop];
}


export default get_config;