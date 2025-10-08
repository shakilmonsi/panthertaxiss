import React from "react";
import DiscographyDisplay from "../../../components/About/AboutDiscography";
import AboutWhatSets from "../../../components/About/AboutWhatSets";
import AboutMainSection from "../../../components/About/AboutMainSection";

const AboutView = () => {
  return (
    <div
      style={{
        background: "linear-gradient(180deg, #050306 0%, #5D006D 100%)",
      }}
    >
      <AboutMainSection></AboutMainSection>
      <AboutWhatSets></AboutWhatSets>
      <DiscographyDisplay></DiscographyDisplay>
    </div>
  );
};

export default AboutView;
