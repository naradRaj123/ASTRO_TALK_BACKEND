require('dotenv').config();
const fs = require('fs')

// razorpay payment
const Razorpay = require('razorpay')

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

exports.AddProduct = async (req, res) => {

  if (!req.file) return res.status(400).json({ error: 'No file uploaded' });

  const productImg = req.file.filename;
  console.log(`upload/${productImg}`)
  // if (productImg) deleteFileIfExists(`upload/${profilePic}`);
  // console.log(deleteFileIfExists(`upload/${productImg}`))
  const filePath = `${process.env.IMAGE_STATICPATH}${req.file.filename}`;
  res.json({ message: 'Image uploaded successfully', imageUrl: filePath });
}

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
    console.log( order);
    return res.status(200).json({status:true,order})
  }
})

}