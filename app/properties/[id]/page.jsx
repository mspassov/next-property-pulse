"use client";
import React from "react";
import { getProperty } from "@/utils/requests";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

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
    console.log(property);
  }, [id, property]);

  return <div>SingleProperty</div>;
};

export default SingleProperty;
