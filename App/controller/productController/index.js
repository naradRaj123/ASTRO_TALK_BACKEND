require('dotenv').config();
const fs = require('fs');
const ProductSchema = require('../../modal/product/index.js');
const path=require('path')
// razorpay payment
const Razorpay = require('razorpay');
const product_schema = require('../../modal/product/index.js');

const instance = new Razorpay({
  key_id: 'rzp_test_6m5EFshHcmM2o1',
  key_secret: 'naradraj123@'
})

// delete image function
const deleteFileIfExists = (filepath) => {
  if (fs.existsSync(filepath)) {
    fs.unlinkSync(filepath);
  }
};

// add product function
exports.AddProduct = async (req, res) => {
      const { title, shorttitle, description, price, discount, status } = req.body
  try {

    // all field are required
    if (!title || !shorttitle || !description || !price || !discount || !status) {
      return res.status(400).json({ error: 'All fields are required.' });
    }
    
    
    // no file upload
    console.log(req.file)
    const productImg = req.file.filename;
    if (!req.file) {
      if (productImg) deleteFileIfExists(`upload/${profilePic}`)
      return res.status(400).json({ error: 'No file uploaded' });
    }

    

    // show image path
    const filePath = `${process.env.IMAGE_STATICPATH}${req.file.filename}`;

    // add product function
    const newProduct = new ProductSchema({
      productName: title,
      productSortTitle: shorttitle,
      productDesc: description,
      productPrice: price,
      discount: discount,
      productStatus: status,
      productCoverImg: productImg
    });

    const productRes = await newProduct.save();

    if (productRes) {
      return res.status(200).json({ status: true, msg: 'Product Add successfully.' })
    } else {
      await deleteFileIfExists(`upload/${productImg}`);
      return res.status(500).json({ status: false, msg: 'Product save failed unexpectedly.' });
    }
  } catch (error) {
    if (req.file?.filename) {
      await deleteFileIfExists(`upload/${req.file.filename}`);
    }
    console.error('Error in AddProduct:', error);
    return res.status(500).json({ status: false, msg: 'Internal server error.', error: error.message });
  }
}


// product list
exports.ProductList=async(req,res)=>{
  try{
    const productlist=await product_schema.find();    
    if (!productlist || productlist.length === 0) {
      return res.status(404).json({ status: false, msg: 'No products found.' });
    }
    return res.status(200).json({ status: true, data: productlist, staticPath:'https://back-end-civil.onrender.com/upload/' });
  }catch(error){
    return res.status(500).json({ status: false, msg: 'Internal server error.', error: error.message });
  }
}

// get product by id
exports.GetProductById=async(req,res)=>{
  const productId = req.params.id;
   try {
    // Validate ID format (optional, but recommended)
    if (!productId.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({ status: false, msg: 'Invalid product ID' });
    }
    const product = await product_schema.findById(productId);
    if (!product) {
      return res.status(404).json({ status: false, msg: 'Product not found' });
    }
    return res.status(200).json({ status: true, data: product });

  } catch (error) {
    console.error('Error fetching product:', error.message);
    return res.status(500).json({ status: false, msg: 'Internal server error', error: error.message });
  }
}

// update product
exports.UpdateProduct = async (req, res) => {
  const productId = req.params.id;
  try {    
    const {title,shorttitle,description,price,discount,status} = req.body;   
    // Get existing product
    const existingProduct = await product_schema.findById(productId);
    if (!existingProduct) {
      return res.status(404).json({ status: false, msg: 'Product not found' });
    }
    let updatedData = {title,shorttitle,description,price,discount,status};
    // If new image uploaded
    if (req.file) {
      // Delete old image from disk
      const oldImagePath = `upload/${existingProduct.productCoverImg}`;
      deleteFileIfExists(oldImagePath);
  // Set new image name in update data
      updatedData.productCoverImg = req.file ? req.file.filename : req.body.existingImage || null;
    }
    // Update the product
    const updatedProduct = await product_schema.findByIdAndUpdate(productId, updatedData, { new: true });
    return res.status(200).json({ status: true, msg: 'Product updated successfully', data: updatedProduct });
    // return res.status(200).json({ status: true, msg: 'Product updated successfully'})
  } catch (error) {
    console.error('Update error:', error.message);
    return res.status(500).json({ status: false, msg: 'Internal server error', error: error.message });
  }
};



// paymentgetway intigration for payout
exports.Paynow = async (req, res) => {
  const instance = new Razorpay({
    key_id: 'rzp_test_HC49LHGAmCT33i',
    key_secret: 'jQzDCID9DJ4gmn29hHFgHCad'
  })
  var options = {
    amount: 50000,  // Amount is in currency subunits. Default currency is INR. Hence, 50000 refers to 50000 paise
    currency: "INR",
    receipt: "order_rcptid_11"
  };
  instance.orders.create(options, function (err, order) {
    if (err) {
      console.error("Error creating order:", err);
    } else {
      console.log(order);
      return res.status(200).json({ status: true, order })
    }
  })

}