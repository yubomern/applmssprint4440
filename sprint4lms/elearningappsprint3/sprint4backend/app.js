const express = require(`express`);
const ErrorHandler = require("./utils/ErrorHandler");
const app = express();
const cookieParser = require(`cookie-parser`);
const bodyParser = require(`body-parser`);
const cors = require(`cors`);
const path = require("path");
const cookieSession = require(`cookie-session`);
const passport = require(`passport`)



//const mongoose = require("mongoose");

const chaptersRoutes = require("./routes/chapters");
const CoursesRoutes  = require('./routes/course');
const moduleRoutes = require("./routes/module");


const routes = require("./routes/ToDoRoute");
const uploadRoutes = require("./routes/uploadRoutes");
const { socketController } = require("./controllers/chatController");

const server = require("http").createServer(app);

// socket.io and then i added cors for cross origin to localhost only
const io = require("socket.io")(server, {
    cors: {
        origin: "*", //specific origin you want to give access to,
    },
});

socketController(io);


const corsOptions = {
    origin: "*",
    credentials: true, //access-control-allow-credentials:true
    optionSuccessStatus: 200,
};

app.use(cors(corsOptions)); // Use this after the variable declaration

app.get(`/`, (req, res) => {
  res.send(`Hello From the Backend Server`);
});

app.use(express.json());
app.use(cookieParser());
app.use(
  cookieSession({
    name: "session",
    keys: ["token"],
    maxAge: 24 * 60 * 60 * 100,
  })
);

app.use(passport.initialize())
app.use(passport.session())

app.use(
  cors({
    origin: [
      "https://shop0-bice.vercel.app",
      "http://192.168.1.100:1001",
      "http://localhost:1001",
      "http://localhost:3001",
      "http://127.0.0.1:1001",
      "http://127.0.0.1:3001",
    ],

    credentials: true,
  })
);

// Serve static files from the 'uploads' directory
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use(bodyParser.urlencoded({ extended: true }));

// Importing routes
const user = require(`./controllers/user`);
const contactForm = require(`./controllers/contactForm`);
const  tag  =  require("./controllers/TagController");
const categoy =  require("./controllers/CategoryController");
const  uploadfile  = require('./controllers/uploadserver');
app.use('/api/v1/cat', categoy);
app.use('/api/v1/tag',tag);
app.use(`/api/v2/user`, user);
app.use(`/api/v2/contactForm`, contactForm);
app.use(`/api/v2/upload`, uploadfile);
// not found route
app.all("*", (req, res) => {
  res.status(404).send("This Page is not found");
});
// For error handling
app.use(ErrorHandler);

module.exports = app;
