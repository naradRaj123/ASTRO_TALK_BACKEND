const mongoose=require('mongoose');

const paymentSchema=new mongoose.Schema({
    astrologerId:{
        type:String,
        require:true,
        default:null,
    },
    requestAmount:{
        type:Number,
        require:true,
        default:0
    },
    transactionId:{
        type:String,
        default:null,
    },
    paymentStatus:{
        type:Boolean,
        require:true,
        default:false,
    }
},{
    timestamps:true
});

const paymentRequestSchema=mongoose.model('paymentRequest',paymentSchema);
module.exports=paymentRequestSchema;

