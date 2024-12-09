import React, { createContext, useState, useEffect } from "react";
import axios from "axios";

export const PoolContext = createContext();

const PoolContextProvider = ({ children,token }) => {

 //pool context starts here
  //state if pool available or not
  let [isPoolAvailable, setIsPoolAvailable] = useState(false);
  //state for all the pools
  let [availablePools, setAvailablePools] = useState([]);
  //state for all the users
  let [users, setUsers] = useState([]);
  //state if cluster available or not
  let [isClusterAvailable, setIsClusterAvailable] = useState(false);
  //state for all the cluster
  let [availableClusters, setAvailableClusters] = useState([]);
  // states for domain or AD
  let [isDomainAvailable,setisDomainAvailable]=useState();
  let [availableDomains,setAvailableDomains]=useState([]);
  //function to get all pools
  let getPools = () => {
  
    axios
      .get(`${process.env.REACT_APP_BACKEND_URL}/v1/pools`, {
        headers: {
          Authorization: `Bearer ${token}` // Include the Bearer token in the Authorization header
        }
      })
      .then((res) => {
        if (res.data.length > 0) {
          setIsPoolAvailable(true);
          setAvailablePools(res.data);
        } else {
          setIsPoolAvailable(false);
          setAvailablePools([]); // Ensure it resets to an empty array if no pools are available
        }
      })
      .catch((err) => {
        console.error(err);
      });
  };
  
  //function to get all clusters
  let getClusters = () => {
    axios
      .get(
        `${process.env.REACT_APP_BACKEND_URL}/v1/clusters`,
        {
          headers: {
            Authorization: `Bearer ${token}` // Include the Bearer token in the Authorization header
          }
        })
      .then((res) => {
        if (res.data.length > 0) {
          setIsClusterAvailable(true);
          setAvailableClusters(res.data);
        } else {
          setIsClusterAvailable(false);
          setAvailableClusters([]); // Make sure to set it to an empty array if no pools are available
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };
  let getDomains=()=>{
    axios.get(`${process.env.REACT_APP_BACKEND_URL}/v1/ldaps`,{
      headers: {
        Authorization: `Bearer ${token}` // Include the Bearer token in the Authorization header
      }
    }).then((res)=>{
      // console.log(res.data);
      if(res.data && res.data.length>0){
        setisDomainAvailable(true)
        setAvailableDomains(res.data)
      }else{
        setisDomainAvailable(false)
        setAvailableDomains([])
      }
    }).catch((err) => {
      console.log(err);
    })
  }
  useEffect(() => {
    getPools();
    getClusters();
    getDomains();
  }, []);
//Pool context values
let value = {
    isPoolAvailable: isPoolAvailable,
    setIsPoolAvailable: setIsPoolAvailable,
    availablePools: availablePools,
    setAvailablePools: setAvailablePools,
    users: users,
    setUsers: setUsers,
    isClusterAvailable: isClusterAvailable,
    setIsClusterAvailable: setIsClusterAvailable,
    availableClusters: availableClusters,
    setAvailableClusters: setAvailableClusters,
    getClusters:getClusters,
    getPools:getPools,
    isDomainAvailable:isDomainAvailable,
    setisDomainAvailable:setisDomainAvailable,
    availableDomains:availableDomains,
    setAvailableDomains:setAvailableDomains,
    token:token
  };
  return (
    <PoolContext.Provider value={value}>
      {children}
    </PoolContext.Provider>
  );
};

export default PoolContextProvider;
