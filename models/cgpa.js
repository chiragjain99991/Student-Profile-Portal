const mongoose = require("mongoose");

const CGPACOUNT = [3,4,5,6,7,8]

const cgpaSchema = new mongoose.Schema(
  {
    year: {
      type: String,
      required: true,
      unique:true
    },
    cgpacount: {
        type: Number, 
        required: true,
        enum: CGPACOUNT
    }
  },
  { timestamps: true }
);
const cgpa = mongoose.model("Cgpa", cgpaSchema);

module.exports = cgpa;