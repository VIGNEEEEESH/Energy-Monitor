import React from "react";
import "./Welcome.css";
import HomeAnimation from "../Components/HomeAnimation";
import { Button } from "antd";
import { useNavigate } from "react-router-dom";

const Welcome = () => {
  const navigate=useNavigate()

  return (
    <div className="Welcome">
      <div className="row">
      <div className="animation">
        <HomeAnimation />
        
      </div>
      <Button className="signin" onClick={()=>navigate("/signin")}>Sign-In</Button>
      <Button className="signup" onClick={()=>navigate("/signup")}>Sign-Up</Button>
      </div></div>
  );
};
export default Welcome;
