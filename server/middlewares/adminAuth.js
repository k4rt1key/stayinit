const jwt = require('jsonwebtoken');
const auth = async (req, res, next) => {

    try {

        // extract the token from the request headers
        if (!req.headers.authorization) {
            return res.status(401).json({
                success: false,
                message: 'token not found in headers',
            });
        }

        const token = req.headers.authorization.split(" ")[1];

        // check if the token is present and valid 
        if (!token) {
            return res.status(401).json({
                success: false,
                message: 'token not found',
            });
        }

        // verifaction of token
        const payload = jwt.verify(token, process.env.JWT_SECRET);

        if (!payload) {
            return res.status(401).json({
                success: false,
                message: 'token is invalid',
            });
        }

        if (payload.role !== 'admin') {
            return res.status(401).json({
                success: false,
                message: 'You are not authorized to perform this action',
            });
        }

        req.profile = payload;

        next();

    } catch (error) {
        return res.status(401).json({
            success: false,
            message: `backend: ${error.message}`,
        });
    }
};

module.exports = auth;