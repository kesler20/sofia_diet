import * as React from "react";
import Box from "@mui/material/Box";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";

export default function BasicSelect(props) {
  const [day, setDay] = React.useState("");

  const handleChange = (event) => {
    props.onSelect(event);
    setDay(event.target.value);
  };

  return (
    <Box sx={{ minWidth: 120 }}>
      <FormControl fullWidth>
        <InputLabel id="demo-simple-select-label">Day of the Week</InputLabel>
        <Select
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          value={day}
          label="Day of the Week"
          onChange={handleChange}
        >
          {[
            "Monday",
            "Tuesday",
            "Wednesday",
            "Thursday",
            "Friday",
            "Saturday",
            "Sunday",
          ].map((day, id) => {
            return (
              <MenuItem key={id} value={day}>
                {day}
              </MenuItem>
            );
          })}
        </Select>
      </FormControl>
    </Box>
  );
}
