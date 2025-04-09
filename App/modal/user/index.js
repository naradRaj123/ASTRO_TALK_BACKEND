const mongoose=require('mongoose')

const UserRegisterSchema=new mongoose.Schema({
    user_name:{
        type:String,
        require:true,
        default:null,
    },
    user_phone:{
        type:Number,
        require:true,
        default:null,
        unique:true,
    },
    email:{
        type:String,
        require:true,
        unique:true
    },
    password:{
        type:String,
        require:true,
        default:null,
    },
   
},{
    timeseries:true,
});

const user_schema=mongoose.model('Users',UserRegisterSchema);
module.exports=user_schema;