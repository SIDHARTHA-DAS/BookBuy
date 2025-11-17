const router = require("express").Router();
const {authenticateToken} = require("./userAuth")
const Book = require("../model/book")
const Order = require("../model/order")
const User = require("../model/user")


// place order
router.post("/place-order",authenticateToken, async(req, res)=>{
  try {
    const {id} = req.headers;
    const {order} = req.body;
    for(const orderData of order) {
      const newOrder = new Order({user:id, book: orderData._id})
      const orderDataFromDb = await newOrder.save()
      // saeing order in user model
      await User.findByIdAndUpdate(id,{
        $push:{orders: orderDataFromDb._id},
      })
      // clearing cart

      await User.findByIdAndUpdate(id,{
        $pull:{cart:orderData._id}
      })
    }
    return res.json({
      status:"Success",
      message:"Order placed Successfully"
    })
  } catch (error) {
    res.status(500).json({message:"internal server error"});
  }
})


// get order history of particular user
router.get("/get-order-history", authenticateToken, async(req, res)=>{
  try {
    const {id} = req.headers;
    const userData = await User.findById(id).populate({
      path:"orders",
      populate:{path:"book"}
    })

    const orderData = userData.orders.reverse();
    return res.json({
      status:"Success",
      data:orderData,
    })
  } catch (error) {
    res.status(500).json({message:" error"});
    
  }
})

// get all order --admin
router.get("/get-all-orders", authenticateToken, async(req, res)=>{
  try {
    const userData = await Order.find().populate({
      path:"book",
    }).populate({
      path:"user"
    }).sort({createdAt: -1});
    return res.json({
      status:"Success",
      data:userData,
    })
  } catch (error) {
    res.status(500).json({message:" error"});
  }
})

// upadte order --admin
router.put("/update-status/:id", authenticateToken ,async(req, res)=>{
  try {
    const {id} = req.params;
    await Order.findByIdAndUpdate(id, {status: req.body.status})
    return res.json({
      status:"Success",
      message:"Status Updated SuccessFully"
    })
  } catch (error) {
    
    return res.status(500).json({message:" error"});
  }
})

module.exports = router