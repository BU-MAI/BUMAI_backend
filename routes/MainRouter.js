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

//signin
router.post('/signin', async (req, res) => {
  try {
    // 요청으로부터 사용자 정보 추출
    const { Id, password } = req.body;

    // 사용자 확인
    const user = await User.findOne({ where: { Id } }); //해당 아이디의 컬럼 찾음

    // 사용자가 존재하지 않는 경우
    if (!user) {
      return res.status(404).json({ message: '사용자를 찾을 수 없습니다.' });
    }

    // 비밀번호 확인
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.status(401).json({ message: '비밀번호가 일치하지 않습니다.' });
    }

    // 로그인 성공
    const accessToken = sign(
        { id: user.Id, name: user.name },
        'importantsecret'
    ); //accessToken 만듬
    res.status(200).json({ message: '로그인이 성공적으로 완료되었습니다.', accessToken: accessToken }); 
  } catch (error) {
    // 오류 처리
    console.error(error);
    res.status(500).json({ message: '로그인 도중 오류가 발생했습니다.' });
  }
});

module.exports = router;
