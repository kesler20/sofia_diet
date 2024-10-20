import * as React from "react";
import { AiFillPlusCircle } from "react-icons/ai";

export default function UploadAFileCardComponent(props: {
  onClick: (files: File | null) => void;
}) {
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      props.onClick(files[0]);
    }
  };

  return (
    <div className="w-full flex items-center justify-center">
      <input
        type="file"
        placeholder="Upload a file"
        ref={fileInputRef}
        style={{ display: "none" }}
        onChange={handleFileChange}
      />
      <div
        className="w-[200px] h-[150px] 
        bg-[rgb(75,85,99)]
        flex items-center justify-center 
        rounded-xl flex-col border-dotted 
        border-default-color 
        border-4 hover:brightness-110 
        hover:cursor-pointer 
        hover:border-gray-700"
        onClick={handleClick}
      >
        <p className="text-[rgb(199,201,207)] m-5">Upload a File</p>
        <AiFillPlusCircle size={50} color={"rgb(199,201,207)"} />
      </div>
    </div>
  );
}
