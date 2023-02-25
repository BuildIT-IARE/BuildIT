let middleware = require("../util/middleware.js");

module.exports = (app) => {
    const dbSub = require("../controllers/dbSubmission.controller.js");

    app.post("/dbSubmission",dbSub.create);

    app.post("/evaluateCode",dbSub.evaluateCode);

}