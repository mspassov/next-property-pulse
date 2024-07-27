import React from "react";
//import properties from "@/properties.json";
import { getProperties } from "@/utils/requests";
import PropertiesGrid from "@/components/PropertiesGrid";

const Properties = async () => {
  const properties = await getProperties();

  return <PropertiesGrid />;
};

export default Properties;
