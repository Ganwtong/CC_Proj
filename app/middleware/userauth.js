const jwt = require('jsonwebtoken');
const db = require('../models');

module.exports = async (req, res, next) => {
  try {
    const secretKey = "ajsdhkasdh";
    const bearerHeader = req.headers['authorization'];

    if (!bearerHeader) {
      return res.status(401).json({ error: 'Invalid token' });
    }

    const token = bearerHeader.split(' ')[1];

    if (!token) {
      return res.status(401).json({ error: 'Invalid token' });
    }

    const decoded = jwt.verify(token, secretKey);
    const account = await db.account.findOne({ where: { account_id: decoded.id } });
    const checkStat = await account.status;

    if (!checkStat) {
      res.clearCookie('token');
      return res.status(401).json({ error: 'Invalid token' });
    }

    req.user = decoded;
    next();
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      return res.status(401).json({ error: 'Invalid token' });
    } else if (error instanceof jwt.TokenExpiredError) {
      return res.status(401).json({ error: 'Token expired' });
    } else {
      return res.status(500).json({ error: 'Internal server error' });
    }
  }
};
