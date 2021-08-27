const mongoose = require('mongoose')
function Dbconnect(){

const DB_URL = "mongodb+srv://chiragjain:Chirag123@profileform.7i853.mongodb.net/ProfileForm?retryWrites=true&w=majority"
    
mongoose.connect(DB_URL,
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useFindAndModify: false,
      useCreateIndex: true,
    },
    () => {
      console.log("database started");
    }
)

}

module.exports = Dbconnect