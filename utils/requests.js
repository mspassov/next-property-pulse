//Need to have a check on the API domain, because domain will not exist while Vercel doploys the app
const apiDomain = process.env.NEXT_PUBLIC_API_DOMAIN || null;

//Get all properties from the database
const getProperties = async () => {
  try {
    //While dpeloying, handle case where API Domain is not yet available
    if(!apiDomain){
        return []
    }

    const res = await fetch(`${apiDomain}/properties`);

    if (!res.ok) {
      throw new Error("Could not fetch data");
    } else {
      return res.json();
    }
  } catch (error) {
    console.log(error);
    return [];
  }
};

//Get single property from the database
const getProperty = async (id) =>{
    try {
    //While dpeloying, handle case where API Domain is not yet available
    if(!apiDomain){
        return null
    }

    const res = await fetch(`${apiDomain}/properties/${id}`);

    if (!res.ok) {
      throw new Error("Could not fetch data");
    } else {
      return res.json();
    }
  } catch (error) {
    console.log(error);
    return null;
  }
}

export {
    getProperties,
    getProperty
}