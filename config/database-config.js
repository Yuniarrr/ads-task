module.exports = {
    /**Declaration of databases for my development environment**/
    "development": {
        "databases": {
            "Database1": {
                "database": process.env.POSTGRESQL_DATABASE,
                "username": process.env.POSTGRESQL_USERNAME,
                "password": process.env.POSTGRESQL_PASSWORD,
                "host": "127.0.0.1",
                "dialect": "postgres",
                "port": process.env.POSTGRESQL_PORT
            },
            "Database2": {
                "database": process.env.MYSQL_DATABASE,
                "username": process.env.MYSQL_USERNAME,
                "password": process.env.MYSQL_PASSWORD,
                "host": "127.0.0.1",
                "dialect": "mysql",
                "port": process.env.MYSQL_PORT
            },
        },
    }
}