
exports.AddCategory=async(req,res)=>{
    
    // console.log(req.file.filename)
    const coverImg = req.file?.filename || null;
    console.log(coverImg);

    res.send("this is category controller");
}