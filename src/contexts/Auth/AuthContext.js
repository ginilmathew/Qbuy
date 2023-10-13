import React, { useState, useEffect, useCallback } from "react";
import Context from "./index";

const AuthProvider = (props) => {
    const [login, setLogin] = useState([]);
    const [userData, setUserData] = useState(null);
    const [homeData, setHomeData] = useState([]);
    const [location, setLocation] = useState(null)
    const [currentAddress, setCurrentAddress] = useState(null)

    const [userLocation, setUserLocation] = useState(null)
    const [city, setCity] = useState(null)




    const [cartId, setCartId] = useState('');
    return (
        <Context.Provider
            value={{
                ...props,
                login,
                userData, 
                homeData,
                cartId,
                userLocation,
                city, 
                setCity,
                setUserLocation,
                setUserData,
                setLogin,
                setCartId,
                setHomeData,
                location,
                setLocation,
                currentAddress,
                setCurrentAddress
            }}
        >
            {props.children}
        </Context.Provider>
    );
}

export default AuthProvider;

