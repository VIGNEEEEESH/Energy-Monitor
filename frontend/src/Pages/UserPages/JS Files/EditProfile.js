import React, { useContext, useEffect, useState } from "react";
import { Input, message } from "antd";
import "../Css Files/EditProfile.css";
import { useForm } from "../../../Shared/Hooks/form-hook";
import { AuthContext } from "../../../Shared/Context/Auth-context";
import { useNavigate, useParams } from "react-router-dom";

const EditProfile = () => {
    const navigate=useNavigate()
  const [user, setUser] = useState(null);
  const [currentStep, setCurrentStep] = useState(0);
  const auth = useContext(AuthContext);
  const id=auth.userId
  const [image, setImage] = useState(null);

  const [formState, inputHandler, setFormState] = useForm(
    {
      firstName: {
        value: "",
        isValid: false,
      },
      lastName: {
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

  useEffect(() => {
    const fetchdata = async () => {
      try {
        const response = await fetch(
          `http://localhost:4444/api/power/user/get/user/byid/${id}`
        );
        const jsonData = await response.json();
        setUser(jsonData.user);

        // Update the form fields with the fetched data
        setFormState({
          firstName: {
            value: jsonData.user.firstName,
            isValid: true,
          },
          lastName: {
            value: jsonData.user.lastName,
            isValid: true,
          },
          password: {
            value: null,
            isValid: true,
          },
          mobile: {
            value: jsonData.user.mobile,
            isValid: true,
          },
          address: {
            value: jsonData.user.address,
            isValid: true,
          },
          landmark: {
            value: jsonData.user.landmark,
            isValid: true,
          },
          pincode: {
            value: jsonData.user.pincode,
            isValid: true,
          },
          state: {
            value: jsonData.user.state,
            isValid: true,
          },
          country: {
            value: jsonData.user.country,
            isValid: true,
          },
        });
      } catch (err) {
        console.log(err);
      }
    };
    fetchdata();
  }, [id]);

  const saveCurrentStep = (step) => {
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
      formData.append("password", formState.inputs.password.value);
      formData.append("mobile", formState.inputs.mobile.value);
      formData.append("address", formState.inputs.address.value);
      formData.append("landmark", formState.inputs.landmark.value);
      formData.append("pincode", formState.inputs.pincode.value);
      formData.append("state", formState.inputs.state.value);
      formData.append("country", formState.inputs.country.value);
      formData.append("image", image);

      const response = await fetch(
        `http://localhost:4444/api/power/user/update/${id}`,
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
        throw new Error(response.message);
      }
      message.success("Account successfully updated");
      setTimeout(() => {
        navigate("/")
      }, 2000);
    } catch (err) {
      console.log(err);
    }
  };

  const steps = [
    {
      title: "Update account",
      subtitle: "Hit the savings highway, create your account now!",
      fields: [
        { name: "firstName", placeholder: "First Name" },
        { name: "lastName", placeholder: "Last Name" },

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
    <div className="EditProfile">
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
              value={
                formState.inputs &&
                formState.inputs[field.name] &&
                formState.inputs[field.name].value
              }
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
            >
              Update Account
            </a>
          )}
        </fieldset>
      </form>
    </div>
  );
};

export default EditProfile;
