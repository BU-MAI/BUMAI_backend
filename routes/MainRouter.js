const express = require("express");
const User = require("../models/User");
const router = express.Router();
const bcrypt = require('bcrypt');
const { sign } = require('jsonwebtoken');
const { validateToken } = require('../middleware/AuthMiddleware');
const { Sequelize, Op } = require('sequelize');
require("dotenv").config();


//signup
router.post('/signup', async (req, res) => {
  try {
    // 요청으로부터 사용자 정보 추출
    const { Id, password, name } = req.body;

    // 패스워드 암호화
    const hashedPassword = await bcrypt.hash(password, 10);

    // 사용자 생성
    const user = await User.create({ Id, password : hashedPassword , name });

    // 응답 반환
    res.status(201).json({ message: '회원가입이 성공적으로 완료되었습니다.' });
  } catch (error) {

    // 오류 처리
    console.error(error);
    res.status(500).json({ message: '회원가입 도중 오류가 발생했습니다.' });
  }
});


module.exports = router;
