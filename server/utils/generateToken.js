const jwt = require('jsonwebtoken');

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'smarthire_super_secret_jwt_key_2026_production_safe', {
    expiresIn: process.env.JWT_EXPIRE || '30d'
  });
};

module.exports = generateToken;
