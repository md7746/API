const validator = require('validator');
const isEmpty = require('./is-empty');

module.exports = user=>{
    let errs = {}

    user.name = isEmpty(user.name)?'':user.name;
    user.email = isEmpty(user.email)?'':user.email;
    user.password = isEmpty(user.password)?'':user.password;
    user.password2 = isEmpty(user.password2)?'':user.password2;

    if(!validator.isLength(user.name,{min:2,max:30})){       
        errs.name = "2<=名字长度<=30";
    }
    if(validator.isEmpty(user.name)){       
        errs.name = "用户名不能为空";
    }

    if(validator.isEmpty(user.email)){       
        errs.email = "邮箱不能为空";
    }
    if(!validator.isEmail(user.email)){       
        errs.email = "邮箱不合法";
    }

    if(!validator.isLength(user.password,{min:6,max:30})){ 
        errs.password = "6<=名字长度<=30";
    }
    if(validator.isEmpty(user.password)){       
        errs.password = "密码不能为空";
    }
    if(validator.isEmpty(user.password2)){       
        errs.password2 = "重复密码不能为空";
    }
    if(!validator.equals(user.password,user.password2)){
        errs.password2 = "两次密码不一致";
    }

    return{
        errs,
        errsIsEmpty:isEmpty(errs)
    }
}