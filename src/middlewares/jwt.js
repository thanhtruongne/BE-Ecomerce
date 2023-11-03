// User generate token để khi regsister phát ra token;
 import jwt from 'jsonwebtoken';
 require('dotenv').config();
 // có hạn là 1 ngày kể từ khi tạo
const generateToken = (uuid,role) => jwt.sign({_id: uuid, role},process.env.JWT_SERECT,{expiresIn : '24h'})

// có hạn là 7 ngày kể từ khi tạo
const generateRefreshToken = (uuid) => jwt.sign({_id: uuid},process.env.JWT_SERECT,{expiresIn : '7d'})

module.exports = {
    generateToken,generateRefreshToken
}

