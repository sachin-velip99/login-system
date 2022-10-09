const { sign, verify} = require('jsonwebtoken')

const createToken = (user) => {
    const accessToken = sign({ username: user.username, id: user.userId }, "jwtsecretpolo", {//payload claims and secret
        
    });
    
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