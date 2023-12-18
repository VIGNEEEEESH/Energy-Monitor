import React, { useContext, useEffect, useState } from "react";
import "../Css Files/Home.css";
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
import { Button, Card, Col, Row, Select, Statistic } from "antd";

import CountUp from "react-countup";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../../Shared/Context/Auth-context";
ChartJS.register(
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Legend,
  Tooltip
);
const { Option } = Select;

const Home = () => {
  const navigate = useNavigate();
  const auth = useContext(AuthContext);
  const [roomdata, setRoomdata] = useState([]);
  const [switchboardStatus, setSwitchboardStatus] = useState(false);
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

  const handleToggleSwitchboard = async (sensorId) => {
    try {
      const response = await fetch(
        `http://localhost:4444/api/power/relay/update/switchboard/${sensorId}`,
        {
          method: "PUT", // Adjust the method as per your API requirements
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            enabled: !switchboardStatus,
          }),
        }
      );
      const jsonData = await response.json();
      

      // Assuming the API response contains the updated switchboard status
      const updatedSwitchboardStatus = jsonData.relay.enabled;

      // Update the local state to reflect the current switchboard status
      setSwitchboardStatus(updatedSwitchboardStatus);
    } catch (err) {
      console.log(err);
      // Handle error
    }
  };
  const fetchDataForPresentHour = async () => {
    try {
      const response = await fetch(
        `http://localhost:4444/api/power/current/get/datainminutesall/allsensors`
      );
      const jsonData = await response.json();
      console.log(jsonData);

      // Assuming the API response has a "records" property
      const records = jsonData.records || [];

      // Group records by date and time
      const groupedRecords = groupBy(records, "dateandtime");

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
      const recordsInCurrentHour = Object.values(groupedRecords).reduce(
        (acc, group) => {
          const recordTime = new Date(group[0].dateandtime);
          if (recordTime >= startOfHour) {
            // Sum up energy for the same minute from different sensors
            const totalEnergyForMinute = group.reduce(
              (sum, data) => sum + parseFloat(data.energy),
              0
            );
            acc.push({
              dateandtime: group[0].dateandtime,
              energy: totalEnergyForMinute.toFixed(6), // Adjust the precision as needed
            });
          }
          return acc;
        },
        []
      );

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

  // Function to group an array of objects by a specified key
  function groupBy(array, key) {
    return array.reduce((acc, obj) => {
      const groupKey = obj[key];
      acc[groupKey] = acc[groupKey] || [];
      acc[groupKey].push(obj);
      return acc;
    }, {});
  }

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const response = await fetch(
          `http://localhost:4444/api/power/room/get/rooms/byuserid/${auth.userId}`
        );
        const jsonData = await response.json();
        setRoomdata(jsonData.rooms);
      } catch (err) {
        console.log(err);
      }
    };
    fetchRooms();
  }, [auth.userId]);

  const countRooms = (rooms) => {
    return rooms.length;
  };

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

  useEffect(() => {
    // Fetch data initially
    fetchDataForPresentHour();

    // Set up an interval to fetch data every one minute (60000 milliseconds)
    const intervalId = setInterval(() => {
      fetchDataForPresentHour();
    }, 60000);

    // Clear the interval when the component is unmounted
    return () => clearInterval(intervalId);
  }, []); // Fetch data on component mount

  return (
    <div className="Home">
      <h1>Energy Consumption</h1>
      <div className="linechart">
        <Line data={chartData} options={options}></Line>
      </div>
      <div
        style={{
          position: "absolute",
          left: "1100px",
          top: "300px",
          width: "max",
        }}
      >
        <Card
          style={{
            position: "absolute",
            top: "52.5%",
          }}
        >
          <Statistic
            title="Total energy consumption"
            value={totalEnergyConsumption + " kWh"}
            precision={5}
          />
          <Statistic
            title="Total number of rooms"
            value={countRooms(roomdata)}
            precision={2}
            formatter={(value) => <CountUp end={value} separator="," />}
          />
        </Card>
      </div>

      <div className="rooms-row">
        <Button onClick={() => navigate(`/addroom/${auth.userId}`)}>
          Add Room
        </Button>
        <Row gutter={16}>
          {roomdata.map((room) => (
            <Col span={8} key={room._id}>
              <Card
                title={
                  <>
                    {room.room}&nbsp;&nbsp;
                    <Button
                      onClick={() => handleToggleSwitchboard("sensor4444")}
                    >
                      Power
                    </Button>
                  </>
                }
                bordered={false}
                className="card"
               
              >
                Target: {room.target} <Button  onClick={() => navigate(`/room/${room._id}`)}>Open</Button>
              </Card>
            </Col>
          ))}
        </Row>
      </div>
    </div>
  );
};

export default Home;
