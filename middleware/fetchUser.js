const jwt = require('jsonwebtoken')

const fetchUser = (req,res,next)=>{
    try {
        const token = req.header('authToken');
        if (!token) {
            return res.status(401).send({ error: "Please authenticate using a valid token" })
        }
        const data = jwt.verify(token,process.env.SECRET_KEY);
        req.user = data.user
        next()
    } catch (err) {
        console.log(err);
    }
}

module.exports = fetchUser