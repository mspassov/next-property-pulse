"use client";
import React from "react";
import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { FaArrowAltCircleLeft } from "react-icons/fa";
import PropertyCard from "@/components/PropertyCard";
import Spinner from "@/components/Spinner";

const SearchResultsPage = () => {
  const params = useSearchParams();

  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);

  const search = params.get("search");
  const propertyType = params.get("propertyType");

  useEffect(() => {
    const getSearchResults = async () => {
      try {
        const res = await fetch(
          `/api/properties/search?search=${search}&propertyType=${propertyType}`
        );

        if (res.status == 200) {
          const data = await res.json();
          setProperties(data);
        } else {
          setProperties([]);
        }
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

    getSearchResults();
  }, [search, propertyType]);

  return loading ? (
    <Spinner loading={loading} />
  ) : (
    <section className="px-4 py-6">
      <div className="container-xl lg:container m-auto px-4 py-6">
        <Link
          href="/properties"
          className="flex items-center text-blue-500 hover:underline mb-3"
        >
          <FaArrowAltCircleLeft className="mr-2 mb-1" /> Back to Properties
        </Link>
        <h1 className="text-2xl mb-4">Search Results</h1>
        {properties == null || properties.length == 0 ? (
          <p>No properties found</p>
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

export default SearchResultsPage;
