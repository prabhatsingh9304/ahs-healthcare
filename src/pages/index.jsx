import React, { useState } from "react";
import Sidebar from "../components/Sidebar/Sidebar";
import Navbar from "../components/Navbar/Navbar";
import HomeSection from "../components/HomeSection/HomeSection";
import InfoSection from "../components/InfoSection/InfoSection";
import { homeObjOne, homeObjThree } from "../components/InfoSection/Data";
import { homeObjTwo } from "../components/InfoSection/Data";
import Contact from "../components/Contacts/Contact";
import Footer from "../components/Footer/Footer";

const Home = () => {
  const [isOpen, setIsOpen] = useState(false);
  const toggle = () => {
    setIsOpen(!isOpen);
  };
  return (
    <>
      <Sidebar isOpen={isOpen} toggle={toggle} />
      <Navbar toggle={toggle} />
      <HomeSection />
      <InfoSection {...homeObjOne} />
      <InfoSection {...homeObjTwo} />
      <InfoSection {...homeObjThree} />
      <Contact />
      <Footer />
    </>
  );
};

export default Home;
