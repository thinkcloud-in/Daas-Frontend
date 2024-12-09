import "./App.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute/ProtectedRoute";
import React, { Suspense, useState, useEffect } from "react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Loading from "./images/loading.png";
import GrafanaToolbarContextProvider from "./Context/GrafanaToolbarContext";
import PoolContextProvider from "./Context/PoolContext";
import Sidebar from "./Components/Navbar/Sidebar";
import Navbar from "./Components/Navbar/Navbar";
// import { ReactKeycloakProvider } from "@react-keycloak/web";
import keycloakConfig from "./Components/Login/keycloak/keycloak";
import Overview from "./Components/Dashboard/Overview";
import Hosts from "./Components/Dashboard/Hosts";
import DataStores from "./Components/Dashboard/DataStores";
import VMs from "./Components/Dashboard/VMs";
import VsphereMonitoring from "./Components/Vsphere monitoring/VsphereMonitoring";
import DomainCreationForm from "Components/Domain/DomainCreatingForm";
import EditDomain from "Components/Domain/EditDomain";
import Auto_Mail from "Components/Reports/Schedule";
import ReportPage from "Components/Reports/scheduleDetails";
import SMTP from "Components/Reports/SMTP";


//lazy imports
const Domain = React.lazy(()=> import ('./Components/Domain/Domain'))
const VCenter = React.lazy(() => import("./Components/VCenter/VCenter"));
const Login = React.lazy(() => import("./Components/Login/Login"));
const Reports = React.lazy(() => import("./Components/Reports/Reports"));
const Template = React.lazy(() => import("./Components/Template/Template"));
const Pools = React.lazy(() => import("./Components/PoolCreation/Pools"));
const ManagePool = React.lazy(() =>
  import("./Components/PoolCreation/ManagePool")
);
const Clusters = React.lazy(() => import("./Components/Clusters/Clusters"));
const ClusterCreationForm = React.lazy(() =>
  import("./Components/Clusters/ClusterCreationForm")
);
const ShowClusters = React.lazy(() =>
  import("./Components/Clusters/ShowClusters")
);
const EditCluster = React.lazy(() =>
  import("./Components/Clusters/EditCluster")
);
const EditPool = React.lazy(() => import("./Components/PoolCreation/EditPool"));
const LandingPage = React.lazy(() =>
  import("./Components/LandingPage/LandingPage")
);
const SSL = React.lazy(() => import("./Components/SSL/SSL"));
const TOTP = React.lazy(() => import("./Components/TOTP/TOTP"));
const ChangePassword = React.lazy(() =>
  import("./Components/Login/ChangePassword")
);
const Dashboard = React.lazy(() => import("./Components/Dashboard/Dashboard"));
const PoolCreationForm = React.lazy(() =>
  import("./Components/PoolCreation/PoolCreationForm")
);

function App() {
  const [token, setToken] = useState("");
  const[tokenParsed,setTokenParsed]=useState("") 

  const [loggedIn, setLoggedIn] = useState(false);
  const localStorageToken = JSON.parse(localStorage.getItem("token"));


  useEffect(() => {
    // console.log(keycloakConfig.token)
    keycloakConfig
      .init({ onLoad: "login-required" })
      .then((authenticated) => {
        
        setLoggedIn(authenticated);
        if (authenticated) {
          // console.log(keycloakConfig.token)
          setToken(keycloakConfig.token);
          setTokenParsed(keycloakConfig.tokenParsed)
          localStorage.setItem("token", JSON.stringify(keycloakConfig.token));
          
        }
      })
      .catch((error) =>
        console.error("Keycloak initialization failed:", error)
      );
  }, []);
  // Define the loading spinner function
  const LoadingSpinner = () => (
    <center>
      <img src={Loading} className="App-logo" alt="loading" />
    </center>
  );
// console.log(tokenParsed.preferred_username)
  return (
    <div className="App">
      
      {/* remove true and replace it with "token" and uncomment useEffect for keycloak initialization */}
      {token ? (
        <GrafanaToolbarContextProvider>
          <PoolContextProvider token={token}>
            <BrowserRouter>
              <ToastContainer/>
              <Sidebar />
              <Suspense fallback={LoadingSpinner()}>
                <div className="app1">
                  <Navbar  tokenParsed={tokenParsed}/>
                  <Routes>
                    {/* <Route element={<ProtectedRoute />}> */}
                    <Route path="/landingpage" element={<LandingPage />} />
                    <Route path="/" element={<Overview />} />
                    <Route path="/hosts" element={<Hosts />} />
                    <Route path="/data-stores" element={<DataStores />} />
                    <Route path="/vms" element={<VMs />} />
                    <Route path="/domain" element={<Domain/>} />
                    <Route path="/domain/domain-create-form" element={<DomainCreationForm/>}/>
                    <Route path="/domain/edit-domain/:id" element={<EditDomain/>}/>
                    <Route path="/vcenter" element={<VCenter />} />
                    <Route path="/reports" element={<Reports tokenParsed={tokenParsed}/>} />
                    <Route path="/template" element={<Template tokenParsed={tokenParsed}/>} />
                    <Route path="/pools" element={<Pools token={token} />}  />
                    <Route path="/clusters" element={<Clusters />} />
                    <Route path="/reportdetails" element={< ReportPage />} />
                    <Route path="/autoschedule" element={< Auto_Mail tokenParsed = {tokenParsed} />} />
                    <Route path="/smtp" element={<SMTP />} />
                    <Route
                      path="/pools/pool-creation-form"
                      element={<PoolCreationForm token={token} />}
                    />
                    {/* <Route
                      path="/pools/pool-creation-form"
                      element={<Dummy />}
                    /> */}
                    <Route
                      path="/cluster/cluster-create-form"
                      element={<ClusterCreationForm />}
                    />
                    <Route path="/pools/manage-pool/:id" element={<ManagePool token={token}/>} />
                    <Route
                      path="/cluster/show-clusters"
                      element={<ShowClusters />}
                    />
                    <Route
                      path="/cluster/edit-cluster/:id"
                      element={<EditCluster />}
                    />
                    <Route path="/pools/edit-pool/:id" element={<EditPool token={token} />} />
                    <Route
                      path="/changepassword"
                      element={<ChangePassword />}
                    />
                    <Route path="/ssl" element={<SSL />} />
                    <Route path="/totp" element={<TOTP />} />
                    <Route
                      path="/vsphere-monitoring"
                      element={<VsphereMonitoring />}
                    />
                    {/* </Route> */}
                    {/* <Route path="/login" element={<Login />} /> */}
                  </Routes>
                </div>
              </Suspense>
            </BrowserRouter>
          </PoolContextProvider>
        </GrafanaToolbarContextProvider>
      ) : (
        LoadingSpinner()
      )}
    </div>
  );
}

export default App;
