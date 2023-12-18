import React, { useContext, useState } from "react";
import { Button, Checkbox, Form, Input, Upload, message } from "antd";
import "./AdminSignUp.css";
import { PlusOutlined } from "@ant-design/icons";
import { AuthContext } from "../Shared/Context/Auth-context";
import { useForm } from "../Shared/Hooks/form-hook";
import { useNavigate } from "react-router-dom";
const { TextArea } = Input;

const AdminSignUp = () => {
  const navigate = useNavigate();
  const auth = useContext(AuthContext);
  const [image, setImage] = useState(null);
  const [formState, inputHandler, setFormData] = useForm(
    {
      employeeId: {
        value: "",
        isValid: false,
      },
      name: {
        value: "",
        isValid: false,
      },
      email: {
        value: "",
        isValid: false,
      },
      password: {
        value: "",
        isValid: false,
      },
      image: {
        value: "",
        isValid: null,
      },
    },
    false
  );
  const submitHandler = async () => {
    try {
      const formData = new FormData();
      formData.append("employeeId", formState.inputs.employeeId.value);
      formData.append("name", formState.inputs.name.value);
      formData.append("email", formState.inputs.email.value);
      formData.append("password", formState.inputs.password.value);
      formData.append("image", image);

      const response = await fetch(
        "http://localhost:4444/api/power/admin/createAdmin",
        {
          method: "POST",
          body: formData,
          headers: {
            Authorization: "Bearer " + auth.token,
          },
        }
      );

      const responseData = await response.json();
      auth.login(
        responseData.userId,
        responseData.token,
        responseData.userRole
      );
      if (!response.ok) {
        if (responseData && responseData.error) {
          // Display the error message to the user
          message.error(responseData.error);
        } else {
          // Handle other types of errors
          console.log("An error occurred:", responseData);
        }
      }
      message.success("Account successfully created");
      setTimeout(() => {
        window.location.reload();
      }, 2000);
    } catch (err) {
      console.log(err);
    }
  };
  return (
    <div className="AdminSignUp">
      <Form id="msform" onFinish={submitHandler}>
        <fieldset>
          <h2 className="fs-title">Admin Sign-Up</h2>
          <h3 className="fs-subtitle">
            Watt's the key to a better world? Saving Energy!
          </h3>

          <Input
            type="text"
            name="employeeId"
            placeholder="Employee Id"
            onChange={(e) => inputHandler("employeeId", e.target.value)}
            value={formState.inputs.employeeId.value}
          />
          <Input
            type="text"
            name="name"
            placeholder="Name"
            onChange={(e) => inputHandler("name", e.target.value)}
            value={formState.inputs.name.value}
          />
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
          <div>
            <h3>Upload your image</h3>

            <label htmlFor="imageUpload" className="custom-file-upload">
              <Input
                type="file"
                id="imageUpload"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files[0];
                  if (file) {
                    setImage(file);
                  }
                }}
              />
            </label>
          </div>
          <Input
            type="submit"
            name="submit"
            className="next action-button"
            value="Sign-Up"
          />
          <br />
          <Input
            type="button"
            className="next action-button"
            value="Admin-Login"
            style={{ width: "max-content" }}
            onClick={() => navigate("/adminlogin")}
          />
        </fieldset>
      </Form>
    </div>
  );
};

export default AdminSignUp;
