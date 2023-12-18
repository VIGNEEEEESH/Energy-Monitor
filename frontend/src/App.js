import logo from "./logo.svg";
import React from "react";
import "./App.css";
import Navbar from "./Components/Navbar";
import {
  Routes,
  Route,
  BrowserRouter as Router,
  Navigate,
} from "react-router-dom";
import Welcome from "./Pages/Welcome";
import Footer from "./Components/Footer";
import SignUp from "./Pages/SignUp";
import SignIn from "./Pages/SignIn";
import { useAuth } from "./Shared/Hooks/auth-hook";
import { AuthContext } from "./Shared/Context/Auth-context";
import { FloatButton } from "antd";

import AdminSignUp from "./Pages/AdminSignUp";
import AdminSignIn from "./Pages/AdminSignIn";
import Admin from "./Pages/AdminPages/JS Files/Admin";
import EmployeeList from "./Pages/AdminPages/JS Files/EmployeeList";
import UserList from "./Pages/AdminPages/JS Files/UserList";
import EditUser from "./Pages/AdminPages/JS Files/EditUser";
import EditEmployee from "./Pages/AdminPages/JS Files/EditEmployee";
import Home from "./Pages/UserPages/JS Files/Home";
import AddRoom from "./Pages/UserPages/JS Files/AddRoom";
import Room from "./Pages/UserPages/JS Files/Room";
import EditRoom from "./Pages/UserPages/JS Files/EditRoom";
import EditProfile from "./Pages/UserPages/JS Files/EditProfile";
import AboutUs from "./Pages/AboutUs";
import Help from "./Pages/Help";

import AddSwitchBoard from "./Pages/UserPages/JS Files/AddSwitchBoard";

function App() {
  const { token, login, logout, userId, userRole } = useAuth();
  let routes;
  
  if (userRole === "user") {
    routes = (
      <React.Fragment>
        <Navbar />
        <Routes>
          <Route path="/welcome" element={<Welcome />} exact />
          <Route path="/addroom/:id" element={<AddRoom />} exact />
          <Route path="/addswitchboard/:id" element={<AddSwitchBoard />} exact />
          <Route path="/room/:id" element={<Room />} exact />
          <Route path="/editroom/:id" element={<EditRoom />} exact />
          <Route path="/editprofile" element={<EditProfile />} exact />
          <Route path="/aboutus" element={<AboutUs />} exact />
          <Route path="/help" element={<Help />} exact />
          <Route path="/" element={<Home />} exact />
          <Route path="*" element={<Navigate to="/welcome" />} />
        </Routes>
        <Footer />
      </React.Fragment>
    );
  } else if (userRole === "admin") {
    routes = (
      <React.Fragment>
        <Navbar />
        <Routes>
          <Route path="/admin" element={<Admin />} exact />
          <Route path="/userlist" element={<UserList />} exact />
          <Route path="/employeelist" element={<EmployeeList />} exact />
          <Route path="/edituser/:id" element={<EditUser />} exact />
          <Route path="/editemployee/:id" element={<EditEmployee />} exact />
          <Route path="/aboutus" element={<AboutUs />} exact />
          <Route path="/help" element={<Help />} exact />
          <Route path="/" element={<Home />} exact />
        </Routes>
        <Footer />
      </React.Fragment>
    );
  } else {
    routes = (
      <React.Fragment>
        <Navbar />
        <Routes>
          <Route path="/welcome" element={<Welcome />} exact />
          <Route path="/signup" element={<SignUp />} exact />
          <Route path="/signin" element={<SignIn />} exact />
          <Route path="/adminsignup" element={<AdminSignUp />} exact />
          <Route path="/adminsignin" element={<AdminSignIn />} exact />
          <Route path="/aboutus" element={<AboutUs />} exact />
          <Route path="/help" element={<Help />} exact />
          
          <Route path="/" element={<Home />} exact />
        </Routes>
        <Footer />
      </React.Fragment>
    );
  }
  return (
    <AuthContext.Provider
      value={{
        isLoggedIn: !!token,
        userId: userId,
        token: token,
        login: login,
        logout: logout,
      }}
    >
      <Router>{routes}</Router>
      <FloatButton.BackTop />
    </AuthContext.Provider>
  );
}

export default App;
