const mongoose = require("mongoose");

const Groupadmin=mongoose.Schema({
    admin_name:{
        type:String,
        required:true
    },
    admin_mobileno:{
     type:Number,
        required:true
    },
    group_name:{
        type:String,
        required:true
    },
    select_date:{
            type:String,
        required:true
    },
    select_time:{
            type:String,
        required:true
    },
    joincode:{
        type:String,
        required:true,
        unique:true
    },
    cafes:{
        type:[String],
        required:true
    },
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
    },
    selectedCafes: [
  {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Cafe",
    default: [],
  },
],

},{ timestamps: true })

module.exports = mongoose.model("GroupAdmin", Groupadmin);