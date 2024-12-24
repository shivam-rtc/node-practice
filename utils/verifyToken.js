const jwt = require('jsonwebtoken');

const verifyToken = async (req, res, next) => {
    try {
        const authHeader = req.headers['authorization'];
        if (!authHeader) {
            return res.status(401).json({ message: 'Authorization header is missing' });
        }

        const token = authHeader.split(' ')[1];
        if (!token) {
            return res.status(401).json({ message: 'Token is missing' });
        }

        jwt.verify(token, process.env.JWT_SECRET_KEY, (err, decoded) => {
            if (err) {
                return res.status(401).json({ message: 'Invalid token', error: err.message });
            }
            req.user = decoded;
            next();
        });
    } catch (error) {
        return res.status(500).json({ message: 'An error occurred while verifying the token', error: error.message });
    }
};

module.exports = verifyToken;


module.exports = verifyToken;