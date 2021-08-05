const mongoose = require("mongoose");

const publicationSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      default: "",
    },
    publication:{
      type: String,
      default: "",
    },
    author: {
      type: String,
      default: "",
    },
    conference: {
      type: String,
      default: "",
    },
    year: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);
const publication = mongoose.model("Publication", publicationSchema);

module.exports = publication;