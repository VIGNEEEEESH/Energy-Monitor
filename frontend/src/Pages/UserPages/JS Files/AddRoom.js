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
import "../Css Files/AddRoom.css";

import { DownOutlined, UserOutlined } from "@ant-design/icons";
import { AuthContext } from "../../../Shared/Context/Auth-context";
import { useForm } from "../../../Shared/Hooks/form-hook";
import { useNavigate, useParams } from "react-router-dom";

const AddRoom = () => {
  const navigate = useNavigate();
  const auth = useContext(AuthContext);
  let id = useParams();
  id=id.id
  
  const [formState, inputHandler, setFormData] = useForm(
    {
      room: {
        value: "",
        isValid: false,
      },
      target: {
        value: "",
        isValid: false,
      },
      sensor: {
        value: "",
        isValid: false,
      },
    },
    false
  );
  const submitHandler = async (event) => {
    try {
      const response = await fetch(
        `http://localhost:4444/api/power/room/createroom/${id}`,
        {
          method: "POST",
          body: JSON.stringify({
            room: formState.inputs.room.value,
            target: formState.inputs.target.value,
            sensor: formState.inputs.sensor.value,
          }),
          headers: { "Content-Type": "application/json" },
        }
      );
      const responseData = await response.json();
      if (!response.ok) {
        throw new Error(response.message);
      }
      message.success("Room created successfully")
      navigate("/");
      console.log(responseData);
    } catch (err) {
      console.log(err);
    }
  };
  const items = [
    {
      label: "Hall No.1",
      key: "1",
      icon: <UserOutlined />,
    },
    {
      label: "Hall No.2",
      key: "2",
      icon: <UserOutlined />,
    },
    {
      label: "Hall No.3",
      key: "3",
      icon: <UserOutlined />,
      danger: true,
    },
    {
      label: "Kitchen No.1",
      key: "4",
      icon: <UserOutlined />,
      danger: true,
      disabled: true,
    },
    {
      label: "Kitchen No.2",
      key: "5",
      icon: <UserOutlined />,
      danger: true,
      disabled: true,
    },
    {
      label: "Kitchen No.3",
      key: "6",
      icon: <UserOutlined />,
      danger: true,
      disabled: true,
    },
    {
      label: "Bedroom No.1",
      key: "7",
      icon: <UserOutlined />,
      danger: true,
      disabled: true,
    },
    {
      label: "Bedroom No.2",
      key: "8",
      icon: <UserOutlined />,
      danger: true,
      disabled: true,
    },
    {
      label: "Bedroom No.3",
      key: "9",
      icon: <UserOutlined />,
      danger: true,
      disabled: true,
    },
    {
      label: "Bedroom No.4",
      key: "10",
      icon: <UserOutlined />,
      danger: true,
      disabled: true,
    },
    {
      label: "Bedroom No.5",
      key: "11",
      icon: <UserOutlined />,
      danger: true,
      disabled: true,
    },
  ];

  return (
    <div className="AddRoom">
      <Form id="msform" onFinish={submitHandler}>
        <fieldset>
          <h2 className="fs-title">Add Room</h2>
          <h3 className="fs-subtitle">
            Watt's the key to a better world? Saving Energy!
          </h3>
          <Select
            placeholder="Room Name"
            onChange={(value) => inputHandler("room", value)}
            value={formState.inputs.room.value}
            style={{ width: "250px" }}
          >
            <Select.Option value="" disabled>
              Select a room
            </Select.Option>
            {items.map((item) => (
              <Select.Option key={item.key} value={item.label}>
                {item.label}
              </Select.Option>
            ))}
          </Select>
          <br />
          <br />
          <Input
            type="text"
            name="target"
            placeholder="Target"
            onChange={(e) => inputHandler("target", e.target.value)}
            value={formState.inputs.target.value}
          />
          <Input
            type="text"
            name="sensor"
            placeholder="Sensor Id"
            onChange={(e) => inputHandler("sensor", e.target.value)}
            value={formState.inputs.sensor.value}
          />
          <Input
            type="submit"
            name="submit"
            className="next action-button"
            value="Add Room"
          />
          <br />
        </fieldset>
      </Form>
    </div>
  );
};

export default AddRoom;
