const express = require('express')
const app = express();
const bcrypt = require('bcrypt')
const pool = require('./db');
const req = require('express/lib/request');
const cookieParser = require('cookie-parser')
const { createToken, validateToken } = require('./jwt');
const res = require('express/lib/response');


app.use(express.json());
app.use(cookieParser())

app.post('/signup', async (req, res) => {
    const { userId, username, email, phone, password } = req.body;
    try{
    const user = await pool.query('SELECT * FROM loginsystem WHERE username = $1 OR email = $2 OR phone = $3',[username,email,phone])
    if(user.rows.length > 0){
        return res.json("user already exists");
    }
     //res.json(user)
    }catch(err){
        res.json(err)
    }
    //const userInserted = await pool.query('INSERT INTO "loginsystem" ("userId","username","email","phone","password") VALUES($1,$2,$3,$4,$5) RETURNING *', [userId, username, email, phone, hash])
    try {
        const hashedPassword = await bcrypt.hash(req.body.password, 10);
        const userInserted = await pool.query('INSERT INTO "loginsystem" ("userId","username","email","phone","password") VALUES($1,$2,$3,$4,$5) RETURNING *', [userId, username, email, phone, hashedPassword])
        res.json("data inserted");
    }
    catch(err){
        res.json(err)
    }
})

app.post('/login', async(req, res) => {
    const { username, password} = req.body;
    const user = await pool.query('SELECT * FROM loginsystem WHERE username = $1', [username]);
    
    if(user.rows.length === 0) return res.json("user does not exist");

    const validPassword = await bcrypt.compare(password, user.rows[0].password);

    if (!validPassword) 
    {
        return res.status(401).json({error: "Incorrect password"});
    }else{
        const accessToken = createToken(user)

        res.cookie("access-token", accessToken, {
            maxAge: 60*60*24*30*1000,
            httpOnly: true,
        });
        return res.json("login success")
    }

})

app.get('/profile', validateToken, (req,res) => {
    res.json('profile')
})

app.listen(3000, () => {
    console.log('server is upon port 3000')
})