const Pool = require('pg').Pool

const pool = new Pool({
    user : "postgres",
    password : "123456789",
    database : "postgres",
    host : "localhost",
    port : 5432
});

module.exports=pool;