const mongoose=require("mongoose")
const Schema=mongoose.Schema
const uniqueValidator=require("mongoose-unique-validator")

const employeeSchema=new Schema({
    employeeId:{type:String,required:true},
    
})
employeeSchema.plugin(uniqueValidator)
module.exports=mongoose.model("Employee",employeeSchema)