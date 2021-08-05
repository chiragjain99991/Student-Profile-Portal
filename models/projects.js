const mongoose = require("mongoose");

const projectSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      default: "",
    },
    description: {
      type: String,
      default: "",
    },
    project_link: {
      type: String,
      default: "",
    }
  },
  { timestamps: true }
);
const project = mongoose.model("Project", projectSchema);

module.exports = project;