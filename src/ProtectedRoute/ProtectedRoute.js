import { Outlet, Navigate } from "react-router-dom";
import Navbar from "../Components/Navbar/Navbar";
import Sidebar from "../Components/Navbar/Sidebar";
import keycloakConfig from "../Components/Login/keycloak/keycloak";


const ProtectedRoute = () => {
  const token = localStorage.getItem("token");
 
  return keycloakConfig.token ? (
    <>
      <Sidebar/>
      <div className="w-full">
      <Navbar/>
      <Outlet />
      </div>
    </>
  ) :(
    
  <div className="w-full h-full flex items-center justify-center">Redirecting to login...</div>)
};

export default ProtectedRoute;
 