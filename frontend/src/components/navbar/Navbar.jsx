import { NavLink } from "react-router-dom";
import Logo from "../../assets/Logo.png";
import styled from "styled-components";
import { useState, useEffect, React } from "react";
import "./Navbar.css";

const Navbar = () => {
  const [sideBarView, setSideBarView] = useState([]);

  useEffect(() => {
    changeBarView();
  }, []);

  const changeBarView = () => {
    let currentView = !sideBarView;
    setSideBarView(currentView);
  };

  const renderSideBar = (toRender) => {
    if (toRender) {
      return (
        <div className="navbar__container__sidebar">
          <Link to={"./diet"}>Diet Plan</Link>
          <Link to={"./meal"}>Meals</Link>
          <Link to={"./food"}>Foods</Link>
        </div>
      );
    } else {
      return "";
    }
  };
  return (
    <div>
      <div className="navbar__container">
        <div
          className="navbar__container__hamburger-btn"
          onClick={() => changeBarView()}
        >
          <i class="fa fa-bars fa-2x"></i>
        </div>
        <div className="navbar__container__site-title">
          <Link to={"./"}>
            <img src={Logo} alt="site logo" />
          </Link>
          <p>sofiaDiet</p>
        </div>
        <div className="navbar__container__version">
          <p>version: {process.env.REACT_APP_VERSION}</p>
        </div>
      </div>
      <hr />
      {renderSideBar(sideBarView)}
    </div>
  );
};

export default Navbar;

const Link = styled(NavLink)`
  text-decoration: none;
  outline: none;
  margin-right: 20px;
  color: rgb(104, 104, 104);
`;
