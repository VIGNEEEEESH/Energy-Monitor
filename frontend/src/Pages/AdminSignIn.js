import React, { useContext } from "react";
import { Button, Checkbox, Form, Input, Upload } from "antd";
import "./AdminSignIn.css";
import { PlusOutlined } from "@ant-design/icons";
import { AuthContext } from "../Shared/Context/Auth-context";
import { useForm } from "../Shared/Hooks/form-hook";
import { useNavigate } from "react-router-dom";
const { TextArea } = Input;

const AdminSignIn = () => {
  const navigate = useNavigate();
  const auth = useContext(AuthContext);
  const [formState, inputHandler, setFormData] = useForm(
    {
      email: {
        value: "",
        isValid: false,
      },
      password: {
        value: "",
        isValid: false,
      },
    },
    false
  );
  const submitHandler = async (event) => {
    
    try {
      const response = await fetch(
        "http://localhost:4444/api/power/admin/login",
        {
          method: "POST",
          body: JSON.stringify({
            email: formState.inputs.email.value,
            password: formState.inputs.password.value,
          }),
          headers: { "Content-Type": "application/json" },
        }
      );
      const responseData = await response.json();
      if (!response.ok) {
        throw new Error(response.message);
      }
      auth.login(responseData.userId, responseData.token,responseData.userRole);
      navigate("/admin");
      console.log(responseData);
    } catch (err) {
      console.log(err);
    }
  };
  return (
    <div className="AdminSignIn">
      <Form id="msform" onFinish={submitHandler}>
        <fieldset>
          <h2 className="fs-title">Admin Sign-In</h2>
          <h3 className="fs-subtitle">
            Watt's the key to a better world? Saving Energy!
          </h3>

          <Input
            type="text"
            name="email"
            placeholder="E-Mail"
            onChange={(e) => inputHandler("email", e.target.value)}
            value={formState.inputs.email.value}
          />
          <Input
            type="password"
            name="password"
            placeholder="Password"
            onChange={(e) => inputHandler("password", e.target.value)}
            value={formState.inputs.password.value}
          />
          <Input
            type="submit"
            name="submit"
            className="next action-button"
            value="Sign-In"
          /><br/>
          <Input 
          type="button"
          className="next action-button"
          value="User-Login"
          style={{width:"max-content"}}
          onClick={()=>navigate("/signin")}
          />
        </fieldset>
      </Form>
    </div>
  );
};

export default AdminSignIn;
