const random = require('randomstring');
const childProcess = require('child_process');
const mongoose = require("mongoose");
require('./../models/programAttemp');
require('./../models/programmingTask');

const ProgramAttempInDB = mongoose.model("programAttempt");
const ProgrammingTaskinDB = mongoose.model("programmingTask");


 class programService {
    container = null;
    id=null;
    programLang = null;
    program = null;
    input = [];
    output = [];
    compilerMSG = []; // Сообщение компилятора по тесту
    timer = [];
    compile = null;
    type = "student"; //Компиляция с проверкой либо без
     test = []; //тесты дял публичного отображения (Учительская часть)
     taskID = null; //опционально (Лучше через публичные задания)
     verdict = {}; //Вердик\report
     compilerVerdict = null; // Самый обычные, имеет два параметра (OK, CE )

    ProgramFileName = {
        pascalABCNet: `1.pas`
    };
    codeProgramLang = {
        1: 'pascalABCNet'
    };
    compileCommands = {
        pascalABCNet:`docker exec -i ${this.container} mono /compiler/pabcnetcclear.exe ${this.ProgramFileName.pascalABCNet}`
    };
    startCommand = {
        pascalABCNet:`docker run --name ${this.container} -itd pas:latest bash`
    };
    runProgramCommand = {
        pascalABCNet:`docker exec -i ${this.container} bash -c " mono 1.exe < input.txt"`
    };

    constructor(options) {
        this.id = options.id;
        this.container = random.generate(6);
        this.programLang = this.codeProgramLang[options.codeLang];
        this.startCommand = {
            pascalABCNet:`docker run --name ${this.container} -itd pas:late st bash`
        };
        this.compileCommands = {
            pascalABCNet:`docker exec -i ${this.container} mono /compiler/pabcnetcclear.exe ${this.ProgramFileName[this.programLang]}`
        };
        this.runProgramCommand = {
            pascalABCNet:`docker exec -i ${this.container} bash -c " mono 1.exe < input.txt"`
        };

        this.input = options.input;
        this.program = options.program;
        if(options.type) this.type = options.type;
        this.createContainer();
    };

    killContainer(){
        childProcess.exec(`docker kill ${this.container}; docker rm ${this.container}`,{shell: 'bash'});
    }

    createContainer()
    {
        const startContainer = childProcess.exec(this.startCommand.pascalABCNet,{shell: 'bash'});
        const Obj = this;
        startContainer.on("exit",function (data) {
            Obj.createProgramFile();
        })
    }

    createProgramFile()
    {
        const Obj = this;
        const createProgram = childProcess.exec(`(docker exec -i ${this.container} sh -c "cat >${this.ProgramFileName[this.programLang]}") <<< "`+this.program+'"',{shell: 'bash'});
        createProgram.on("exit",function (data) {
            Obj.compileProgram()
        })
    }

    compileProgram()
    {
        const Obj = this;
        let compileText = null;
        const compileProgram = childProcess.exec(this.compileCommands.pascalABCNet,{shell: 'bash'});
        compileProgram.on("exit",async function (code,signal) {

            if (code !==0) {
                console.log('Error: '+compileText);
                Obj.compile='CE';
                Obj.output.push('');
                Obj.killContainer();
                const DBprogram = await ProgramAttempInDB.findById(Obj.id);
                DBprogram.status = 'compiled';
                DBprogram.compilerMSG = 'CE';
                DBprogram.verdict = {
                    points: 0,
                    errors: true,
                    errorTest: 1,
                    errorReason: 'CE'
                };
                DBprogram.save()
            }
            else {
                Obj.compile='OK';
                console.log(compileText);
                Obj.startBlock(0);
            }
        });

        compileProgram.stdout.on('data', (data) => {
            if (compileText) compileText=compileText+data;
            else compileText=data

        });
        compileProgram.stderr.on('data', (data) => {
            console.error(`child stderr:\n${data}`);
        });
    }

    async startBlock(id)
    {
        const Obj = this;
        const inputId = id;
        if (id>=this.input.length){

            Obj.killContainer();
            const DBprogram =await ProgramAttempInDB.findOne({_id:Obj.id});
            if (DBprogram.parent){
                await this.check(DBprogram.parent,DBprogram);
            } else{
                Obj.updateDB(DBprogram)
            }

        }
        else {
        const formInput = childProcess.exec(`(docker exec -i ${this.container} sh -c "cat >input.txt") <<<"`+this.input[id]+'"',{shell: 'bash'});
        formInput.on("exit",function (code) {
            console.log('input set!');
            const runningProgram = childProcess.exec(Obj.runProgramCommand[Obj.programLang],{shell: 'bash'});
            //TODO timer
            const start = new Date().getTime();
            runningProgram.stdout.on('data', (data) => {
                Obj.output[id] = data;
            });
            runningProgram.stderr.on('data', (data) => {
                Obj.output[id] =data;
            });
            runningProgram.on("exit",(code)=>{
                if (code === 0){
                    console.log(Obj.output[id],id);
                    if (!Obj.output[id]) {
                        Obj.output[id] = '';
                        Obj.compilerMSG.push('ZO');
                        Obj.timer.push(new Date().getTime()-start)
                    } else {
                        Obj.compilerMSG.push('OK');
                        Obj.timer.push(new Date().getTime()-start)
                    }
                    Obj.startBlock(id+1);
                } else {
                    Obj.compilerMSG.push('RE');
                    Obj.killContainer()
                }

            })
        })}
    }
    async check(id,DBprogram)
    {
        const parent = await ProgramAttempInDB.findOne({_id: id});

        if (parent) {
            for (var i = 0; i < this.output.length; i++) {
                if (this.compilerMSG[i] !== 'ZO') {
                    if (this.timer[i] > (parent.time[i]*1.2)) this.compilerMSG[i] = 'TL';
                    else if (this.output[i] === parent.output[i]) this.compilerMSG[i] = 'OK';
                    else this.compilerMSG[i] = 'WA';
                }
                if ((i + 1) === this.output.length) {
                    this.updateDB(DBprogram);
                }
            }
        } else {
            this.updateDB(DBprogram);
        }
    }

    async updateDB(DBprogram)
    {
        DBprogram.output = this.output;
        DBprogram.status = 'compiled';
        DBprogram.time = this.timer;
        DBprogram.compilerMSG = this.compilerMSG;
        DBprogram.save();
        if ((DBprogram.taskId) && (DBprogram.compilerMSG.indexOf('CE') === -1) && (DBprogram.compilerMSG.indexOf('ZO') === -1) && (DBprogram.compilerMSG.indexOf('TL') === -1)){
            const task = await ProgrammingTaskinDB.findById(DBprogram.taskId);
            if (task){
                task.solved = true;
                task.solvedAttemp= DBprogram._id;
                task.save()
            }



        }
    }
}


module.exports = programService;