const { Worker } = require('worker_threads');
const SkillUpModel = require("../../models/skillUp.model.js");

const updateScore = (data) => {
    if ("rollNumber" in data){
        return new Promise((resolve, reject) => {
            const worker = new Worker('./controllers/SkillUpUpdate/worker.js', {
                workerData: data
            })
            worker.once('message', (res) => {
                console.log(`Worker [${worker.threadId}]: ${res}`)
                resolve(res);
            })
            worker.once('error', (err) => {
                console.log(`Worker [${worker.threadId}]: Failed and Throws ${err}`)
                reject(err);
            })
        })
    }
    else{
        console.log("No Roll Number Found");
        return;
    }
    
}



function createPromises(skillUps, n){
    var arr = [];
    for(var i=0;i<n;i++){
        arr.push(updateScore(skillUps[i]._doc));
    }
    return arr;
}

const main = async () => {
    try {
        const skillUps = await SkillUpModel.find()
        var make_8 = parseInt(skillUps.length / 8);
        var remaining_of_8 = skillUps.length % 8;
        for (var i = 0; i < make_8; i++){
            createPromises(skillUps.slice(i * 8, (i + 1) * 8), 8);
        }
        for (var i = 0;i < remaining_of_8; i++){
            createPromises(skillUps.slice(make_8 * 8, make_8 * 8 + remaining_of_8), remaining_of_8);
        } 
    }
    catch (err) {
        console.log(err);
    }
}

module.exports = main;