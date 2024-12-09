import React, { useContext } from "react";
import { PoolContext } from "../../Context/PoolContext";

import ShowDomains from "./ShowDomains";
import DomainCreationForm from "./DomainCreatingForm";
import DomainCard from "./DomainCard";
const Domain = () => {
  //pool context
  const pc = useContext(PoolContext);
  return (
    <div>
      <ShowDomains />
      {/* <DomainCard name="name" providerId="providerId" enabled="enabled" /> */}
    </div>
  );
};

export default Domain;
