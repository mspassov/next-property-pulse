'use client';
import { useContext, createContext, useState } from "react";

const GlobalContext = createContext();

//Create provider - this is to provide the context to the rest of our components
export const GlobalProvider = ({children}) =>{
    const [msgCount, setMsgCount] = useState(0);

    return (
        <GlobalContext.Provider value={{
            msgCount, 
            setMsgCount
        }}>
            {children}
        </GlobalContext.Provider>
    )
}

//Create the context hook to access our Global Context
export const useGlobalContext = () =>{
    return useContext(GlobalContext);
}