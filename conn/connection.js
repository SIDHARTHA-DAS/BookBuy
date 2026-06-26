// const mongoose = require("mongoose")

// const connection = async () =>{
//   try {
//     await mongoose.connect(`${process.env.URI}`)
//     console.log("connected to database")
//   } catch (error) {
//     console.log(error)
//   }
// }
// connection()

const mongoose = require("mongoose");

let isConnected = false;

const connection = async () => {
  if (isConnected) return; // ✅ Already connected hai toh skip karo
  
  try {
    await mongoose.connect(process.env.URI);
    isConnected = true;
    console.log("connected to database");
  } catch (error) {
    console.log(error);
  }
};

module.exports = connection; // ✅ Export karo