const User = require("../models/user.model.js");
let jwt = require("jsonwebtoken");

let checkToken = (req, res, next) => {
  let token =
    req.cookies.token ||
    req.headers["x-access-token"] ||
    req.headers["authorization"];
  // Express headers are auto converted to lowercase
  //
  if (token) {
    if (token.startsWith("Bearer ")) {
      // Remove Bearer from string
      token = token.slice(7, token.length);
    }

    jwt.verify(token, process.env.secret, async (err, decoded) => {
      if (err) {
        return res.json({
          success: false,
          message: "Token is not valid",
        });
      } else {
        if (decoded.isVerified || decoded.admin) {
          const verifiedLogin = await User.findOne({
            username: decoded.username,
          });
          req.decoded = decoded;
          if (
            verifiedLogin &&
            verifiedLogin.loginStatus === decoded.loginStatus
          ) {
            next();
          } else {
            return res.json({
              success: false,
              message: "Unauthorized Access",
            });
          }
        } else {
          return res.json({
            success: false,
            message: "Please verify your account to continue",
          });
        }
      }
    });
  } else {
    return res.json({
      success: false,
      message: "Auth token is not supplied",
    });
  }
};

let checkTokenAdmin = (req, res, next) => {
  let token =
    req.cookies.token ||
    req.headers["x-access-token"] ||
    req.headers["authorization"] ||
    req.body.token;
  // Express headers are auto converted to lowercase
  // req.headers['x-access-token'] || req.headers['authorization'];
  console.log("TOKEN" + token);
  console.log("REQBODY" + JSON.stringify(req.body));
  if (token) {
    if (token.startsWith("Bearer ")) {
      // Remove Bearer from string
      token = token.slice(7, token.length);
    }

    jwt.verify(token, process.env.secret, async (err, decoded) => {
      if (err) {
        return res.json({
          success: false,
          message: "Token is not valid",
        });
      } else {
        if (decoded.admin) {
          const verifiedLogin = await User.findOne({
            loginStatus: decoded.loginStatus,
          });
          req.decoded = decoded;
          if (verifiedLogin) {
            next();
          } else {
            return res.json({
              success: false,
              message: "Unauthorized Access",
            });
          }
        } else {
          return res.json({
            success: false,
            message: "Unauthorized Access",
          });
        }
      }
    });
  } else {
    return res.json({
      success: false,
      message: "Auth token is not supplied",
    });
  }
};
module.exports = {
  checkToken,
  checkTokenAdmin,
};
