const express=require("express")
const {check}=require("express-validator")
const router=express.Router()
const employeeControllers=require("../Controllers/Employee-Controllers")

router.post("/createemployee",[check("employeeId").notEmpty()],employeeControllers.createEmployee)
router.get("/getemployees",employeeControllers.getEmployees)
router.get("/get/employeebyid/:employeeId",employeeControllers.getEmployeeById)
router.delete("/delete/:employeeid",employeeControllers.deleteEmployeeById)
module.exports=router