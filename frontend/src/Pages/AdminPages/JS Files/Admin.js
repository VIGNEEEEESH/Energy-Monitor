import { Card, Col, Row } from "antd";
import React from "react";
import "../Css Files/Admin.css"
import { useNavigate } from "react-router-dom";
const Admin = () => {
    const navigate=useNavigate()
  return (
    <div className="admin" style={{color:"#f4cd30",backgroundColor:"#000000"}}>
      <Row gutter={16}>
        <Col span={8}>
          <Card  title="Employee" bordered={false} onClick={()=>navigate("/employeelist")}>
            Employee details
          </Card>
        </Col>
        <Col span={8}>
          <Card title="User" bordered={false} onClick={()=>navigate("/userlist")}>
            User details
          </Card>
        </Col>
        
      </Row>
    </div>
  );
};
export default Admin;
