const axios = require('axios');

let isContestOnGoing = async (contestId, getDurationOfContest, isAdmin) => {
    const durationData = await getDurationOfContest(contestId);
    if (durationData){
        let today = new Date().setHours(0, 0, 0, 0);
        let date = new Date(durationData.date).setHours(0, 0, 0, 0);
        let time_now = new Date().getTime();
        let start_time = new Date().setHours(durationData.startTime.slice(0, 2), durationData.startTime.slice(2), 0, 0);
        let end_time = new Date().setHours(durationData.endTime.slice(0, 2), durationData.endTime.slice(2), 0, 0);
        if ((today === date && time_now >= start_time && time_now <= end_time) || isAdmin) {
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
    let result = await axios.get(apiAddress + "/submissions/" + testcase_token);
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