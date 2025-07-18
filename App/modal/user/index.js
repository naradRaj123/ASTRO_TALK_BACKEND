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
    wallet:{
        type:Number,
        require:true,
        default:50
    },
   dob:{
    type:String,
    require:true,
    default:null,    
   },
   status:{
    type:Boolean,
    require:true,
    default:true,    
   },
   user_img:{
    type:String,
    require:true,
    default:null,
   },
   otp: {
        code: { type: Number },
        expiresAt: { type: Date },
        verified: { type: Boolean, default: false }
    },
},{
    timeseries:true,
});

const user_schema=mongoose.model('Users',UserRegisterSchema);
module.exports=user_schema;