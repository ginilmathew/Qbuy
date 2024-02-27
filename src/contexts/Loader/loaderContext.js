import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useState, useEffect } from "react";
import Context from "./index";
import LoadingModal from "../../Components/LoadingModal";

const LoadProvider = (props) => {
    const [loading, setLoading] = useState(false);
    return (
        <Context.Provider
            value={{
                ...props,
                loading,
                setLoading
            }}
        >
            {props.children}
            <LoadingModal isVisible={loading} />
        </Context.Provider>
    );
}

export default LoadProvider;

