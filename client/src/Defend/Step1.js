import React from "react";
import Step3 from "../Create/Step3";

const Step1 = props => {
  return (
    <Step3
      currentStep={props.currentStep}
      fightData={props.fightData}
      afterValid={props.afterValid}
      side={props.side}
    />
  );
};

export default Step1;
