const express = require('express');
const jwt = require('jsonwebtoken');
const passport = require("passport");

const resumeValidator = require('../validator/resume');
const experienceValidator = require('../validator/experience');

const resumes = require('../model/resume')
const users = require('../model/user')
const router = express.Router();

// $route   POST apis/resume
// @desc    获取登录后的简历信息
// @access  private
router.get('/',passport.authenticate('jwt',{session:false}),(req,res)=>{
    let errors={};
    resumes.findOne({user:req.user.id})
            .then(resume=>{
                if(!resume){
                    errors.noresume = '简历信息不存在'
                    return res.status(400).json(errors)
                }
                res.json(resume)
            })
            .catch(err=>{
                res.status(404).json(err)
            })
})

// $route   POST apis/resume
// @desc    更新添加简历
// @access  private
router.post('/',passport.authenticate('jwt',{ session: false }), (req, res) => {
    let {errs,errsIsEmpty} = resumeValidator(req.body);
    if(!errsIsEmpty){
        return res.status(400).json(errs);
    }
    let resumeDates = {};
    resumeDates.user = req.user.id;

    if(typeof req.body.skills !== 'undefined') resumeDates.skills = req.body.skills.split(',');

    resumeDates.experience = {};
    if(req.body.position) resumeDates.experience.position = req.body.position;
    if(req.body.company) resumeDates.experience.company = req.body.company;
    if(req.body.from) resumeDates.experience.from = req.body.from;
    if(req.body.to) resumeDates.experience.to = req.body.to;
    if(req.body.description) resumeDates.experience.description = req.body.description;


    resumes.findOne({user:req.user.id})
            .then(resume=>{
                if(resume){
                    resumes.findOneAndUpdate(
                        {user:req.user.id},
                        {$set:resumeDates}
                    ).then(resume=>{
                        return res.json(resume);
                    })
                    .catch(err=>{
                        res.status(400).json(err);
                    })
                }else{
                    new resumes(resumeDates).save()
                    .then(resume=>{
                        res.json(resume);
                    })
                    .catch(err=>{
                        res.status(400).json(err);
                    })
                }
                
                
            })
})

// $route   GET apis/resume/user/:id
// @desc    根据id查询
// @access  public
router.get('/user/:id',(req,res)=>{
    let errors ={};
    resumes.findOne({user:req.params.id})
        .populate('user',['email','name'])
        .then(resume=>{
            if(!resume){
                errors.noresume = '未找到该用户简历信息';
                res.status(404).json(errors);
                return;
            }
            res.json(resume);
        })
        .catch(err=>{
            res.status(404).json(err);
        })
})


// $route   GET apis/resume/all
// @desc    查询所有信息
// @access  public
router.get('/all',(req,res)=>{
    resumes.findOne()
        .then(resume=>{
            
            if(!resume){
                errors.noresume = '没有任何简历信息';
                res.status(404).json(errors);
                return;
            }
            res.json(resume);
        })
        .catch(err=>{
            res.status(404).json(err);
        })
})

// $route   POST apis/resume/experience/add
// @desc    添加经历
// @access  private
router.post('/experience/add',passport.authenticate('jwt',{ session: false }),(req,res)=>{
    let {errs,errsIsEmpty} = experienceValidator(req.body);

    if(!errsIsEmpty){
        return res.status(400).json(errs);
    }

    resumes.findOne({user:req.user.id})
            .then(resume=>{
                let experience = {};

                experience.position = req.body.position;
                experience.company = req.body.company;
                experience.from = req.body.from;
                experience.to = req.body.to;
                // experience.description = req.body.description;

                resume.experience.unshift(experience);
                resume.save()
                    .then(resume=>{                        
                        res.json(resume);
                    })
                    .catch(err=>{
                        res.status(400).json(err);
                    })
                    
            })
            .catch(err=>{
                res.status(400).json(err);
            })
})

module.exports = router;