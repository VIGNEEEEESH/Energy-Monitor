import React, { useContext } from "react";
import {
  Button,
  Checkbox,
  Dropdown,
  Form,
  Input,
  Select,
  Space,
  Upload,
  message,
} from "antd";
import "../Css Files/AddSwitchBoard.css";

import { DownOutlined, UserOutlined } from "@ant-design/icons";
import { AuthContext } from "../../../Shared/Context/Auth-context";
import { useForm } from "../../../Shared/Hooks/form-hook";
import { useNavigate, useParams } from "react-router-dom";

const AddSwitchBoard = () => {
  const navigate = useNavigate();
  const auth = useContext(AuthContext);
  let id = useParams();
  

  const [formState, inputHandler, setFormData] = useForm(
    {
      userId: {
        value: "",
        isValid: false,
      },
      sensorId: {
        value: "",
        isValid: false,
      },
      description: {
        value: "",
        isValid: false,
      },
      location: {
        value: "",
        isValid: false,
      },
      In1Name: {
        value: "",
        isValid: true,
      },
      In2Name: {
        value: "",
        isValid: true,
      },
      In3Name: {
        value: "",
        isValid: true,
      },
      In4Name: {
        value: "",
        isValid: true,
      },
    
    },
    false
  );
  const submitHandler = async (event) => {
    try {
      const response = await fetch(
        "http://localhost:4444/api/power/relay/createrelay",
        {
          method: "POST",
          body: JSON.stringify({
            userId: auth.userId,
            roomId: id.id,
            sensorId: formState.inputs.sensorId.value,
            description: formState.inputs.description.value,
            location: formState.inputs.location.value,
            In1Name: formState.inputs.In1Name.value,
            In2Name: formState.inputs.In2Name.value,
            In3Name: formState.inputs.In3Name.value,
            In4Name: formState.inputs.In4Name.value,
          
          }),
          headers: { "Content-Type": "application/json" },
        }
      );
      const responseData = await response.json();
      if (!response.ok) {
        throw new Error(response.message);
      }
      message.success("Switch Board created successfully")
      navigate("/");
      console.log(responseData);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="AddSwitchBoard">
      <Form id="msform" onFinish={submitHandler}>
        <fieldset>
          <h2 className="fs-title">Add Switch Board</h2>
          <h3 className="fs-subtitle">
            Watt's the key to a better world? Saving Energy!
          </h3>

          <Input
            type="text"
            name="sensorId"
            placeholder="Sensor Id"
            onChange={(e) => inputHandler("sensorId", e.target.value)}
            value={formState.inputs.sensorId.value}
          />
          <Input
            type="text"
            name="description"
            placeholder="Description"
            onChange={(e) => inputHandler("description", e.target.value)}
            value={formState.inputs.description.value}
          />
          <Input
            type="text"
            name="location"
            placeholder="Location"
            onChange={(e) => inputHandler("location", e.target.value)}
            value={formState.inputs.location.value}
          />

          <Input
            type="text"
            name="In1Name"
            placeholder="Switch 1 Name"
            onChange={(e) => inputHandler("In1Name", e.target.value)}
            value={formState.inputs.In1Name.value}
          />
          <Input
            type="text"
            name="In2Name"
            placeholder="Switch 2 Name"
            onChange={(e) => inputHandler("In2Name", e.target.value)}
            value={formState.inputs.In2Name.value}
          />
          <Input
            type="text"
            name="In3Name"
            placeholder="Switch 3 Name"
            onChange={(e) => inputHandler("In3Name", e.target.value)}
            value={formState.inputs.In3Name.value}
          />
          <Input
            type="text"
            name="In4Name"
            placeholder="Switch 4 Name"
            onChange={(e) => inputHandler("In4Name", e.target.value)}
            value={formState.inputs.In4Name.value}
          />
      
          <Input
          style={{width:"auto"}}
            type="submit"
            name="submit"
            className="next action-button"
            value="Add Switch Board"
          />
          <br />
        </fieldset>
      </Form>
    </div>
  );
};

export default AddSwitchBoard;
