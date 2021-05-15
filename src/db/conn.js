const mongoose = require('mongoose');

mongoose.connect("mongodb://localhost:27017/mernRegistration",{
    useCreateIndex:true,useUnifiedTopology:true,useNewUrlParser:true
}).then(()=>{
    console.log("DB is connected successfully");
}).catch((e)=>{
    console.log(e);
})
