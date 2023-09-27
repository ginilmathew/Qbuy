import React, { useState, useEffect } from "react";
import Context from "./index";
import { mode } from "../../config/constants";

const PandaProvider = (props) => {
    const [greenPanda, setGreenPanda] = useState(false);
    const [pinkPanda, setPinkPanda] = useState(false);
    const [active, setActive] = useState(mode)

    const [color, setColor] = useState([ '#7BE495', '#329D9C']);
    const [logo, setLogo] = useState(require('../../Images/home.png'));


    return (
        <Context.Provider
            value={{
                ...props,
                greenPanda,
                pinkPanda,
                color,
                logo,
                active, 
                setLogo,
                setColor,
                setGreenPanda,
                setPinkPanda,
                setActive
            }}
        >
            {props.children}
        </Context.Provider>
    );
}

export default PandaProvider;

