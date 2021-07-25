const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
    {
          sap_Id: {
            type: String,
            required: true,
          },
          name: {
            type: String,
            default: "",
          },
          contact_no: {
            type: String,
            default: "",
          },
          year_join:{
            type: String,
            default: "",
          },
          year_passed:{
            type: String,
            default: "",
          },
          profile_pic:{
            type: String,
            default: "",
          }

    },
    { timestamps: true }
)

const user = mongoose.model('User',userSchema);

module.exports = user;
