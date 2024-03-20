// here we are going to define the custom middleWares for the difernet erro handlings 


class CustomError extends Error{
    constructor(message,status= 500, error=[], stack=""){
        super(message);
        this.name= this.constructor.name
        this.status= status;
        this.error= error;
        if(stack){
            this.stack= stack
        }
        else{
            Error.captureStackTrace(this, this.constructor);
        }
     
    }
}
const errorHandling= (err,req, res, next)=>{
    console.log(err.stack);

    if(err instanceof CustomError){
        return res.status(err.status).json({error: err.message});
    }
    return res.status(500).json({error: "Internal Server Error"});
}

module.exports= {errorHandling, CustomError};