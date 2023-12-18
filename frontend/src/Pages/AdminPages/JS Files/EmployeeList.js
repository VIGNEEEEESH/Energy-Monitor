import { Button, Modal, Space, Table, message } from "antd";
import Search from "antd/es/input/Search";
import React, { useEffect, useState } from "react";
import "../Css Files/EmployeeList.css"
import { useNavigate } from "react-router-dom";

const EmployeeList = () => {
  const navigate=useNavigate()
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [recordToDelete,setRecordToDelete]=useState(null)
  const [isModalVisible,setIsModalVisible]=useState(false)
  const columns = [
    {
      title: "Employee Id",
      dataIndex: "employeeId",
      key: "employeeId",
    },
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "E-mail",
      dataIndex: "email",
      key: "email",
    },
    {
      title:"Edit / Delete",
      dataIndex:"Edit / Delete",
      key:"Edit / Delete",
      render:(_,record)=>(
        <Space>
          
          <Button type="primary" onClick={()=>handleEdit(record)}>
            Edit
          </Button>
          <Button type="primary" onClick={()=>handleDelete(record)}>
            Delete
          </Button>
        </Space>
      )
    }
   
  ];
  useEffect(() => {
    const fetchAdmins = async () => {
      try {
        const response = await fetch(
          "http://localhost:4444/api/power/admin/get/admins"
        );
        const jsonData = await response.json();
        
        setData(jsonData.admins);
        setFilteredData(jsonData.admins);
      } catch (err) {
        console.log(err);
      }
    };

    fetchAdmins();
  }, []);
 
  const handleDelete = (record) => {
    setRecordToDelete(record);
    setIsModalVisible(true);
  };
  const confirmDelete = async () => {
    if (recordToDelete) {
      try {
        console.log(recordToDelete._id);
        const response = await fetch(
          `http://localhost:4444/api/power/admin/delete/${recordToDelete._id}`,
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
  const handleEdit=(record)=>{
    navigate(`/editemployee/${record._id}`)
  }
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
    <div className="EmployeeList">
      <Search
        placeholder="Search user"
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
          `Are you sure you want to delete ${recordToDelete.name} ?`}{" "}
      </Modal>
    </div>
  );
};
export default EmployeeList