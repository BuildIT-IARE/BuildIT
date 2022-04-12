module.exports = (app) => {
    const counters = require("../controllers/counters.controller.js");

    app.get('/getCounters' , counters.getCounters);
    
    app.post('/updateCountersDay/:count' ,  counters.updateDay);

    app.post('/updateCountersWeek' , counters.updateWeek);
}