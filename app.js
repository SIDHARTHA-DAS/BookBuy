const { config } = require("dotenv")
const express = require("express")
const app = express()
require("dotenv").config()
require("./conn/connection")
const cors = require("cors")
const User = require("./routes/user")
const Books = require("./routes/book")
const Faourite = require("./routes/favourite")
const Cart = require("./routes/cart")
const Order = require("./routes/order")

app.use(cors({
  origin: ["http://localhost:5174", "http://localhost:5173", "https://book-buy.vercel.app"],
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true
}))
app.use(express.json())

// routes

app.use("/api/v1",User)
app.use("/api/v1",Books)
app.use("/api/v1",Faourite)
app.use("/api/v1",Cart)
app.use("/api/v1",Order)


// createing port
app.listen(process.env.PORT || 5000 ,()=>{
  console.log("server start")
})