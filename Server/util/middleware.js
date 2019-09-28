let jwt = require('jsonwebtoken');
const config = require('./config.js');

let checkToken = (req, res, next) => {
  let token = req.cookies.token; 
  // Express headers are auto converted to lowercase
  // req.headers['x-access-token'] || req.headers['authorization'];
  if (token) {
    if (token.startsWith('Bearer ')) {
      // Remove Bearer from string
      token = token.slice(7, token.length);
    }

    jwt.verify(token, config.secret, (err, decoded) => {
      if (err) {
        return res.json({
          success: false,
          message: 'Token is not valid'
        });
      } else {
        req.decoded = decoded;
        next();
      }
    });
  } else {
    return res.json({
      success: false,
      message: 'Auth token is not supplied'
    });
  }
};

let checkTokenAdmin = (req, res, next) => {
  let token = req.cookies.token; 
  // Express headers are auto converted to lowercase
  // req.headers['x-access-token'] || req.headers['authorization'];
  if (token) {
    if (token.startsWith('Bearer ')) {
      // Remove Bearer from string
      token = token.slice(7, token.length);
    }

    jwt.verify(token, config.secret, (err, decoded) => {
      if (err) {
        return res.json({
          success: false,
          message: 'Token is not valid'
        });
      } else {
        if (decoded.admin){
          req.decoded = decoded;
          next();
        } else {
          return res.json({
            success: false,
            message: "Unauthorized Access"
          });
        }
      }
    });
  } else {
    return res.json({
      success: false,
      message: 'Auth token is not supplied'
    });
  }
};
module.exports = {
  checkToken,
  checkTokenAdmin
}

