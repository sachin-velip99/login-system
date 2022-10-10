const express = require('express')
const app = express();
const bcrypt = require('bcrypt')
const pool = require('./db');
const req = require('express/lib/request');
const cookieParser = require('cookie-parser')
const { createToken, validateToken } = require('./jwt');
const res = require('express/lib/response');

//swagger api
const swaggerDoc = require("swagger-ui-express");
const swaggerDocumentation = require("./docs/documentation")


app.use(express.json());
app.use(cookieParser())

app.post('/signup', async (req, res) => {
    const { userId, username, email, phone, password } = req.body;

    if(username == null || undefined){
        return res.status(400).json("please enter username") //username is must
    }
    else if((phone == null || undefined) && (email == null || undefined)) {
        return res.status(400).json("please enter email or phone number"); //user can use email or phone number or both
    }
    else if((password == null || undefined)){
        return res.status(400).json("please enter password") //password is must
    }

    //check if user already exists
    try{
    const user = await pool.query('SELECT * FROM loginsystem WHERE username = $1 OR email = $2 OR phone = $3',[username,email,phone])
    /*if(user.rows[0].username == username){
        return res.json(`user with username ${username} already exists`)
    }
    else if(user.rows[0].email == email){
        return res.json(`user with ${email} already exixts`)
    }
    else if(user.rows[0].phone == phone){
        return res.json(`user with phone number ${phone} already exists`)
    }*/

    if(user.rows.length > 0){
        return res.status(400).json("user already exists");
    }
     
    }catch(err){
        return res.status(400).json(err)
    }
    
    //const userInserted = await pool.query('INSERT INTO "loginsystem" ("userId","username","email","phone","password") VALUES($1,$2,$3,$4,$5) RETURNING *', [userId, username, email, phone, hash])
    try{
        const hashedPassword = await bcrypt.hash(req.body.password, 10);
        const userInserted = await pool.query('INSERT INTO "loginsystem" ("userId","username","email","phone","password") VALUES($1,$2,$3,$4,$5) RETURNING *', [userId, username, email, phone, hashedPassword])
        return res.status(200).json({
            userId: userId,
            username: username,
            email: email,
            phone: phone
        });
    }
    catch(err){
        return res.status(400).json(err)
    }
})

app.post('/login', async(req, res) => {
    const { username, email, phone, password} = req.body;
    
    //to check whether user has entered username or email or phone number
    if((username == null || undefined) && (email == null || undefined) && (phone == null || undefined)){
        return res.status(400).json("please enter username or email or phone number to login")
    }
    else if(password == null || undefined){
        return res.status(400).json("please enter password") //check whether user has entered password
    } 
    //check if user exists
    if(username != null || undefined){
        var user = await pool.query('SELECT * FROM loginsystem WHERE username = $1', [username]);
    }
    else if(email != null || undefined){
        var user = await pool.query('SELECT * FROM loginsystem WHERE email = $1', [email]);
    }
    else if(phone != null || undefined){
        var user = await pool.query('SELECT * FROM loginsystem WHERE phone = $1', [phone]);
    }
    //const user = await pool.query('SELECT * FROM loginsystem WHERE username = $1', [username]);
    
    if(user.rows.length === 0) return res.status(400).json("user does not exist"); 
    //password authentication
    const validPassword = await bcrypt.compare(password, user.rows[0].password);
    let users = {
        username: user.rows[0].username,
        uId: user.rows[0].userId
    }

    if (!validPassword) 
    {
        return res.status(400).json({error: "Incorrect password"});
    }else{
        const accessToken = createToken(users)

        res.cookie("access-token", accessToken, {
            maxAge: 60*60*24*30*1000,
            httpOnly: true,
        });
        return res.status(200).json({
            accessToken: accessToken
        })
    }

})
//only authenticated users can access this route 
app.get('/profile', validateToken, (req,res) => {
    return res.status(200).json('profile')
})

app.use("/documentations", swaggerDoc.serve)

app.use("/documentations", swaggerDoc.setup(swaggerDocumentation))

app.listen(3000, () => {
    console.log('server is upon port 3000')
})