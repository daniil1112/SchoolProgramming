const random = require('randomstring');
const childProcess = require('child_process');
const mongoose = require("mongoose");
require('./../models/programAttemp');
require('./../models/programmingTask');

const ProgramAttempInDB = mongoose.model("programAttempt");
const ProgrammingTaskinDB = mongoose.model("programmingTask");


class programLaunchService {
    container = null;
    id=null;
    parentOBJ = null; // родительская программа (опционально)
    childOBJ = null; //Главная программа для проверки
    programLang = null;
    program = null;
    input = [];
    output = [];
    compilerMSG = []; // Сообщение компилятора по тесту
    compilerText = null;
    timer = [];
    timeLimit= [] ;// для ученика TL
    compile = null;
    //type = "student"; //Компиляция с проверкой либо без
    test = []; //тесты дял публичного отображения (Учительская часть)
    taskID = null; //опционально (Лучше через публичные задания)
    verdict = {}; //Вердик\report
    compilerVerdict = null; // Самый обычные, имеет два параметра (OK, CE )

    ProgramFileName = {
        1: `1.pas`
    };

    compileCommands = {
        1:`docker exec -i ${this.container} mono /compiler/pabcnetcclear.exe ${this.ProgramFileName.pascalABCNet}`
    };
    startCommand = {
        1:`docker run --name ${this.container} -itd pas:latest bash`
    };
    runProgramCommand = {
        1:`docker exec -i ${this.container} bash -c " mono 1.exe < input.txt"`
    };

     constructor(options) {
        //техническая информация
        if (options.container){
            this.container = options.container
        } else {
            this.container = random.generate(6);
        }

        this.getparentAndChild(options).then(() =>{
            //Формирование всех данных

            if (options.input) {
                this.childOBJ.input = options.input
            } else if (this.childOBJ.input){

            } else if (this.parentOBJ) {
                this.childOBJ.input = this.parentOBJ.input;
            } else {
                throw new Error("Undefined input in programService");
            }

            // Create launch commands
            this.createCommands();

            if (options.timer) {
                this.timeLimit = options.timeLimit
            } else if (this.parentOBJ)
            {
                this.timeLimit = this.parentOBJ.time;
            } else {
                for (let i; i++ ; i<this.input.length)
                    this.timeLimit.push("10000")
            }

            this.createContainer();
        })

    };

    async getparentAndChild(options)
    {
        if (options.id){
            this.childOBJ = await ProgramAttempInDB.findById(options.id)
        } else {
            throw new Error(`Program with id: ${options.id} not found`)
        }
        if (this.childOBJ.parentID) {
            this.parentOBJ = await ProgramAttempInDB.findById(this.childOBJ.parentID);
        }
    }


    createCommands(){
        this.startCommand = {
            1:`docker run --name ${this.container} -itd pas:latest bash`
        };
        this.compileCommands = {
            1:`docker exec -i ${this.container} mono /compiler/pabcnetcclear.exe ${this.ProgramFileName[this.childOBJ.programLang]}`
        };
        this.runProgramCommand = {
            1:`docker exec -i ${this.container} bash -c " mono 1.exe < input.txt"`
        };
    }

    killContainer(){
        childProcess.exec(`docker kill ${this.container}; docker rm ${this.container}`,{shell: 'bash'});
    }

    createContainer()
    {
        const startContainer = childProcess.exec(this.startCommand[this.childOBJ.programLang],{shell: 'bash'});
        const Obj = this;
        startContainer.on("exit",function (data) {
            Obj.createProgramFile();
        })
    }

    createProgramFile()
    {
        const Obj = this;
        const createProgram = childProcess.exec(`(docker exec -i ${this.container} sh -c "cat >${this.ProgramFileName[this.childOBJ.programLang]}") <<< "`+this.childOBJ.program+'"',{shell: 'bash'});
        console.log(`(docker exec -i ${this.container} sh -c "cat >${this.ProgramFileName[this.childOBJ.programLang]}") <<< "`+this.childOBJ.program+'"')
        createProgram.on("exit",function (code) {
            if (code === 0) Obj.compileProgram();
            else {
                throw new Error(`Failed creating program file with code: ${code}`)
            }

        })
    }

    compileProgram()
    {
        const Obj = this;
        const compileProgram = childProcess.exec(this.compileCommands[this.childOBJ.programLang],{shell: 'bash'});
        compileProgram.on("exit",async function (code) {
            if (code !==0) {
                Obj.childOBJ.verdict = {
                    points: 0,
                    compiler: 'CE',
                    compilerError : Obj.compileText
                };
                Obj.childOBJ.save();
                Obj.killContainer();
            }
            else {
                Obj.startBlock(0);
            }
        });

        compileProgram.stdout.on('data', (data) => {
            if (Obj.compileText) Obj.compileText=Obj.compileText+data;
            else Obj.compileText=data
        });
    }

    async startBlock(id)
    {

        const Obj = this;
        if (id>=this.childOBJ.input.length){
            this.killContainer();
            this.check();
        }
        else {
            const formInput = childProcess.exec(`(docker exec -i ${this.container} sh -c "cat >input.txt") <<<"`+this.childOBJ.input[id]+'"',{shell: 'bash'});
            formInput.on("exit",function (code) {
                console.log('input set!');
                const runningProgram = childProcess.exec(Obj.runProgramCommand[Obj.childOBJ.programLang],{shell: 'bash'});
                const start = new Date().getTime();
                runningProgram.stdout.on('data', (data) => {
                    console.log(data);
                    Obj.childOBJ.output[id] = data;
                });
                runningProgram.stderr.on('data', (data) => {
                    Obj.childOBJ.compilerMSG[id] ='RE';
                });
                runningProgram.on("exit",(code)=>{
                    if (code === 0){
                        if (!Obj.childOBJ.output[id]) {
                            Obj.output[id] = '';
                            Obj.childOBJ.compilerMSG[id] ='ZO';
                        } else {
                            Obj.childOBJ.compilerMSG.push('LOK'); //LOK-launch OK
                        }
                        Obj.childOBJ.time.push(new Date().getTime()-start);
                        Obj.startBlock(id+1);

                    } else {
                        Obj.childOBJ.compilerMSG('RE');
                        Obj.killContainer()
                    }

                })
            })}
        //TODO check results
    }
    check()
    {
        if (this.parentOBJ) {
            for (var i = 0; i < this.childOBJ.output.length; i++) {
                if (this.childOBJ.time[i] > (this.parentOBJ.time[i] * 1.2)) this.childOBJ.compilerMSG[i] = 'TL';
                else if (this.childOBJ.output[i] === this.parentOBJ.output[i]) this.childOBJ.compilerMSG[i] = 'OK';
                else this.childOBJ.compilerMSG[i] = 'WA'
            }
        }
        this.createReport();

    }

    createReport(){
        if (this.childOBJ.type = 'student') {
            let points = 0;
            for (let compilerMSG in this.childOBJ.compilerMSG) {
                if (compilerMSG === 'OK') points++;
            }
            points = parseInt((points/this.childOBJ.compilerMSG.length)*100);
            this.childOBJ.verdict = {
                compiler: 'OK',
                points
            };
            this.childOBJ.save();
        }
    }



}


module.exports = programLaunchService;