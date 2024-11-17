const jwt = require('jsonwebtoken');

const SECRET_KEY = process.env.JWT_SECRET;


function authenticateToken(req, res, next) {
    const token = req.cookies.accessToken;

    if (!token) return res.sendStatus(401);

    jwt.verify(token, SECRET_KEY, (err, user) => {
        if (err) return res.sendStatus(403);
        req.user = user;
        next(); // Proceed to the next middleware or route handler
    });
}

module.exports = authenticateToken;
