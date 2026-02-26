const functions = require("firebase-functions");
const admin = require("firebase-admin");
const axios = require("axios");
const nodemailer = require("nodemailer");

admin.initializeApp();

// 🔐 너 값으로 바꿔
const TELEGRAM_TOKEN ="8661094271:AAG4GDE_n6Y5Nmv7TR4fydfw6Ke_Ebwm9j0 ";
const CHAT_ID = "6059680696";

const transporter = nodemailer.createTransport({
  host: "smtp.naver.com",
  port: 465,
  secure: true,
  auth: {
    user: "rhtn4455@naver.com",
    pass: "네이버_앱비밀번호"
  }
});

exports.notifyNewApplication = functions.firestore
  .document("applications/{docId}")
  .onCreate(async (snap) => {
    const data = snap.data() || {};

    const message =
`📢 새로운 창업 상담 신청 접수!

이름: ${data.name || "-"}
연락처: ${data.phone || "-"}
유형: ${data.type || "-"}
희망지역: ${data.region || "-"}
시간: ${new Date().toLocaleString("ko-KR")}
`;

    // 1) 텔레그램 알림
    await axios.post(`https://api.telegram.org/bot${TELEGRAM_TOKEN}/sendMessage`, {
      chat_id: CHAT_ID,
      text: message
    });

    // 2) 네이버 메일 알림
    await transporter.sendMail({
      from: "너네이버아이디@naver.com",
      to: "받을이메일@naver.com",
      subject: "새로운 창업 상담 신청 접수",
      text: message
    });

    return null;
  });
