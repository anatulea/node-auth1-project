/* eslint-disable no-use-before-define */
/* eslint-disable no-undef */
/* eslint-disable prefer-const */
const router = require('express').Router();
const bcrypt = require('bcryptjs');

const jwt = require('jsonwebtoken');
const secret = require('../config/secret.js');
const Users = require('../users/users-model.js');

// const authorize = require('../middleweare');

router.post('/register', (req, res) => {
  const user = req.body;

  const hash = bcrypt.hashSync(user.password, 8);

  user.password = hash;

  Users.add(user)
    .then((saved) => {
      const token = generateToken(saved);
      res.status(201).json({
        created_user: saved,
        id: saved.id,
        token,
        message: "You've successfully created a new user",
      });
    })
    .catch((err) => {
      res.status(500).json({ message: 'Registration error!', error: err });
    });
});

// router.post('/login', authorize, (req, res) => {
//   const { username } = req.headers;
//   res.status(200).json({ message: `Welcome ${username}!` });
// });

function generateToken(user) {
  const payload = {
    subject: user.id,
    username: user.username,
  };

  const options = {
    expiresIn: '1h',
  };

  return jwt.sign(payload, secret.jwtSecret, options);
}

router.post('/login', (req, res) => {
  let { username, password } = req.body;

  Users.findBy({ username })
    .first()
    .then((user) => {
      if (user && bcrypt.compareSync(password, user.password)) {
        const token = generateToken(user);
        req.session.user = username;
        res.status(200).json({
          username: user.username,
          id: user.id,
          message: `Welcome to the app ${username} !`,
          token,
        });
      } else {
        res.status(401).json({ message: 'Invalid credentials' });
      }
    })
    .catch((err) => { res.status(500).json({ message: 'Problem with the db', error: err }); });
});

router.delete('/logout', (req, res) => {
  if (req.session) {
    req.session.destroy((err) => {
      if (err) {
        res.status(400).json({ message: 'error logging out:', error: err });
      } else {
        res.json({ message: 'logged out' });
      }
    });
  } else {
    res.end();
  }
});

module.exports = router;
