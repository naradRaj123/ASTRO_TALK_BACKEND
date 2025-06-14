const mongoose=require('mongoose');

const CategorySchema=new mongoose.Schema({
    categoryName:{
        type:String,
        require:true,
        default:null,
    },
    categorySortTitle:{
        type:String,
        require:true,
        default:null,
    },
    categoryStatus:{
        type:Number,
        require:true,
        default:0,
    },
    categoryCoverImg:{
        type:String,
        require:true,
        default:null,
    }
},{
    timeseries:true
});

const Category_schema=mongoose.model('Category',CategorySchema);
module.exports=Category_schema;