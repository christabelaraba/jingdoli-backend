const jwt = require('jsonwebtoken');
const db = require("../models");


exports.verifyToken = async (req, res, next) => {
    const token = req.headers['authorization'] ? req.headers['authorization'].split(' ')[1] : null;

    if (!token) {
        return res.status(403).send({ message: "No token provided!" });
    }

    const isBlacklisted = await db.Blacklisted_Token.findOne({ where: { token: token } });
    if (isBlacklisted) {
        return res.status(401).send({ message: "Token is no longer valid" });
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
            return res.status(401).send({ message: "Unauthorized! Error: " + err.message });
        }
        req.user_id = decoded.id;
        next();
    });
};