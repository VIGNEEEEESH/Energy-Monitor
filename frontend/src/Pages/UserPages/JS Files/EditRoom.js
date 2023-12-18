import React, { useContext, useEffect, useState } from "react";
import { Button, Input, Form, message } from "antd";
import "../Css Files/EditRoom.css";
import { useForm } from "../../../Shared/Hooks/form-hook";
import { AuthContext } from "../../../Shared/Context/Auth-context";
import { useNavigate, useParams } from "react-router-dom";
const { TextArea } = Input;

const EditRoom = () => {
  const navigate = useNavigate();
  const auth = useContext(AuthContext);

  const [room, setRoom] = useState(null);
  const { id } = useParams();
  const [formState, inputHandler, setFormState] = useForm(
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

  useEffect(() => {
    const fetchdata = async () => {
      try {
        const response = await fetch(
          `http://localhost:4444/api/power/room/get/room/byid/${id}`
        );
        const jsonData = await response.json();
        setRoom(jsonData.room);

        setFormState({
          room: {
            value: jsonData.room.room,
            isValid: true,
          },
          target: {
            value: jsonData.room.target,
            isValid: true,
          },

          sensor: {
            value: jsonData.room.sensor,
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
      const response = await fetch(
        `http://localhost:4444/api/power/room/update/${id}`,
        {
          method: "PATCH",
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
        if (responseData && responseData.error) {
          // Display the error message to the user
          message.error(responseData.error);
        } else {
          // Handle other types of errors
          console.log("An error occurred:", responseData);
        }
      }
      message.success("Room successfully updated");
      setTimeout(() => {
        navigate("/");
      }, 2000);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="EditRoom">
      {room && (
        <Form id="msform" onFinish={submitHandler}>
          <fieldset>
            <h2 className="fs-title">Update Room</h2>
            <h3 className="fs-subtitle">
              Watt's the key to a better world? Saving Energy!
            </h3>

            <Input
              type="text"
              name="room"
              placeholder="Room Name"
              onChange={(e) => inputHandler("room", e.target.value)}
              value={formState.inputs.room.value}
            />
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
              value="Update"
            />
            <br />
          </fieldset>
        </Form>
      )}
    </div>
  );
};

export default EditRoom;
