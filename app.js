const express = require("express");
const cors = require("cors");
const { sequelize } = require("./models");
const MainRouter = require("./routes/MainRouter");

const app = express();
// app.use(
// 	cors({
// 		origin: 'https://simpleblog-ambition.netlify.app',
// 		credentials: true,
// 		withCredentials: true,
// 		optionsSuccessStatus: 200,
// 	})
// );

app.set("port", process.env.PORT);

sequelize
  .sync({ force: false })
  .then(() => {
    console.log("데이터베이스 연결됨.");
  })
  .catch((err) => {
    console.error(err);
  });

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use("/", MainRouter);

app.listen(app.get("port"), () => {
  console.log(app.get("port"), "번 포트에서 대기 중");
});