import React, { useContext, useState } from "react";
import "./Navbar.css";
import LogoImage from "../images/Logo.png"; // Replace with the path to your logo image
import { AuthContext } from "../Shared/Context/Auth-context";
import { Dropdown, Menu, Modal } from "antd";
import { Link, useNavigate } from "react-router-dom";
import { UserOutlined } from "@ant-design/icons";

const Navbar = () => {
  const auth = useContext(AuthContext);

  const navigate = useNavigate();
  const [logoutModalVisible, setLogoutModalVisible] = useState(false);
  const handleLogout = (e) => {
    e.preventDefault();
    setLogoutModalVisible(true);
  };
  const handleLogoutConfirmed = () => {
    setLogoutModalVisible(false);
    auth.logout();
  };
  const handleLogoutCanceled = () => {
    setLogoutModalVisible(false);
  };
  const menu = (
    <Menu>
      <Menu.Item key="1">
        {auth.isLoggedIn ? (
          <a href="#" onClick={handleLogout}>
            Sign-Out
          </a>
        ) : (
          <Link to="/signin">Sign-In</Link>
        )}
      </Menu.Item>
      <Menu.Item key="2">
        <Link to="/profile">Profile</Link>
      </Menu.Item>
      <Menu.Item key="3">
        <Link to="/editprofile">Edit Profile</Link>
      </Menu.Item>
    </Menu>
  );

  return (
    <div className="navbar">
      <img src={LogoImage} alt="Logo" className="navbar-logo" height="80px" />
      <a className="nav-link nav-link-fade-up" href="/">
        Home
      </a>
      <a className="nav-link nav-link-fade-up" href="/aboutus">
        About
      </a>
      <a className="nav-link nav-link-fade-up" href="#">
        Help
      </a>
      {auth.userRole === "admin" && (
        <a
          className="nav-link nav-link-fade-up"
          href="#"
          onClick={() => navigate("/admin")}
        >
          Admin
        </a>
      )}
      <Dropdown
        overlay={menu}
        arrow={{ pointAtCenter: true }}
        placement="top"
      >
        <a className="nav-link nav-link-fade-up" href="/profile">
          <UserOutlined style={{ fontSize: "30px" }} />
        </a>
      </Dropdown>
      <Modal
        visible={logoutModalVisible}
        title="Confirmation"
        onCancel={handleLogoutCanceled}
        onOk={handleLogoutConfirmed}
        okText="Logout"
        cancelText="Cancel"
        className="logoutModal"
      >
        <p>Are you sure you want to logout</p>
      </Modal>
    </div>
  );
};

export default Navbar;
