"use client";
import React from "react";
import PropertyCard from "@/components/PropertyCard";
import { useState, useEffect } from "react";
import Spinner from "@/components/Spinner";
import Pagination from "@/components/Pagination";

const PropertiesGrid = () => {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(3);
  const [totalItems, setTotalItems] = useState(0);

  const handlePageChange = (newPage) => {
    setPage(newPage);
  };

  useEffect(() => {
    const getProperties = async () => {
      try {
        const res = await fetch(
          `/api/properties?page=${page}&pageSize=${pageSize}`
        );

        if (res.status !== 200) {
          throw new Error("Could not get property data");
        }

        const data = await res.json();
        setProperties(data.properties);
        setTotalItems(data.totalProperties);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

    getProperties();
  }, [page, pageSize]);

  return loading ? (
    <Spinner loading={loading} />
  ) : (
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
        <Pagination
          page={page}
          pageSize={pageSize}
          totalItems={totalItems}
          onPageChange={handlePageChange}
        />
      </div>
    </section>
  );
};

export default PropertiesGrid;
