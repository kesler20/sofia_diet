import React, { useEffect, useState } from "react";
import { Slider, Switch, Paper } from "@material-ui/core";
import Knobs from "../../knob/knob";
import "./ChannelCommand.css";
import { useStateContext } from "../../../contexts/ContextProvider";
const ChannelCommand = (props) => {
  
  const {
    onKnobValueChange,
    onControlBtnClicked,
    onSliderChange,
    handlePowerBtnClicked,
    channelName,
    onSmoothingClicked,
    channelID,
  } = props;

  const { db, currentColor } = useStateContext();
  const [clients, setClients] = useState(
    db.readResourceFromLocalStorage("client-info")
  );
  useEffect(() => {
    setClients(db.readResourceFromLocalStorage("client-info"));
  }, []);

  return (
    <Paper elevation={3} id="channel-command__outer">
      <p className="channel-command__name">{channelName}</p>
      <Paper className="channel-command__inner">
        <Knobs
          channelID={channelID}
          onValueChange={(value) => onKnobValueChange(value)}
          onPowerBtnClicked={handlePowerBtnClicked}
        />
      </Paper>
      <div className="channel-command__inner__controls">
        {clients[channelID].controlled ? (
          <Switch defaultChecked onClick={onControlBtnClicked} />
        ) : (
          <Switch onClick={onControlBtnClicked} />
        )}
        <Slider
          className="channel-command__slider"
          aria-label="Small steps"
          defaultValue={clients[channelID].errorBound}
          step={5}
          marks
          min={0}
          max={30}
          valueLabelDisplay="auto"
          onChange={(e) => onSliderChange(e)}
        />
        <button
          type="button"
          onClick={() => onSmoothingClicked()}
          style={{
            backgroundColor: currentColor,
            color: "white",
            borderRadius: "10px",
          }}
          className="text-44 p-3 w-24 hover:drop-shadow-xl mr-5"
        >
          smooth
        </button>
      </div>
    </Paper>
  );
};

export default ChannelCommand;
