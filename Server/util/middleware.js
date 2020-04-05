let jwt = require("jsonwebtoken");
const config = require("./config.js");

let checkToken = (req, res, next) => {
  let token =
    req.cookies.token ||
    req.headers["x-access-token"] ||
    req.headers["authorization"];
  // Express headers are auto converted to lowercase
  //
  console.log(req.cookies, req.body, req.headers);
  if (token) {
    if (token.startsWith("Bearer ")) {
      // Remove Bearer from string
      token = token.slice(7, token.length);
    }

    jwt.verify(token, config.secret, (err, decoded) => {
      if (err) {
        return res.json({
          success: false,
          message: "Token is not valid",
        });
      } else {
        if (decoded.isVerified || decoded.admin) {
          req.decoded = decoded;
          next();
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
    req.headers["authorization"];
  // Express headers are auto converted to lowercase
  // req.headers['x-access-token'] || req.headers['authorization'];
  console.log(req.cookies, req.body, req.headers);
  // console.log(token);
  if (token) {
    if (token.startsWith("Bearer ")) {
      // Remove Bearer from string
      token = token.slice(7, token.length);
    }

    jwt.verify(token, config.secret, (err, decoded) => {
      if (err) {
        return res.json({
          success: false,
          message: "Token is not valid",
        });
      } else {
        if (decoded.admin) {
          req.decoded = decoded;
          next();
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
