import React from "react";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import { useState } from "react";

export const PropertyTab = (props: { children?: React.ReactNode }) => {
  return (
    <div className="min-h-[100px] w-full flex items-center justify-between flex-col">
      {props.children}
    </div>
  );
};

const TabPanel = (props: {
  children?: React.ReactNode;
  index: number;
  value: number;
}) => {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
};

const a11yProps = (index: number) => {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
};

export const Panel = (props: {
  properties: React.ReactNode[];
  propertyNames: string[];
}) => {
  const [value, setValue] = useState(0);

  const handleChange = (_: any, newValue: number) => {
    setValue(newValue);
  };

  return (
    <Box sx={{ height: "100%", width: "100%", paddingTop: "40px" }}>
      <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
        <Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
          {props.propertyNames.map((propertyName, index) => {
            return (
              <Tab key={index} label={`${propertyName}`} {...a11yProps(index)} />
            );
          })}
        </Tabs>
      </Box>
      {props.properties.map((propertyTab, index) => {
        return (
          <TabPanel value={value} index={index} key={index}>
            {propertyTab}
          </TabPanel>
        );
      })}
    </Box>
  );
};

export default function CustomTabComponent(props: {
  tabNames: string[];
  customTabs: React.ReactNode[];
}) {
  return (
    <div className="flex flex-col items-center justify-center bg-white rounded-2xl shadow-2xl p-10">
      <Panel
        properties={props.customTabs.map((customTab, index) => {
          return <PropertyTab key={index} children={customTab} />;
        })}
        propertyNames={props.tabNames}
      />
    </div>
  );
}
