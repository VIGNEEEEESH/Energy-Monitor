import React, { useContext, useEffect, useState } from "react";
import { Button, Image, Input, TextArea, Upload, message } from "antd";
import "./SignUp.css";
import { PlusOutlined } from "@ant-design/icons";
import { useForm } from "../Shared/Hooks/form-hook";
import { AuthContext } from "../Shared/Context/Auth-context";

const SignUp = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const auth = useContext(AuthContext);
  const [image, setImage] = useState(null);

  const [formState, inputHandler] = useForm(
    {
      firstName: {
        value: "",
        isValid: false,
      },
      lastName: {
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
      mobile: {
        value: "",
        isValid: false,
      },
      address: {
        value: "",
        isValid: false,
      },
      landmark: {
        value: "",
        isValid: false,
      },
      pincode: {
        value: "",
        isValid: false,
      },
      state: {
        value: "",
        isValid: false,
      },
      country: {
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

  const saveCurrentStep = (step) => {
    // Save the current step to localStorage
    localStorage.setItem("currentStep", step.toString());
  };

  const handleNext = () => {
    setCurrentStep((prevStep) => {
      const nextStep = prevStep + 1;
      saveCurrentStep(nextStep);
      return nextStep;
    });
  };

  const handlePrevious = () => {
    setCurrentStep((prevStep) => {
      const previousStep = prevStep - 1;
      saveCurrentStep(previousStep);
      return previousStep;
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const formData = new FormData();
      formData.append("firstName", formState.inputs.firstName.value);
      formData.append("lastName", formState.inputs.lastName.value);
      formData.append("email", formState.inputs.email.value);
      formData.append("password", formState.inputs.password.value);
      formData.append("mobile", formState.inputs.mobile.value);
      formData.append("address", formState.inputs.address.value);
      formData.append("landmark", formState.inputs.landmark.value);
      formData.append("pincode", formState.inputs.pincode.value);
      formData.append("state", formState.inputs.state.value);
      formData.append("country", formState.inputs.country.value);
      formData.append("image", image);

      const response = await fetch(
        "http://localhost:4444/api/power/user/createuser",
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
        throw new Error(response.message);
      }
      message.success("Account successfully created");
      setTimeout(() => {
        window.location.reload();
      }, 2000);
    } catch (err) {
      console.log(err);
    }
  };

  const steps = [
    {
      title: "Create your account",
      subtitle: "Hit the savings highway, create your account now!",
      fields: [
        { name: "firstName", placeholder: "First Name" },
        { name: "lastName", placeholder: "Last Name" },
        { name: "email", placeholder: "Email" },
        { name: "password", placeholder: "Password" },
      ],
    },
    {
      title: "Address",
      subtitle: "Create your medium to spark some savings!",
      fields: [
        { name: "address", placeholder: "Address (Area or Street)" },
        { name: "landmark", placeholder: "Landmark" },
        { name: "pincode", placeholder: "Pincode" },
        { name: "state", placeholder: "State" },
        { name: "country", placeholder: "Country" },
      ],
    },
    {
      title: "Personal Information",
      subtitle: "We will never sell it",
      fields: [{ name: "mobile", placeholder: "Mobile" }],
    },
  ];

  return (
    <div className="Signup">
      <form id="msform">
        <ul id="progressbar">
          {steps.map((step, index) => (
            <li key={index} className={currentStep === index ? "active" : ""}>
              {step.title}
            </li>
          ))}
        </ul>
        <fieldset>
          <h2 className="fs-title">{steps[currentStep].title}</h2>
          <h3 className="fs-subtitle">{steps[currentStep].subtitle}</h3>
          {steps[currentStep].fields.map((field, index) => (
            <Input
              key={index}
              type={field.type || "text"}
              name={field.name}
              placeholder={field.placeholder}
              onChange={(e) =>
                inputHandler(
                  field.name,
                  e.target.value /* Add your validation logic here */
                )
              }
              value={formState.inputs[field.name].value}
            />
          ))}

          {currentStep === 2 && (
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
          )}

          {currentStep > 0 && (
            <Input
              type="button"
              name="previous"
              className="previous action-button"
              value="Previous"
              onClick={handlePrevious}
            />
          )}
          {currentStep < steps.length - 1 ? (
            <Input
              type="button"
              name="next"
              className="next action-button"
              value="Next"
              onClick={handleNext}
            />
          ) : (
            <a
              href="https://twitter.com/GoktepeAtakan"
              className="submit action-button"
              target="_top"
              onClick={handleSubmit}
              disabled={!formState.isValid}
            >
              Create Account
            </a>
          )}
        </fieldset>
      </form>
    </div>
  );
};

export default SignUp;
