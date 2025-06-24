import * as dotenv from 'dotenv';;

dotenv.config();

const {
    HOST,
    PORT_DB,
    POSTGRES,
    PSW,
    DB,
    SALT_ROUNDS,
    JWT_SECRET,
    JWT_LIFETIME,
} = process.env;

if (
    !HOST ||
    !PORT_DB ||
    !POSTGRES ||
    !PSW ||
    !DB ||
    !SALT_ROUNDS ||
    !JWT_SECRET ||
    !JWT_LIFETIME
) {
    throw new Error('Some environment variables are missing');
}

export const config = {
    host: HOST,
    port: parseInt(PORT_DB),
    postgres: POSTGRES,
    password: PSW,
    database: DB,
    saltRounds: parseInt(SALT_ROUNDS),
    jwtSecret: JWT_SECRET,
    jwtLifetime: parseInt(JWT_LIFETIME),
};