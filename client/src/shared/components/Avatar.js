import React from "react";

const Avatar = props => {
  return (
    <div className="avatar">
      <div
        onClick={props.onClick}
        style={{
          backgroundSize: props.backgroundSize,
          width: props.width,
          height: props.height,
          borderRadius: "50%",
          display: "inline-block",
          backgroundImage: `url(${props.imgpath})`,
          ...props.styles
        }}
      />
      {props.children}
    </div>
  );
};

Avatar.defaultProps = {
  imgpath: "/question_mark.png",
  backgroundSize: "cover",
  width: "100px",
  height: "100px",
  styles: ""
};

export default Avatar;
