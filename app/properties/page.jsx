import React from "react";
import PropertyCard from "@/components/PropertyCard";
import properties from "@/properties.json";

const Properties = () => {
  return (
    <section className="px-4 py-6">
      <div className="container-xl lg:container m-auto px-4 py-6">
        {properties == null || properties.length == 0 ? (
          <p>No properties currently available</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {properties.map((curr) => (
              <PropertyCard key={curr._id} property={curr} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default Properties;
