import React from "react";
import Link from "next/link";

const InfoBox = ({
  headingText,
  bgColor = "bg-gray-100",
  textColor = "text-black",
  btnObj,
  children,
}) => {
  return (
    <div className={`${bgColor} p-6 rounded-lg shadow-md`}>
      <h2 className={`${textColor} text-2xl font-bold`}>{headingText}</h2>
      <p className={`${textColor} mt-2 mb-4`}>{children}</p>
      <Link
        href={btnObj.link}
        className={`${btnObj.bgColor} inline-block bg-black text-white rounded-lg px-4 py-2 hover:opacity-80`}
      >
        {btnObj.text}
      </Link>
    </div>
  );
};

export default InfoBox;
