const { sign, verify} = require('jsonwebtoken')

const createToken = (users) => {
    const accessToken = sign({ username: users.username, Id: users.uId }, 
        "jwtsecretpolo" );
    
    return accessToken;
}

const validateToken = (req, res, next) => {
    const accessToken = req.cookies["access-token"]

    if (!accessToken) return res.status(400).json({error: "user not authenticated"});

    try{
        const validateToken = verify(accessToken, "jwtsecretpolo")
        if(validateToken){
            req.authenticated = true
            return next()
        }
    }
    catch(err){
        return res.status(400).json({error: err })
    }
}

module.exports = { createToken, validateToken }