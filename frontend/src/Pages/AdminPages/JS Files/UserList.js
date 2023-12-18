import { Button, Modal, Space, Table, message } from "antd";
import Search from "antd/es/input/Search";
import React, { useEffect, useState } from "react";
import "../Css Files/UserList.css";
import { useNavigate } from "react-router-dom";

const UserList = () => {
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [recordToDelete, setRecordToDelete] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const columns = [
    {
      title: "First Name",
      dataIndex: "firstName",
      key: "firstName",
    },
    {
      title: "Last Name",
      dataIndex: "lastName",
      key: "lastName",
    },
    {
      title: "E-mail",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Mobile",
      dataIndex: "mobile",
      key: "mobile",
    },
    {
      title:"State",
      dataIndex:"state",
      key:"state"
    },
    {
      title:"Country",
      dataIndex:"country",
      key:"country"
    },
    {
      title: "Address",
      dataIndex: "address",
      key: "address",
    },
    {
      title: "Pincode",
      dataIndex: "pincode",
      key: "pincode",
    },
    {
      title: "Edit / Delete",
      dataIndex: "Edit / Delete",
      key: "Edit / Delete",
      render: (_, record) => (
        <Space>
         
          <Button type="primary" onClick={() => handleEdit(record)}>
            Edit
          </Button>
          <Button type="primary" onClick={() => handleDelete(record)}>
            Delete
          </Button>
        </Space>
      ),
    },
  ];
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch(
          "http://localhost:4444/api/power/user/get/users"
        );
        const jsonData = await response.json();
        setData(jsonData.users);
        setFilteredData(jsonData.users);
      } catch (err) {
        console.log(err);
      }
    };
    fetchUsers();
  }, []);
  const handleView = (record) => {
    navigate(`/view/${record._id}`);
  };
  const handleDelete = (record) => {
    setRecordToDelete(record);
    setIsModalVisible(true);
  };
  const confirmDelete = async () => {
    if (recordToDelete) {
      try {
        console.log(recordToDelete._id);
        const response = await fetch(
          `http://localhost:4444/api/power/user/delete/${recordToDelete._id}`,
          {
            method: "DELETE",
          }
        );
        if (response.ok) {
          const updatedData = data.filter(
            (item) => item._id !== recordToDelete._id
          );
          setData(updatedData);
          setFilteredData(updatedData);
          message.success("Account successfully deleted");
          setTimeout(() => {
            window.location.reload();
          }, 2000);
        } else {
          console.log("Failed to fetch");
          message.error("Failed to delete the account");
        }
      } catch (err) {
        console.error(err);
      }
    }
    setRecordToDelete(null);
    setIsModalVisible(false);
  };
  const resetRecordToDelete = () => {
    setRecordToDelete(null);
    setIsModalVisible(false);
  };
  const handleEdit = (record) => {
    navigate(`/edituser/${record._id}`);
  };
  const handleSearch = (value) => {
    const filtered = data.filter((user) =>
      user.firstName.toLowerCase().includes(value.toLowerCase())
    );
    setFilteredData(filtered);
  };
  const paginationConfig = {
    pageSize: 10,
  };

  return (
    <div className="UserList">
      <Search
        placeHolder="Search user"
        onSearch={handleSearch}
        style={{ marginBottom: 16 }}
      />
      <Table
        columns={columns}
        dataSource={filteredData}
        pagination={paginationConfig}
      />
      <Modal
        title="Confirm Delete"
        visible={isModalVisible}
        onOk={confirmDelete}
        onCancel={resetRecordToDelete}
        okText="Delete"
        cancelText="Cancel"
      >
        {recordToDelete &&
          `Are you sure you want to delete ${recordToDelete.firstName} ?`}{" "}
      </Modal>
    </div>
  );
};
export default UserList;
