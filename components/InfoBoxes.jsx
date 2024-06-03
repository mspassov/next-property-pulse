import React from "react";
import InfoBox from "./InfoBox";

const InfoBoxes = () => {
  return (
    <section>
      <div className="container-xl lg:container m-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 rounded-lg">
          <InfoBox
            headingText="For Renters"
            bgColor="bg-gray-200"
            btnObj={{
              text: "Browse Properties",
              link: "/properties",
              bgColor: "bg-black",
            }}
          >
            Find your dream rental property. Bookmark properties and contact
            owners.
          </InfoBox>
          <InfoBox
            headingText="For Property Owners"
            bgColor="bg-blue-100"
            btnObj={{
              text: "Add Property",
              link: "/properties/add",
              bgColor: "bg-blue-500",
            }}
          >
            List your properties and reach potential tenants. Rent on a short
            and long term basis.
          </InfoBox>
        </div>
      </div>
    </section>
  );
};

export default InfoBoxes;
