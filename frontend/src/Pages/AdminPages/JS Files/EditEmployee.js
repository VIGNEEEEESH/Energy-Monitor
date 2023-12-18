import React, { useContext, useEffect, useState } from "react";
import { Button, Input, Form, message } from "antd";
import "../Css Files/EditEmployee.css";
import { useForm } from "../../../Shared/Hooks/form-hook";
import { AuthContext } from "../../../Shared/Context/Auth-context";
import { useNavigate, useParams } from "react-router-dom";
const { TextArea } = Input;

const EditEmployee = () => {
  const navigate = useNavigate();
  const auth = useContext(AuthContext);
  const [image, setImage] = useState(null);
  const [employee, setEmployee] = useState(null);
  const { id } = useParams();
  const [formState, inputHandler, setFormState] = useForm(
    {
      employeeId: {
        value: "",
        isValid: false,
      },
      name: {
        value: "",
        isValid: false,
      },

      password: {
        value: "",
        isValid: false,
      },
      image: {
        value: null,
        isValid: false,
      },
    },
    false
  );

  useEffect(() => {
    const fetchdata = async () => {
      try {
        const response = await fetch(
          `http://localhost:4444/api/power/admin/getadminbyid/${id}`
        );
        const jsonData = await response.json();
        setEmployee(jsonData.employee);

        // Update the form fields with the fetched data
        setFormState({
          employeeId: {
            value: jsonData.employee.employeeId,
            isValid: true,
          },
          name: {
            value: jsonData.employee.name,
            isValid: true,
          },

          password: {
            value: jsonData.employee.password,
            isValid: true,
          },
        });
      } catch (err) {
        console.log(err);
      }
    };
    fetchdata();
  }, [id, setFormState]);

  const submitHandler = async () => {
    try {
      const formData = new FormData();
      formData.append("employeeId", formState.inputs.employeeId.value);
      formData.append("name", formState.inputs.name.value);
      formData.append("password", formState.inputs.password.value);
      formData.append("image", image);

      const response = await fetch(
        `http://localhost:4444/api/power/admin/updateAdmin/${id}`,
        {
          method: "PATCH",
          body: formData,
          headers: {
            Authorization: "Bearer " + auth.token,
          },
        }
      );

      const responseData = await response.json();

      if (!response.ok) {
        if (responseData && responseData.error) {
          // Display the error message to the user
          message.error(responseData.error);
        } else {
          // Handle other types of errors
          console.log("An error occurred:", responseData);
        }
      }
      message.success("Account successfully updated");
      setTimeout(() => {
        navigate("/");
      }, 2000);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="EditEmployee">
      {employee && (
        <Form id="msform" onFinish={submitHandler}>
          <fieldset>
            <h2 className="fs-title">Update Account</h2>
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
              value="Update"
            />
            <br />
          </fieldset>
        </Form>
      )}
    </div>
  );
};

export default EditEmployee;
