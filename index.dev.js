const express = require("express");
const app = express();
const mongoose = require("mongoose");
const cors = require("cors");
const sitemapRouter = require("./router/sitemapRouter");
const editorRouter = require("./router/editorRouter");
const userRouter = require("./router/userRouter");
const tagRouter = require("./router/tagRouter");
const categoryRouter = require("./router/categoryRouter");
const path = require("path");
const swaggerUi = require("swagger-ui-express");
const swaggerJsdoc = require("swagger-jsdoc");
const session = require("express-session");
const fs = require("fs");
require("dotenv").config();

const PORT = process.env.PORT;

mongoose.set("strictQuery", true);
mongoose
  .connect(process.env.CON_STR)
  .then(() => {
    console.log("連結到mongodb...");
  })
  .catch((e) => {
    console.log(e);
  });

app.use(
  session({
    secret: process.env.SESSIONSECRETKEY,
    // secret: crypto.randomUUID(),
    name: "sid", // optional
    cookie: {
      secure: false, //if set true only excute on https
      // path: userRouter,
      // maxAge: new Date(253402300000000), // Approximately Friday, 31 Dec 9999 23:59:59 GMT
      httpOnly: true,
      domain: "wilsonwan.com",
      expires: 1800000,
    },
    maxAge: 1800000, // Approximately Friday, 31 Dec 9999 23:59:59 GMT
    saveUninitialized: false,
    resave: false, //avoid server race condition
    // store: MongoStore.create({ mongoUrl: process.env.CON_STR }),
  })
);

// function getClientInfo(req) {
//   const clientInfo = {
//     http_client_ip: req.headers["http_client_ip"] || null,
//     http_x_forwarded_for: req.headers["x-forwarded-for"] || null,
//     http_x_forwarded: req.headers["x-forwarded"] || null,
//     http_x_cluster_client_ip: req.headers["x-cluster-client-ip"] || null,
//     http_forwarded_for: req.headers["forwarded-for"] || null,
//     http_forwarded: req.headers["forwarded"] || null,
//     remote_addr: req.connection.remoteAddress || null,
//     http_via: req.headers["via"] || null,
//   };

//   return clientInfo;
// }

// function logUserActivity(req, res, next) {
//   const method = req.method;
//   const path = req.path;
//   const ip = req.ip;

//   const allowedMethods = ["POST", "PATCH", "DELETE"];

//   if (allowedMethods.includes(method)) {
//     const clientInfo = getClientInfo(req);
//     const logMessage = `${method} request at ${
//       req.originalUrl
//     } with client info: ${JSON.stringify(
//       clientInfo
//     )} at ${new Date().toISOString()}\n`;
//     fs.appendFile("user_activity_log.txt", logMessage, (err) => {
//       if (err) {
//         console.error("Error writing to log file:", err);
//       }
//     });
//     next();
//   } else {
//     next(); // Make sure to call next() for methods not in allowedMethods
//   }
// }

// const options = {
//   definition: {
//     openapi: "3.0.0",
//     info: {
//       title: "SWAGGER_API",
//       version: "1.0.0",
//     },
//   },
//   // 指定从哪些文件中提取 Swagger 文档
//   apis: ["./router/*.js"],
// };
// const specs = swaggerJsdoc(options);
// function setupSwaggerUI(req, res, next) {
//   swaggerUi.setup(specs)(req, res, next);
// }

const corsOptions = {
  origin: [
    "http://localhost",
    "http://localhost:3000",
    "http://backstage.wilsonwan.com",
    "http://10.88.0.103:4200",
    "http://10.88.0.103:3000",
    "http://10.88.0.103:3001",
    "http://10.88.0.103",
    "http://127.0.0.1:5050",
  ],
  optionsSuccessStatus: 200, //
  credentials: true,
  // methods: ["GET", "POST", "PUT", "DELETE"],
  //some legacy browsers (IE11, various SmartTVs) choke on 204
};
const staticFolderPath = path.join(__dirname, "saved_image");
app.use("/saved_image", express.static(staticFolderPath));
app.use(express.static(__dirname));

app.use(express.json());
app.use(cors(corsOptions));

app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Credentials", true);
  res.header(
    "Access-Control-Allow-Origin",
    "http://localhost",
    "http://localhost:3000",
    "http://backstage.wilsonwan.com",
    "http://10.88.0.103:4200",
    "http://10.88.0.103:3000",
    "http://10.88.0.103:3001",
    "http://10.88.0.103",
    "http://127.0.0.1:5050"
  );
  res.header("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE,PATCH");
  res.header(
    "Access-Control-Allow-Headers",
    "X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept"
  );
  next();
});
// app.use(logUserActivity);
app.use(sitemapRouter);
app.use(editorRouter);
app.use(userRouter);
app.use(tagRouter);
app.use(categoryRouter);

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Something broke!");
});

app.listen(PORT, () => {
  console.log(`server started at port ${PORT}`);
});
