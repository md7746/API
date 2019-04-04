const validator = require('validator');
const isEmpty = require('./is-empty');

module.exports = resume=>{
    let errs = {}

    resume.skills = isEmpty(resume.skills)?'':resume.skills;

    if(validator.isEmpty(resume.skills)){       
        errs.skills = "技能不能为空";
    }

    return{
        errs,
        errsIsEmpty:isEmpty(errs)
    }
}