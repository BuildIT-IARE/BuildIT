const Participate = require("../models/participation.model.js");
const Participation = Participate.Participation;
const time = require("./time.js");

const Contest = require("../models/contest.model.js");

const SEEPracticalEvaluation = async (contestId) => {
    try {
        let contest = await Contest.findOne({contestId: contestId })
        let participations = await Participation.find({ contestId: contestId })
        let contestEndTime = time.parseDateTime(contest.contestDate, contest.contestEndTime);
        let now = time.now();
        if (!contest.evaluation && contestId.startsWith("SEE") && now >= contestEndTime){
            for ( let participation of participations ){
                let submissions = participation.submissionResults;
            
                submissions.sort((a, b) => {
                    return b.score - a.score;
                });
    
                const scoring_for_2_questions = {100: 25, 50: 13, 25: 7}
                const scoring_for_3rd_question = {100: 10, 50: 5, 25: 3}
                if (submissions.length >= 3){
                    submissions[0].score = scoring_for_2_questions[submissions[0].score];
                    submissions[1].score = scoring_for_2_questions[submissions[1].score];
    
                    submissions[2].score = scoring_for_3rd_question[submissions[2].score];
                }
                else if (submissions.length == 2){
                    submissions[0].score = scoring_for_2_questions[submissions[0].score];
                    submissions[1].score = scoring_for_2_questions[submissions[1].score];
                }
                else if (submissions.length == 1){
                    submissions[0].score = scoring_for_2_questions[submissions[0].score];
                }
    
                let UpdatedParticipation = new Participation(participation);
                await UpdatedParticipation.save();
            }    
            participations = await Participation.find({ contestId: contestId });
            await Contest.updateOne({ contestId: contestId }, { evaluation: true });
            return participations;
        }
        return participations;
        
    }
    catch(err){
        console.log("ERROR", err)
    }
}


module.exports = {
    SEEPracticalEvaluation
}