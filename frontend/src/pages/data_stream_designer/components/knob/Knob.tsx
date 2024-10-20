import { Knob, Pointer, Arc } from "rc-knob";
import "./knob.css";
import { AiOutlinePoweroff } from "react-icons/ai";

export default function Knobs(props: {
  powerOff: boolean;
  onValueChange?: any;
  onPowerBtnClicked?: any;
  min: number;
  max: number;
  value: number;
  stepSize?: number;
}) {
  function formatNumber(value: number) {
    if (value < 0.01) {
      return value.toExponential(1);
    } else {
      return value;
    }
  }
  return (
    <div className="knob__outer">
      <div className="knob__inner">
        <div className="circular-dot" style={{ "--i": 1 }}></div>
        <div className="circular-dot" style={{ "--i": 2 }}></div>
        <div className="circular-dot" style={{ "--i": 3 }}></div>
        <div className="circular-dot" style={{ "--i": 4 }}></div>
        <div className="circular-dot" style={{ "--i": 5 }}></div>
        <div className="circular-dot" style={{ "--i": 6 }}></div>
        <div
          id="powerBtn"
          className={props.powerOff ? "power-off" : ""}
          onClick={props.onPowerBtnClicked}
        >
          <AiOutlinePoweroff />
        </div>
        <Knob
          className="knob__slider nowheel"
          size={100}
          angleOffset={220}
          angleRange={280}
          min={props.min}
          max={props.max}
          onChange={(value: any) => {
            props.onValueChange(value * (props.stepSize || 1));
          }}
        >
          <Arc arcWidth={7} color="#FC5A96" radius={47.5} />
          <Pointer width={4} radius={40} type="circle" color="#ffff" />
        </Knob>
        <div style={{ position: "relative", display: "inline-block" }}>
          <div
            style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              backgroundColor: "rgba(0, 0, 0, 0)",
              fontFamily: '"Work Sans", sans-serif',
              color: "#fc5a96",
              fontSize: "25px",
              whiteSpace: "nowrap",
            }}
          >
            {formatNumber(props.value)}
          </div>
        </div>
      </div>
    </div>
  );
}
