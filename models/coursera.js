const mongoose = require("mongoose");

const courseraSchema = new mongoose.Schema(
  {
    course_name: {
      type: String,
      default: "",
    },
    university: {
      type: String,
      default: "",
    },
    duration: {
        type: String,
        default: "",
      },
    sem: {
        type: String,
        default: "",
    },
    cert_link: {
        type: String,
        default: "",
      },
    level: {
        type: String,
        default: "",
    }
  },
  { timestamps: true }
);
const coursera = mongoose.model("Coursera", courseraSchema);

module.exports = coursera;