const express = require('express');
const bodyParser = require('body-parser');
const session = require("express-session");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const cors = require('cors');
const path = require("path");



// Поддержка .env файлов
let dotenv = require('dotenv');
dotenv.config({path: path.join(__dirname, "/.env")});


const app = express();

const connectionDB = function(){
    mongoose.connect(process.env.DB_URL,{
        useUnifiedTopology: true,
        useNewUrlParser: true,
        reconnectTries: 30,
        reconnectInterval: 500,
        server: {
            socketOptions: {
                socketTimeoutMS: 0,
                connectTimeoutMS: 0
            }
        }
    }).catch(error =>{
        connectionDB();
    });
};

connectionDB();

mongoose.set('useCreateIndex', true);
if (process.env.PRODUCTION === 'false')  mongoose.set("debug", true);

require("./models/user");
require("./models/task");
require("./models/right");
require("./models/group");
require("./models/teacher");
require("./models/test");
require("./models/blocktestes");
require("./models/blocktestesreport");
require("./models/programmingTask");
require('./models/material');
require('./models/programAttemp');
require('./models/programmingVerdict');
require('./models/lessons');
require('./models/grouptask');
require('./models/report');
require('./models/programmingLangs');
require('./models/theme');


app.use(cors());
app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({extended: true,limit: '50mb'}));
app.use(cookieParser());
app.use('/',require('./routes/index'));

app.listen(4000, async (req,res)=>{
    console.log("Сервер запущен на порту 4000");



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