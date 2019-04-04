const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const passport = require("passport");

const registerValidator = require('../validator/register');
const loginValidator = require('../validator/login');
const users = require('../model/user')

const router = express.Router();

// $route   GET apis/users/test
// @desc    返回请求的json数据
// @access  public
router.get('/test', (req, res) => {
    res.json({
        msg: 'ok'
    })
})

// $route   POST apis/users/register
// @desc    注册
// @access  public
router.post('/register', (req, res) => {
    let { errs, errsIsEmpty } = registerValidator(req.body);
    if (!errsIsEmpty) {
        res.status(400).json(errs);
        return
    }
    users.findOne({ email: req.body.email })
        .then(user => {
            if (user) {
                return res.status(400).json({ msg: '用户已存在' });
            } else {
                let user = new users({
                    name: req.body.name,
                    email: req.body.email,
                    password: req.body.password
                })
                bcrypt.genSalt(10, function (err, salt) {
                    bcrypt.hash(user.password, salt, function (err, hash) {
                        if (err) throw err;
                        user.password = hash;
                        user.save()
                            .then(user => {                             
                                res.json(user)
                            })
                            .catch(err => {
                                console.log(err)
                            })
                    });
                });
            }

        })
        .catch(err => {
            console.log(err)
        })
})

// $route   POST apis/users/login
// @desc    登录
// @access  private
router.post('/login', (req, res) => {
    let { errs, errsIsEmpty } = loginValidator(req.body);
    if (!errsIsEmpty) {
        res.status(400).json(errs);
        return
    }
    users.findOne({ email: req.body.email })
        .then(user => {
            if (user) {
                bcrypt.compare(req.body.password, user.password)
                    .then(isMatch => {
                        if (isMatch) {
                            let rule = { id: user.id, name: user.name };
                            jwt.sign(rule, 'secret', { expiresIn: 3600 }, (err, token) => {
                                res.json({
                                    success: true,
                                    token: "Bearer " + token
                                });
                            })
                        } else {
                            res.status(400).json({ msg: '密码有误' })
                        }
                    });
            } else {
                res.status(404).json({ msg: "用户不存在" })
            }
        })
        .catch(err => {
            console.log(err);
        })

})

// $route  GET api/users/info
// @desc   return users info
// @access Private
router.get('/info', passport.authenticate('jwt', { session: false }), (req, res) => {
    users.find({ email: req.body.email })
        .then(user => {
            res.json({
                id: req.user.id,
                name: req.user.name,
                email: req.user.email
            })
        })
        .catch(err => {
            console.log(err)
        })
})

module.exports = router;