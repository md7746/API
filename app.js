const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const passport = require('passport');

const app = new express();

//middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(passport.initialize());
require('./passport/jwt')(passport);


const port = process.env.port || 5000;
app.listen(port,()=>{})

mongoose.connect('mongodb://localhost/api')//更换成开发环境数据库
    .then(() => {
        console.log('connected...')
    })
    .catch(err => {
        console.log(err)
    })

//routes
const users = require('./apis/users')
const resume = require('./apis/resume')
app.use('/users',users);
app.use('/resume',resume);