import db from './models/index.mjs';

const formatErrors=(e)=>{
    //console.log("formaterrors", e.errors);
    //console.log("validationError", db.Sequelize.ValidationError);
    if(e instanceof db.Sequelize.ValidationError){
        const {errors}=e;
        let errs=errors.map((x)=>{
            console.log("x",x.path,x.message);
            return {path:x.path,message:x.message};
        });
        //pick=_.pick(e.errors[0],[path,message]);
        console.log("Errs",errs);
        console.log("Errors",e.errors.length);
        return errs;
    }
    console.log("error independiente",e);
    return [{path:"Autorizacion",message:e.message}];
};

export default formatErrors;