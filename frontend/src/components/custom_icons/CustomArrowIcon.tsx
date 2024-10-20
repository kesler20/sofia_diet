import * as React from "react";
import "./CustomArrowIcon.css";

interface ICustomArrowProps {
  text: string;
  className: string;
}

export const PrimaryCustomArrowIcon: React.FunctionComponent<ICustomArrowProps> = (
  props
) => {
  return (
    <div className={`primary-custom-arrow text-white bg-blue-500 ${props.className}`}>
      {props.text}
    </div>
  );
};

export const SecondaryCustomArrowIcon: React.FunctionComponent<ICustomArrowProps> = (
  props
) => {
  return (
    <div className={`secondary-custom-arrow text-white bg-tertiary ${props.className}`}>
      {props.text}
    </div>
  );
};

