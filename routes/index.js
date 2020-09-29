const express = require('express');
const router = express.Router();
//const signUp = require('./signup/index');
const room = require('./room/index');
//const naver = require('./naver/login');

router.get('/', (req, res) => {
    res.render('index');
});

//router.use('/signup', signUp);
router.use('/room', room);
//router.use('/login/naver', naver);

module.exports = router;