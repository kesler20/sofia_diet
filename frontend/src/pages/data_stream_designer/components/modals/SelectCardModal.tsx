import "./SelectCardModal.css";
import { useEffect, useState } from "react";
import { CSSTransition } from "react-transition-group";
import { FaArrowLeft, FaArrowRight, FaCog, FaPlus } from "react-icons/fa";
import { IoIosArrowForward } from "react-icons/io";

type MenuItemType = {
  name: string;
  sideEffect: any;
};

export type CardCategoriesType = {
  icon: JSX.Element;
  name: string;
  menuItems: MenuItemType[];
}[];

export default function SelectCardModal(props: {
  open: boolean;
  onClose: any;
  cardCategories: CardCategoriesType;
}) {
  const [activeMenu, setActiveMenu] = useState("main");
  const [open, setOpen] = useState(props.open);

  useEffect(() => {
    setOpen(props.open);
  }, [props.open]);

  function DropdownItem(props: any) {
    return (
      <a
        href="#"
        className="menu-item  hover:bg-gray-300"
        onClick={() => props.goToMenu && setActiveMenu(props.goToMenu)}
      >
        <span className="icon-button">{props.leftIcon}</span>
        {props.children}
        <span className="icon-right">{props.rightIcon}</span>
      </a>
    );
  }

  return (
    open && (
      <div className="absolute top-0 left-1/2 md:left-[60%] flex justify-evenly items-center flex-col h-screen">
        <div className="dropdown border-0.1 border-gray-200 shadow-md h-auto">
          <CSSTransition
            in={activeMenu === "main"}
            timeout={500}
            classNames="menu-primary"
            unmountOnExit
          >
            <div className="menu">
              {props.cardCategories.map((category, index) => {
                return (
                  <DropdownItem
                    key={index}
                    leftIcon={category.icon}
                    rightIcon={
                      <div
                        className="
              h-8 w-8
              flex items-center justify-center
              rounded-full
              border-0.1 border-gray-500
              "
                      >
                        <FaArrowRight />
                      </div>
                    }
                    goToMenu={category.name}
                  >
                    {category.name}
                  </DropdownItem>
                );
              })}
            </div>
          </CSSTransition>
          {props.cardCategories.map((category, index) => {
            return (
              <CSSTransition
                in={activeMenu === category.name}
                key={index}
                timeout={500}
                classNames="menu-secondary"
                unmountOnExit
              >
                <div className="menu">
                  <DropdownItem
                    goToMenu="main"
                    leftIcon={<FaCog />}
                    rightIcon={
                      <div
                        className="
              h-8 w-8
              flex items-center justify-center
              rounded-full
              border-0.1 border-gray-500
              "
                      >
                        <FaArrowLeft />
                      </div>
                    }
                  >
                    <h2>Main Menu</h2>
                  </DropdownItem>
                  {category.menuItems.map((menuItem: MenuItemType) => {
                    return (
                      <DropdownItem
                        leftIcon={<IoIosArrowForward />}
                        rightIcon={
                          <div
                            onClick={() => menuItem.sideEffect(menuItem.name)}
                            className="
              h-8 w-8
              flex items-center justify-center
              rounded-full
              border-0.1 border-gray-500
              "
                          >
                            <FaPlus />
                          </div>
                        }
                      >
                        {menuItem.name}
                      </DropdownItem>
                    );
                  })}
                </div>
              </CSSTransition>
            );
          })}
        </div>
      </div>
    )
  );
}
