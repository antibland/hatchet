import React from "react";
import Step4 from "../Create/Step4";

const Step2 = props => {
  return (
    <Step4
      currentStep={props.currentStep}
      fightData={props.fightData}
      afterValid={props.afterValid}
      side={props.side}
    >
      {props.children}
    </Step4>
  );
};

export default Step2;
