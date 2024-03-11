const axios = require('axios');
const time = require('./time.js');

let isContestOnGoing = async (contestId, getDurationOfContest, isAdmin) => {
    const durationData = await getDurationOfContest(contestId);
    if (durationData){
        let now = time.now();
        let start = time.parseDateTime(durationData.date, durationData.startTime);
        let end = time.parseDateTime(durationData.date, durationData.endTime);
        if ((now >= start && now <= end) || isAdmin) {
            return [true, durationData.mcq];
        }
        else{
            return [false, durationData.mcq];
        }
    }
    else{
        return [false, false];
    }
}


let checkTestcase = async (testcase, postUrl, source_code, language_id, apiAddress) => {
    let testcase_token = await axios.post(postUrl, {
        source_code: source_code,
        language_id: language_id,
        stdin: testcase.input,
        expected_output: testcase.output,
    });
    testcase_token = testcase_token.data.token;
    // console.log(testcase_token);
    let result = await axios.get(apiAddress + "/submissions/" + testcase_token);
    // console.log(result.data);
    if (result.data.status.id === 3){
        return {
            points: 1,
            description: result.data.status.description,
            token: testcase_token
        }
    }
    else if (result.data.status.id > 3){
        return {
            points: 0,
            description: result.data.status.description,
            token: testcase_token
        }
    }
    else{
        return Error("Something went wrong");
    }
}

let checkUserLoggedIn = async (sessionId, clientAddress) => {
    let user = await axios.get(`${clientAddress}/userSession/${sessionId}`)
    if (user.status === 200){
        return true;
    }
    else{
        return false;
    }
}

module.exports = {
    isContestOnGoing,
    checkTestcase,
    checkUserLoggedIn
}