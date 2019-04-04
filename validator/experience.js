const validator = require('validator');
const isEmpty = require('./is-empty');

module.exports = expreience=>{
    let errs = {}

    expreience.position = isEmpty(expreience.position)?'':expreience.position;
    expreience.company = isEmpty(expreience.company)?'':expreience.company;
    expreience.from = isEmpty(expreience.from)?'':expreience.from;
    expreience.to = isEmpty(expreience.to)?'':expreience.to;


    if(!validator.isLength(expreience.position,{min:2,max:30})){
        errs.position = "2<=职位名<=30";
    }
    if(validator.isEmpty(expreience.position)){       
        errs.position = "职位不能为空";
    }
    if(validator.isEmpty(expreience.company)){       
        errs.company = "公司不能为空";
    }
    if(validator.isEmpty(expreience.from)){       
        errs.from = "开始时间不能为空";
    }
    if(validator.isEmpty(expreience.to)){       
        errs.to = "到何时不能为空";
    }

    return{
        errs,
        errsIsEmpty:isEmpty(errs)
    }
}