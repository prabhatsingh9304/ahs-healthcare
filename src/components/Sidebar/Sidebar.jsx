import React from "react";
import {
  SidebarContainer,
  Icon,
  CloseIcon,
  SideBtnWrap,
  SidebarWrapper,
  SidebarMenu,
  SidebarLink,
  SidebarRoute,
} from "./SidebarElements";

const Sidebar = ({ isOpen, toggle }) => {
  return (
    <SidebarContainer isOpen={isOpen} onClick={toggle}>
      <Icon onClick={toggle}>
        <CloseIcon />
      </Icon>
      <SidebarWrapper>
        <SidebarMenu>
          <SidebarLink to="services" onClick={toggle}>
            Our Services
          </SidebarLink>
          <SidebarLink to="about" onClick={toggle}>
            About Us
          </SidebarLink>
          <SidebarLink to="contact" onClick={toggle}>
            Contact Us
          </SidebarLink>
        </SidebarMenu>
        <SideBtnWrap>
          <SidebarRoute to="/signup">Sign Up</SidebarRoute>
        </SideBtnWrap>
        <SideBtnWrap>
          <SidebarRoute to="/signin">Sign In</SidebarRoute>
        </SideBtnWrap>
      </SidebarWrapper>
    </SidebarContainer>
  );
};

export default Sidebar;
