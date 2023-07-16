import React, { useState } from "react";
import {
  HomeContainer,
  HomeBg,
  VideoBg,
  HomeContent,
  HomeH1,
  HomeP,
  HomeItem,
} from "./HomeElements";
import { Button } from "../ButtonElement";
import Video from "../../videos/video.mp4";
const HomeSection = () => {
  const [hover, setHover] = useState(false);

  const onHover = () => {
    setHover(!hover);
  };

  return (
    <HomeContainer>
      <HomeBg>
        <VideoBg autoPlay loop muted src={Video} type="video/mp4"></VideoBg>
      </HomeBg>
      <HomeContent>
        <HomeH1>Best Health Services in India</HomeH1>
        <HomeP>
          To get a doctor consultancy at your home, select location we find a
          specialist doctor and send to your home
        </HomeP>
        <HomeP>
          Book online doctor consultancy or book timing for consultancy at
          clicnic or hospital.
        </HomeP>
      </HomeContent>
    </HomeContainer>
  );
};

export default HomeSection;
