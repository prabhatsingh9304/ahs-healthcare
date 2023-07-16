import React from "react";
import Icon1 from "../../images/svg-7.svg";
import Icon2 from "../../images/svg-8.svg";
import {
  ContactCard,
  ContactContainer,
  ContactH1,
  ContactH2,
  ContactIcon,
  ContactP,
  ContactWrapper,
} from "./ContactElements";
function Contact() {
  return (
    <ContactContainer id="contact">
      <ContactH1>Contact Us</ContactH1>
      <ContactWrapper>
        <ContactCard>
          <ContactIcon src={Icon1} />
          <ContactH2>Amar Kumar</ContactH2>
          <ContactP>I'm a student of NSUT</ContactP>
          <br />
          <ContactP>LinkedIn:-XXXXX</ContactP>
          <ContactP>Contact No.:-XXXXX</ContactP>
        </ContactCard>
        <ContactCard>
          <ContactIcon src={Icon2} />
          <ContactH2>Prabhat Singh</ContactH2>
          <ContactP>I'm a student of IIT Delhi</ContactP>
          <br />
          <ContactP>LinkedIn:-XXXXX</ContactP>
          <ContactP>Contact No.:-XXXXX</ContactP>
        </ContactCard>
      </ContactWrapper>
    </ContactContainer>
  );
}

export default Contact;
