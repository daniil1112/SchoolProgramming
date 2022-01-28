

function validateService() {
    const teacher =_=>{
        const CreateTestValidate = data => {
            // 1 - Ошибка длинны задания и заголовка
            // 2 -Неверный формат типа задания
            // 3 - Неверное количество вариантов ответов
            // 4 - неверный формат правильного ответа
            if (!data.task || !data.title ||
                typeof data.task !== 'string' || typeof data.title !== 'string' ||
                data.title.trim().length < 3 || data.title.trim().length >70 ||
                data.task.trim().length < 10 || data.task.trim().length > 700) {
                return {
                    code: 1,
                }
            } else if (!data.type || typeof data.type !== 'number' || data.type < 1 || data.type > 3) return { code : 2 };

            if (data.type === 1){
                if (!data.answerChoice || typeof data.answerChoice !== 'object' || data.answerChoice.length < 2) return  {code : 3 };
                else if (!data.rightAnswer || typeof data.rightAnswer !== 'number' || data.rightAnswer < 1) return { code : 4 }
            }
            else if  (data.type === 2){
                if (!data.answerChoice || typeof data.answerChoice !== 'object' || data.answerChoice.length < 2) return  {code : 3 };
                else if (!data.rightAnswer || typeof data.rightAnswer !== 'object' || data.rightAnswer.length < 1) return { code : 4 }
            } else {
                if (!data.rightAnswer || typeof data.rightAnswer !== 'string' || data.rightAnswer.trim().length === 0) return { code : 4 }
            }
            return { code: false }
        };

        const CreateProgrammingTaskValidate = data => {
            // 1 - Ошибка в заголовке или задании
            // 2 - Ошибка в примерах
            if (!data.title || !data.task || (typeof data.title !== 'string') || (typeof data.task !== 'string') || data.title.length < 3 || data.title.length > 70 || data.task.length < 10 || data.task.length > 700 ) return {code: 1};
            if (!data.examples || (typeof data.examples !== 'object') || data.examples.length === 0) return { code : 2};
            return { code : false}
        };

        return {
            CreateTestValidate, CreateProgrammingTaskValidate
        }
    };

    return {
        teacher
    }
}


module.exports = validateService;