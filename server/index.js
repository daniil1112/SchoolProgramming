const express = require('express');
const passport = require("passport");
const bodyParser = require('body-parser');
const session = require("express-session");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const cors = require('cors');
const errorHandler = require ("errorhandler");
const path = require("path");
const mongoStore = require("connect-mongodb-session")(session);
const childProcess = require("child_process");

// Поддержка .env файлов
var dotenv = require('dotenv');
dotenv.config({path: path.join(__dirname, "/.env")});


const app = express();


mongoose.connect(process.env.DB_URL,{ useNewUrlParser: true,  useUnifiedTopology: true  });
mongoose.set('useCreateIndex', true);
if (process.env.PRODUCTION == 'false')  mongoose.set("debug", true);

require("./models/user");
require("./models/task");
require("./models/right");
require("./models/group");
require("./models/teacher");
require("./models/test");
require("./models/blocktestes");
require("./models/blocktestesreport");



app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());
app.use(session({
    cookie: { maxAge: Number.parseInt(process.env.SESSION_COOKIE_MAXAGE)},
    secret: process.env.SESSION_SECRET,
    saveUninitialized: process.env.SESSION_SAVEUNITIALIZED,
    resave: process.env.SESSION_RESAVE,
    store: new mongoStore({
            uri: process.env.DB_URL,
            collection: 'Sessions'
        }),
    }));


app.use('/',require('./routes/index'));


// Error Handler


app.listen(4000, async (req,res)=>{
    console.log("Сервер запущен");

    process.on('SIGINT', async ()=>{
        if (mongoose.connection.readyState !==0) await mongoose.connection.close();
        console.log("Сервер завершил работу");
        process.exit();
    }).on('uncaughtException',async (err) =>{
        if (mongoose.connection.readyState !==0) await mongoose.connection.close();
        console.log(err, " Uncaught Exception thrown");
        process.exit();
    }).on('unhandledRejection',async (reason, p)=>{
        //if (mongoose.connection.readyState !==0) await mongoose.connection.close();
        console.error(reason, 'Unhandled Rejection at Promise', p);
    })
});