"use client";
import React from "react";
import PropertyHeaderImage from "@/components/PropertyHeaderImage";
import PropertyDetails from "@/components/PropertyDetails";
import { getProperty } from "@/utils/requests";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { FaArrowLeft } from "react-icons/fa";
import Spinner from "@/components/Spinner";
import PropertyGallery from "@/components/PropertyGallery";
import PropertyContactForm from "@/components/PropertyContactForm";
import BookmarkButton from "@/components/BookmarkButton";

const SingleProperty = () => {
  const { id } = useParams();
  const [property, setProperty] = useState(null);
  const [isLoading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const data = await getProperty(id);
      setProperty(data);
      setLoading(false);
    };

    if (property === null) {
      fetchData();
    }
  }, [id, property]);

  if (!property && !isLoading) {
    return (
      <h1 className="text-center text-2xl font-bold mt-10">
        No property found
      </h1>
    );
  }

  return (
    <>
      {isLoading && <Spinner />}
      {!isLoading && property && (
        <>
          <PropertyHeaderImage image={property.images[0]} />
          <section>
            <div className="container m-auto py-6 px-6">
              <Link
                href="/properties"
                className="text-blue-500 hover:text-blue-600 flex items-center"
              >
                <FaArrowLeft className="mr-2" /> Back to Properties
              </Link>
            </div>
          </section>

          <section className="bg-blue-50">
            <div className="container m-auto py-10 px-6">
              <div className="grid grid-cols-1 md:grid-cols-70/30 w-full gap-6">
                <PropertyDetails property={property} />

                {/* <!-- Sidebar --> */}
                <aside className="space-y-4">
                  <BookmarkButton property={property}/>
                  <button className="bg-orange-500 hover:bg-orange-600 text-white font-bold w-full py-2 px-4 rounded-full flex items-center justify-center">
                    <i className="fas fa-share mr-2"></i> Share Property
                  </button>

                  <PropertyContactForm />
                </aside>
              </div>
            </div>
          </section>
          <PropertyGallery images={property.images} />
        </>
      )}
    </>
  );
};

export default SingleProperty;
