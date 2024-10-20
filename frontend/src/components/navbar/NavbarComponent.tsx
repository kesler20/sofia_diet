import { NavLink } from "react-router-dom";
import Logo from "../../assets/Logo.png";
import styled from "styled-components";
import { useStoredValue } from "../../customHooks";
import { GiHamburgerMenu } from "react-icons/gi";
import { pages } from "../../pages/Pages";


const Link = styled(NavLink)`
  text-decoration: none;
  outline: none;
  margin-right: 20px;
  color: rgb(104, 104, 104);
`;

export default function NavbarComponent() {
  const [open, setOpen] = useStoredValue(true, "navbar/state");

  return (
    <>
      <div className="m-24 flex flex-row items-center justify-start w-24 h-[80px] border-8 md:flex-col md:justify-between md:items-center md:w-full">
        <div
          className={`
        border-[5px] w-[57px] h-[42px] mr-[50px]
        flex items-center justify-center
        hover:shadow-[1px_1px_1px_10px_rgb(245,255,229)]
        md:border-[0.1px] md:mr-0 md:rounded-[5px] md:flex md:justify-evenly md:flex-col md:items-center
          `}
          onClick={() => setOpen(!open)}
          style={{
            borderColor: "rgb(186, 202, 183)",
          }}
        >
          <GiHamburgerMenu />
        </div>
        <div className="text-[40px] font-bold w-[280px] flex justify-evenly ml-24 md:hidden">
          <Link to={"./"}>
            <img
              src={Logo}
              alt="site logo"
              className="w-[59px] h-[53px] border-[20px]"
            />
          </Link>
          <p className="sofia-title" >sofiaDiet</p>
        </div>
        <div className="w-[180px] ml-24 text-[28px] font-bold flex text-[#555555] items-center justify-evenly md:hidden">
          <p>version: 0.0.4</p>
        </div>
      </div>
      <hr />
      {open && (
        <div className="flex flex-row items-center justify-evenly w-full">
          {pages.map((pageMetaData, index) => {
            return (
              <Link key={index} to={pageMetaData.link}>
                {pageMetaData.name}
              </Link>
            );
          })}
        </div>
      )}
    </>
  );
}
