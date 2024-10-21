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
    // The first line contains the seperation between the navbar and the links drop down
    <div className="flex flex-col items-center justify-center w-full h-24">
      {/* The second line contains the logo, title and the hamburger menu */}
      <div className="w-full flex items-center justify-evenly">
        {/* This is the hamburger menu */}
        <div
          className={`
        border-0.1 rounded-xl w-12 h-8
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

        {/* This is the title and the logo */}
        <h1 className="text-[30px] font-bold site-title"> sofiaDiet</h1>

        {/* This is the logo */}
        <p>version 0.0.3</p>
      </div>

      {/* This is the links drop down */}
      <div className="flex flex-row items-center h-8 justify-evenly w-full">
        {open &&
          pages.map((pageMetaData, index) => {
            return (
              <Link key={index} to={pageMetaData.link}>
                {pageMetaData.name}
              </Link>
            );
          })}
      </div>
    </div>
  );
}
