import dotenv from "dotenv";
import path from "node:path";

dotenv.config({path: path.join(process.cwd(), ".env")});

export default {
    PORT: process.env.PORT,
    DATABASE_URL: process.env.DATABASE_URL,
    app_Url: process.env.APP_URL,
    bcrypt_Salt_Rounds: process.env.BCRYPT_SALT_ROUNDS,
    jwt_access_Secret: process.env.JWT_ACCESS_SECRET,
    jwt_refresh_Secret: process.env.JWT_REFRESH_SECRET,
    jwt_access_expires_in: process.env.JWT_ACCESS_EXPIRES_IN,
    jwt_refresh_expires_in: process.env.JWT_REFRESH_EXPIRES_IN,

};
