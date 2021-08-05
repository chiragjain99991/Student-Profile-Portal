const mongoose = require("mongoose");

const achievementSchema = new mongoose.Schema(
  {
    description: {
      type: String,
      default: "",
    },
    proof_link: {
      type: String,
      default: "",
    }
  },
  { timestamps: true }
);
const achievement = mongoose.model("Achievement", achievementSchema);

module.exports = achievement;