import * as React from "react";

interface IUserIconProps {
  username : string
}

const UserIcon: React.FunctionComponent<IUserIconProps> = (props) => {
  return (
    <div
      className={`
  rounded-full 
  w-8 h-8 
  bg-gray-400 text-white 
  flex justify-center items-center`}
    >
      {props.username[0].toUpperCase()}
    </div>
  );
};

export default UserIcon;
