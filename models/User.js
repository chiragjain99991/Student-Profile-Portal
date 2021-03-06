const mongoose = require('mongoose');
const bcrypt = require("bcrypt");

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
          isAdmin:{
            type:Boolean,
            default: false
          },
          isSuperAdmin:{
            type:Boolean,
            default: false
          },
          isUpdated:{
            type:Boolean,
            default: false
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
          otp: {
            type: String,
            default: "",
          },
          otpTimeLimit: {
            type: Date,
            default: Date.now,
          },
          contact_no: {
            type: String,
            default: "",
          },
          linkedin: {
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
          },
          courseraArray:{
            type:Array,
            default:[]
          },
          projectArray:{
            type:Array,
            default:[]
          },
          achievementsArray:{
            type:Array,
            default:[]
          },
          publicationArray:{
            type:Array,
            default:[]
          },
          further_contributions:{
            type:String,
            default:""
          },
          gre:{
            type:String,
            default:""
          },
          tofel:{
            type:String,
            default:""
          },
          ielts:{
            type:String,
            default:""
          },
          gate:{
            type:String,
            default:""
          },
          cat:{
            type:String,
            default:""
          },
          gmat:{
            type:String,
            default:""
          },
          resume:{
            type:String,
            default:""
          }
          

    },
    { timestamps: true }
)

// userSchema.pre("save", async function (next) {
   
//   const salt = await bcrypt.genSalt();
//   this.password = await bcrypt.hash(this.password, salt);
//   next();

// })

userSchema.statics.login = async function (sap_Id, password) {
  const user = await this.findOne({ sap_Id });
  // console.log(user)
  if (user) {

      const validPassword = await bcrypt.compare(password, user.password);
      if (validPassword) {
        return user;
      } else {
        throw new Error("Invalid user Credentials");
      }

  } else {
    throw new Error("User not found");
  }
};



const user = mongoose.model('User',userSchema);

module.exports = user;
