import React, { useContext, useEffect, useState } from "react";
import "../Css Files/Room.css";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Legend,
  Tooltip,
} from "chart.js";
import {
  Button,
  Card,
  Col,
  Modal,
  Progress,
  Row,
  Statistic,
  message,
  notification,
} from "antd";
import Meta from "antd/es/card/Meta";
import { useNavigate, useParams } from "react-router-dom";
import CountUp from "react-countup";
import { AuthContext } from "../../../Shared/Context/Auth-context";

ChartJS.register(
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Legend,
  Tooltip
);

const Room = () => {
  const id = useParams();
  const navigate = useNavigate();
  const formatter = (value) => <CountUp end={value} separator="," />;
  const formatterr = (value) => <CountUp end={value} separator="" />;
  const [roomdata, setRoomdata] = useState("");
  const [switchdata, setSwitchData] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const auth = useContext(AuthContext);
  const [switchboardData, setSwitchboardData] = useState({
    location: "", // Add the default location
    switches: [], // Add the default switches array
  });
  const [totalEnergyConsumption, setTotalEnergyConsumption] = useState(0);
  const [chartData, setChartData] = useState({
    labels: [],
    datasets: [
      {
        label: "Energy consumption of the Hour",
        data: [],
        backgroundColor: "aqua",
        borderColor: "black",
        pointBorderColor: "aqua",
        fill: true,
        tension: 0.4,
      },
    ],
  });

  useEffect(() => {
    document.body.classList.add("radial");
  }, []);

  const handleSwitchClick = async (relayIndex, switchIndex) => {
    try {
      // Ensure the index is within the bounds of switchdata
      if (relayIndex < switchdata.length) {
        const relay = switchdata[relayIndex];
        console.log(relay);
        if (relay) {
          const switchKey = `in${switchIndex + 1}`;
          const switchStatus = relay[switchKey];

          // Toggle the switch status
          relay[switchKey] = switchStatus === "HIGH" ? "LOW" : "HIGH";

          // Log the updated status
          console.log(
            `Switch ${switchIndex + 1} in Relay ${relayIndex + 1} is ${
              relay[switchKey]
            }`
          );

          // Update the state to trigger a re-render
          setSwitchData([...switchdata]);

          // Prepare the switch state data for the backend
          const switchStateData = {
            // You might need to adjust this based on your data structure
            in1: relay.in1,
            in2: relay.in2,
            in3: relay.in3,
            in4: relay.in4,
          };

          // Make a PUT request to update the switch status on the backend
          await fetch(
            `http://localhost:4444/api/power/relay/update/switches/${relay.sensorId}`,
            {
              method: "PUT",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify(switchStateData),
            }
          );

          console.log("Switch state updated on the backend");
        }
      }
    } catch (err) {
      console.error("Failed to update switch state on the backend", err);
    }
  };
  useEffect(() => {
    const fetchSwitchboardData = async () => {
      try {
        const response = await fetch(
          `http://localhost:4444/api/power/relay/get/switchboard/${roomdata.sensor}`
        );
        const jsonData = await response.json();
        setSwitchboardData(jsonData); // Assuming the API response contains location and switches
      } catch (err) {
        console.log(err);
      }
    };

    // Fetch switchboard data when roomdata is available
    if (roomdata) {
      fetchSwitchboardData();
    }
  }, [roomdata]);

  const fetchDataForPresentHour = async () => {
    try {
      const response = await fetch(
        `http://localhost:4444/api/power/current/get/datainminutes/${roomdata.sensor}`
      );
      console.log(roomdata.sensor);
      const jsonData = await response.json();
      console.log(jsonData);

      // Assuming the API response has a "records" property
      const records = jsonData.records || [];

      // Get the start time of the current hour
      const now = new Date();
      const startOfHour = new Date(
        now.getFullYear(),
        now.getMonth(),
        now.getDate(),
        now.getHours(),
        0,
        0,
        0
      );

      // Filter records that are within the current hour
      const recordsInCurrentHour = records.filter((data) => {
        const recordTime = new Date(data.dateandtime);
        return recordTime >= startOfHour;
      });

      const labels = recordsInCurrentHour.map((data) => data.dateandtime); // Replace with the actual dateandtime property
      const energyData = recordsInCurrentHour.map((data) =>
        parseFloat(data.energy)
      ); // Replace with the actual energy property

      // Calculate total energy consumption
      const totalEnergyConsumption = energyData.reduce(
        (acc, currentValue) => acc + currentValue,
        0
      );

      setChartData({
        labels,
        datasets: [
          {
            ...chartData.datasets[0], // Keep existing dataset properties
            data: energyData,
          },
        ],
      });

      // Set the total energy consumption
      setTotalEnergyConsumption(totalEnergyConsumption);
      console.log(totalEnergyConsumption);
    } catch (err) {
      console.log(err);
    }
  };
  useEffect(() => {
    // Fetch data initially when roomdata is available
    if (roomdata) {
      fetchDataForPresentHour();
      if(roomdata.target>totalEnergyConsumption){
        notification.warning("You have used maximum data")
      }
      // Set up an interval to fetch data every one minute (60000 milliseconds)
      const intervalId = setInterval(() => {
        fetchDataForPresentHour();
      }, 30000);

      // Clear the interval when the component is unmounted
      return () => clearInterval(intervalId);
      
    }
  }, [roomdata]);
  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const response = await fetch(
          `http://localhost:4444/api/power/room/get/room/byid/${id.id}`
        );
        const jsonData = await response.json();
        setRoomdata(jsonData.room);
        console.log(jsonData.room);
      } catch (err) {
        console.log(err);
      }
    };
    fetchRooms();
    const fetchSwitchBoards = async () => {
      try {
        const response = await fetch(
          `http://localhost:4444/api/power/relay/get/switchdata/byroom/${id.id}`
        );
        const jsonData = await response.json();
        setSwitchData(jsonData.relays);
        console.log(jsonData.relays);
      } catch (err) {
        console.log(err);
      }
    };
    fetchSwitchBoards();
  }, []);

  const options = {
    plugins: {
      legends: true,
    },
    scales: {
      y: {
        // min:0,
        // max:20
      },
    },
  };
  const handleDelete = (record) => {
    setIsModalVisible(true);
  };
  const handleAddSwitchBoard = (record) => {
    navigate(`/addswitchboard/${id.id}`);
  };
  const confirmDelete = async () => {
    if (roomdata) {
      try {
        const response = await fetch(
          `http://localhost:4444/api/power/room/delete/${id.id}`,
          {
            method: "DELETE",
          }
        );

        message.success("Account successfully deleted");
        setTimeout(() => {
          navigate("/");
        }, 2000);
      } catch (err) {
        console.error(err);
      }
    }

    setIsModalVisible(false);
  };
  const resetRecordToDelete = () => {
    setIsModalVisible(false);
  };
  const percentage = (target, consumption) => {
    if (target > 0) {
      const percent = (consumption / target) * 100;
      return percent.toFixed(2);
    } else {
      return 0;
    }
  };
  return (
    <div className="Room">
      <Button
        type="primary"
        style={{
          position: "absolute",
          right: "345px",
          backgroundColor: "black",
        }}
        onClick={() => navigate(`/editroom/${id.id}`)}
      >
        Edit Room
      </Button>
      <Button
        type="primary"
        style={{
          position: "absolute",
          right: "50px",
          backgroundColor: "black",
        }}
        onClick={handleDelete}
      >
        Delete Room
      </Button>
      <Button
        type="primary"
        style={{
          position: "absolute",
          right: "180px",
          backgroundColor: "black",
        }}
        onClick={handleAddSwitchBoard}
      >
        Add Switch Board
      </Button>

      <h1>Energy Consumption in {roomdata.room}</h1>
      <div className="statistics-row">
        <div className="linechart">
          <Line data={chartData} options={options}></Line>
        </div>
        <div>
          <Card
            style={{
              position: "absolute",
              top: "52.5%",
            }}
          >
            <Statistic
              title="Total energy consumption"
              value={totalEnergyConsumption}
              precision={5 + "kWh"}
            />
            <Statistic
              title="Target"
              value={roomdata.target}
              precision={3}
              formatter={formatter}
            />
            <Statistic
              title="Sensor Id"
              value={roomdata.sensor}
              precision={2}
              formatter={formatterr}
            />
          </Card>
        </div>
      </div>

      <div
        style={{
          width: "100%",
          backgroundColor: "rgb(51,51,51)",
          height: "300px",
          paddingTop: "10px",
          color: "white",
        }}
      >
        {switchdata.map((relay, relayIndex) => (
          <div key={relay._id} className="switchboard">
            {Object.entries(relay)
              .filter(
                ([key, value]) =>
                  key.startsWith("In") && key.endsWith("Name") && value !== null
              )
              .map(([key, value], switchIndex) => {
                // Extract the switch number from the key
                const switchNumber = key.match(/\d+/)[0];

                return (
                  <div
                    key={`${relayIndex}-${switchIndex}`} // Unique key for each switch
                    className={`switch ${
                      relay[`in${switchNumber}`] === "HIGH" ? "on" : ""
                    }`}
                    onClick={() =>
                      handleSwitchClick(relayIndex, switchNumber - 1)
                    } // Adjust switchIndex
                  >
                    {/* Display switch name */}
                    <center>
                      <h5>{`   ${value}`}</h5>
                    </center>
                  </div>
                );
              })}
          </div>
        ))}
      </div>

      <Modal
        title="Confirm Delete"
        visible={isModalVisible}
        onOk={confirmDelete}
        onCancel={resetRecordToDelete}
        okText="Delete"
        cancelText="Cancel"
      >
        {roomdata && `Are you sure you want to delete ${roomdata.room} ?`}{" "}
      </Modal>
      <center>
        <h1>The percentage of energy consumed</h1>
        <Progress
          width={300}
          strokeWidth={10}
          type="circle"
          percent={percentage(roomdata.target, totalEnergyConsumption)}
        />
      </center>
    </div>
  );
};
export default Room;
