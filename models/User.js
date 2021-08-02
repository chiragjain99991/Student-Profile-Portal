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
          email: {
            type: String,
            default: "",
          },
          uniqueString:{
            type: String,
            default: "",
          },
          isValid:{
            type: Boolean,
            default: false,
          },
          password: {
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
          },
          contribution:{
            type: String,
            default: "",
          },
          academic_cgpa:{
            type:Array,
            default:[]
          },
          cultural_activities:{
            type:String,
            default:""
          },
          sports_activities:{
            type:String,
            default:""
          },
          NSS_activities:{
            type:String,
            default:""
          },
          internshipsArray:{
            type:Array,
            default:[]
          }

    },
    { timestamps: true }
)

const user = mongoose.model('User',userSchema);

module.exports = user;
