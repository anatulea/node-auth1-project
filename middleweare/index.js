// The restricted function
// checks to see if req.session has a "user" object.
// It will if :
// 1) the session object is not expired, and
// 2) the session object was modified by the /login
// handler, by adding a "user" property to it.

// module.exports = (req, res, next) => {
//   if (req.session && req.session.user) {
//     next();
//   } else {
//     res.status(401).json({ message: 'not logged in' });
//   }
// };


const jwt = require('jsonwebtoken');
const secret = require('../config/secret.js');
// be used on the '/api/users' end point to verify if the user is logged in
// it checks for the token
module.exports = (req, res, next) => {
  const token = req.headers.authorization;

  if (token) {
    next();
  } else if (token) {
    jwt.verify(token, secret.jwtSecret, (err, decodedJwt) => {
      if (err) {
        res.status(401).json({ message: 'access denied' });
      } else {
        req.decodedJwt = decodedJwt;
        next();
      }
    });
  } else {
    res.status(401).json({ message: 'access denied' });
  }
};
