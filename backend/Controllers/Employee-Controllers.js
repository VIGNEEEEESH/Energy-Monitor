const { validationResult } = require("express-validator")
const Employee=require("../Models/Employee")
const HttpError = require("../Middleware/http-error")
const createEmployee=async(req,res,next)=>{
    const errors=validationResult(req)
    if(!errors.isEmpty()){
        return res.status(422).json({
            message:"Invalid inputs passed, please try again",
            errors:errors.array(),
        })
    }
    const {employeeId}=req.body
    let existingEmployee
    try{
        existingEmployee=await Employee.findOne({employeeId:employeeId})
    }catch(err){
        const error=new HttpError("Something went wrong, please try again",500)
        return next(error)
    }
    if(existingEmployee){
        const error=new HttpError("The employee already exists, please try again with a new employee id",500)
        return next(error)
    }
    const createdEmployee=new Employee({
        employeeId,
    })
    try{
        await createdEmployee.save()
    }catch(err){
        const error=new HttpError("Could not create the employee, please try again",500)
        return next(error)
    }
    res.status(201).json({employee:createdEmployee})
}
const getEmployees=async(req,res,next)=>{
    let employees
    try{
        employees=await Employee.find({})
    }catch(err){
        const error=new HttpError("Something went wrong please try again",500)
        return next(error)
    }
    res.json({employees:employees})
}
const getEmployeeById=async(req,res,next)=>{
    const admin=req.params.employeeId
    
    let employee
    try{
        employee=await Employee.findOne({employeeId:employeeId})
        
    }catch(err){
        const error=new HttpError("Something went wrong please try again",500)
        return next(error)
    }
    res.json({employee:employee})
}
const deleteEmployeeById=async(req,res,next)=>{
    const employeeId=req.params.employeeId
    let employee
    try{
        employee=await Employee.findOne({employeeId:employeeId})
        if(!employee){
            const error=new HttpError("Could not find the employee, please try again",500)
            return next(error)
        }
        await employee.deleteOne()
    }catch(err){
        const error=new HttpError("Something went wrong could not delete the employee, please try again",500)
        return next(error)
    }
    res.status(200).json({message:"Employee deleted successfully"})
}
exports.createEmployee=createEmployee
exports.getEmployees=getEmployees
exports.getEmployeeById=getEmployeeById
exports.deleteEmployeeById=deleteEmployeeById