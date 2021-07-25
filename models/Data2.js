const mongoose = require("mongoose");

const data2Schema = new mongoose.Schema(
  {
    name: {
      type: String,
      default: "",
    },
    role:{
      type: String,
      default: "",
    },
    description: {
      type: String,
      default: "",
    },
    proof_link: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);
const Data2 = mongoose.model("Data2", data2Schema);

module.exports = Data2;