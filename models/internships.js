const mongoose = require("mongoose");

const internshipSchema = new mongoose.Schema(
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
const internship = mongoose.model("Internship", internshipSchema);

module.exports = internship;