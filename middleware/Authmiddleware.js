const express = require("express");
const User = require("../models/User");
const jwt = require('jsonwebtoken');

require("dotenv").config();
const env = process.env;
const SecretKey = env.SECRET_TOKEN_SECRET;


const validateToken = async (req, res, next) => {
  const accessToken = req.header('accessToken');

  try {
    const validToken = jwt.verify(accessToken, SecretKey);
    req.user = validToken;
    if (validToken) {
      return next();
    }
  } catch (err) {
    // accessToken이 만료된 경우
    if (err.name === 'TokenExpiredError') {
      // accessToken 디코딩으로 사용자 정보 얻기      
      const decoded = jwt.decode(accessToken); 
      if (!decoded) return res.json({ error: '유효하지 않은 토큰입니다.' });
      try {
        const user = await User.findById(decoded.id); // 사용자 ID로 DB에서 사용자 검색
        if (!user) return res.json({ error: '사용자를 찾을 수 없습니다.' });

        const refreshToken = user.refreshToken; // 사용자의 refreshToken 가져오기
        if (!refreshToken) return res.json({ error: '재로그인이 필요합니다.' });

        // refreshToken 검증
        const validRefreshToken = jwt.verify(refreshToken, SecretKey);
        req.user = validToken // 디코딩 한 값을 req.user에 저장해놓음
        if (validRefreshToken) {
          // refreshToken이 유효한 경우 새로운 accessToken 재발급
          const newAccessToken = jwt.sign({ id: user.id }, SecretKey, { expiresIn: '1d' });
          res.header('accessToken', newAccessToken); // 새로운 accessToken 설정
          req.user = { id: user.id };
          return next();
        }
      } catch (refreshErr) {
        // refreshToken 만료 또는 검증 실패
        return res.json({ error: '로그아웃 되었습니다.' });
      }
    } else {
      return res.json({ error: '엑세스 토큰이 존재하지 않습니다' });
    }
  }
};

module.exports = { validateToken };