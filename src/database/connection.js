import sql from 'mssql'

const dbSettings = {
    user: "PutYourUserName",
    password: "PutYourPassword",
    server: "PutYourServerName",
    database: "PutYourDatabaseName",
    options: {
        encrypt: false,
        trustServerCertificate: true,
    }
}

export const getConnection = async () => {
    try {
        const pool = await sql.connect(dbSettings);
        return pool;
    } catch (error) {
        console.error(error);
    }
};