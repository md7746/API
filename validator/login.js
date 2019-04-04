const validator = require('validator');
const isEmpty = require('./is-empty');

module.exports = user=>{
    let errs = {}

    user.email = isEmpty(user.email)?'':user.email;
    user.password = isEmpty(user.password)?'':user.password;

    if(!validator.isEmail(user.email)){       
        errs.email = "邮箱不合法";
    }
    if(validator.isEmpty(user.email)){       
        errs.email = "邮箱不能为空";
    }
    if(validator.isEmpty(user.password)){       
        errs.password = "密码不能为空";
    }

    return{
        errs,
        errsIsEmpty:isEmpty(errs)
    }
}