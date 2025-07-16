require('dotenv').config;

const paymentSchema=require('../../modal/paymentRequest/index');
const Razorpay=require('razorpay')

const razorpay = new Razorpay({
  key_id: 'rzp_test_6m5EFshHcmM2o1',
  key_secret: 'HxglzG5XHEPtZOP6e9eulqQv',
});


exports.paymentRequestList=async (req,res)=>{
    try {
    const payments = await paymentSchema.find().sort({ createdAt: -1 }); // latest first
    // console.log(payments)
    return res.status(200).json({
      status: true,
      message: 'Payment request list fetched successfully.',
      data:payments
    });
  } catch (error) {
    console.error('Error fetching payment requests:', error);
    return res.status(500).json({
      status: false,
      message: 'Something went wrong while fetching payment requests.',
    });
  }
}


// create payment order
exports.createOrder= async (req,res)=>{
    const { amount, astrologerId } = req.body;

   try {
    // 1. Fetch astrologer from DB
    const astrologer = await Astrologer.findById(astrologerId);

    if (!astrologer) {
      return res.status(404).json({ success: false, message: 'Astrologer not found' });
    }

    // 2. Check if wallet has enough balance
    if (astrologer.wallet < amount) {
      return res.status(400).json({ success: false, message: 'Insufficient balance' });
    }

    // 3. Create Razorpay order
    const options = {
      amount: amount * 100, // convert to paise
      currency: 'INR',
      receipt: `receipt_${Date.now()}`,
    };

    const order = await razorpay.orders.create(options);
    console.log("order info",order)
    res.status(200).json({ success: true, order });

  } catch (err) {
    console.error('Order Creation Error:', err.message);
    res.status(500).json({ success: false, error: 'Server error' });
  }

}

// verify amount
