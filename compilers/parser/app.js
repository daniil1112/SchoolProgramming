const express = require('express');
const app = express();
const cors = require('cors');
const bodyParser = require('body-parser');
const mongoose = require("mongoose");
const path = require("path");


const programService = require('./services/programService');
const programLaunchService = require('./services/programLaunchService');

var dotenv = require('dotenv');
dotenv.config({path: path.join(__dirname, "/.env")});

mongoose.connect(process.env.DB_URL,{ useNewUrlParser: true,  useUnifiedTopology: true  });
mongoose.set('useCreateIndex', true);
if (process.env.PRODUCTION == 'false')  mongoose.set("debug", true);

require('./models/programAttemp');
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

const ProgramAttempInDB = mongoose.model("programAttempt");


app.listen(4041,async (data) =>{
    const parser = async function(){
      const program = await ProgramAttempInDB.findOne({status:"waiting"});
      if (program) {

          program.status = 'compiling';
          await program.save();
          let input;
          if (program.parent) {
              const parent = await ProgramAttempInDB.findOne({_id: program.parent});
              input = parent.input
          } else {
              input = program.input
          }
          // const compiler = new programService({
          //     codeLang:program.programLang,
          //     id:program._id,
          //     input:input,
          //     program:program.program
          // });
          const compiler = new programLaunchService({id:program._id})
      }
    };
    //TODO - потоки, не через timeout
    setInterval(parser,4000);

});
