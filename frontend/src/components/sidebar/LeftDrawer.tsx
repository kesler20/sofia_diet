import * as React from "react";
import { AiOutlineArrowLeft } from "react-icons/ai";
import useStateStyleContext from "../../contexts/StyleContextProvider";

export type Folder = {
  name: string;
  icon: React.ReactNode;
  folderIndex: number; // this is to know how many folders deep we are
  subFolders: Folder[];
  sideEffect?: () => void;
};

function Drawer(props: {
  folder: Folder;
  openFolder: (folder: Folder) => void;
  closeFolder: (folder: Folder) => void;
}) {
  return (
    <div
      className={`
  h-screen w-[180px] md:w-[180px] z-[100]
  absolute top-0 left-0 pl-6
  flex flex-col items-center justify-start
  overflow-y-auto
  bg-primary text-white shadow-xl
  border-r-2 border-default-color 
  `}
      style={{ marginLeft: `${props.folder.folderIndex * 180}px` }}
    >
      {/* container of the first drawer */}
      <div className="flex w-full justify-end p-4">
        {/* top arrow icon first drawer */}
        <div
          className={`
      w-[40px] h-[40px]
      rounded-full
      flex items-center justify-center
      slide-in-left-fade-in-fast hover:cursor-pointer
      bg-fourth-color
      `}
          onClick={() => props.closeFolder(props.folder)}
        >
          <AiOutlineArrowLeft className="text-tertiary rotate-arrow" size={20} />
        </div>
      </div>
      {/* Name of the current folder */}
      <p className="paragraph-text">{`${props.folder.name}`}</p>
      {/* List of sub folders */}
      {props.folder.subFolders.map((subFolder, index) => {
        return (
          <div
            key={index}
            className={`
        w-full h-24 
        flex items-center justify-between pr-4 
        slide-in-left-fade-in-fast
        `}
            onClick={() => {
              if (subFolder.sideEffect) {
                console.log(subFolder.sideEffect)
                subFolder.sideEffect();
              } else {
                props.openFolder(subFolder);
              }
            }}
          >
            <p className="text-tertiary hover:cursor-pointer">{subFolder.name}</p>
            {subFolder.icon}
          </div>
        );
      })}
    </div>
  );
}

export default function LeftDrawer(props: { folder: Folder }) {
  const { isDrawerOpen, setIsDrawerOpen } = useStateStyleContext();
  const [openedFolders, setOpenedFolders] = React.useState<Folder[]>([props.folder]);

  console.log(props.folder.subFolders[3].subFolders)

  React.useEffect(() => {
    if (isDrawerOpen) {
      setOpenedFolders([props.folder]);
    }
  }, [isDrawerOpen, props.folder]);

  React.useEffect(() => {
    if (openedFolders.length === 0) {
      setIsDrawerOpen(false);
    }
  }, [openedFolders]);

  return (
    isDrawerOpen && (
      // first drawer
      <>
        {openedFolders.map((folder, index) => {
          return (
            <Drawer
              key={index}
              folder={folder}
              openFolder={(newFolder) =>
                setOpenedFolders((prev) => [...prev, newFolder])
              }
              closeFolder={(oldFolder) =>
                setOpenedFolders((prev) =>
                  prev.filter(
                    (f) => f.folderIndex <= oldFolder.folderIndex && f !== oldFolder
                  )
                )
              }
            />
          );
        })}
      </>
    )
  );
}
