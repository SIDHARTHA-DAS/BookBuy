const router = require("express").Router();
const User = require("../model/user")
const jwt = require("jsonwebtoken")
const Book = require("../model/book")
const {authenticateToken} = require("./userAuth")


// add book --admin
router.post("/add-book", authenticateToken, async(req,res)=>{
  try {
    const {id} = req.headers;
    const user = await User.findById(id)
    if(user.role !== "admin"){
      return res.status(400).json({message: "you are not having axxes to perform admin work"})
    }
    const book = new Book({
      url:req.body.url,
      title:req.body.title,
      author:req.body.author,
      price:req.body.price,
      desc:req.body.desc,
      language:req.body.language,
    })
    await book.save();
    res.status(200).json({message:"Book add successfully"})
  } catch (error) {
     res.status(500).json({message:"internal server error"});
  }
})

// update-book -admin
router.put("/update-book", authenticateToken, async(req,res)=>{
  try {
    const {bookid} = req.headers;
    await Book.findByIdAndUpdate(bookid,{
      url:req.body.url,
      title:req.body.title,
      author:req.body.author,
      price:req.body.price,
      desc:req.body.desc,
      language:req.body.language,
    })
    return res.status(200).json({message:"Book upated successfully"})
  } catch (error) {
    console.log(error)
     res.status(500).json({message:" server error"});
  }
})

// delete book -admin
router.delete("/delete-book", authenticateToken, async(req, res)=>{
  try {
    const {bookid} = req.headers;
    await Book.findByIdAndDelete(bookid)
    return res.status(200).json({message:"Book delete successfully"})
  } catch (error) {
    console.log(error)
    res.status(500).json({message:" server error"});
  }
})

// get all book
router.get("/get-all-books",async(req,res)=>{
  try {
    const books = await Book.find().sort({createAt: -1})
    return res.json({
      status:"Success",
      data: books,
    })
  } catch (error) {
     console.log(error)
    res.status(500).json({message:" server error"});
  }
})

// get recent added book limit 4
router.get("/get-recent-books", async (req, res) => {
  try {
    const books = await Book.find().sort({ createdAt: -1 }).limit(5);

    return res.status(200).json({
      status: "success",
      data: books,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error" });
  }
});


// get book by id
router.get("/get-book-by-id/:id", async(req, res)=>{
  try {
    const {id} = req.params;
    const book = await Book.findById(id);
    return res.json({
      status:"Success",
      data:book,
    })
  } catch (error) {
    console.log(error)
    res.status(500).json({message:" server error"});
  }
})


module.exports = router;