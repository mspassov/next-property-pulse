"use client";
import React from "react";
import { useState, useEffect } from "react";
import PropertyCard from "@/components/PropertyCard";
import Spinner from "@/components/Spinner";
import { toast } from "react-toastify";

const SavedProperties = () => {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getBookmarks = async () => {
      try {
        const res = await fetch("/api/bookmarks");

        if (res.status == 200) {
          const data = await res.json();
          setProperties(data);
        } else {
          toast.error("Failed to get bookmarked properties");
        }
      } catch (error) {
        console.log(error);
        toast.error("Failed to get bookmarked properties");
      } finally {
        setLoading(false);
      }
    };

    getBookmarks();
  }, []);

  return loading ? (
    <Spinner loading={loading} />
  ) : (
    <section className="px-4 py-6">
        <h1 className="text-2xl mb-4">Saved Properties</h1>
      <div className="container-xl lg:container m-auto px-4 py-6">
        {properties == null || properties.length == 0 ? (
          <p>No properties bookmarked</p>
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

export default SavedProperties;
