import React, {createContext, useState} from 'react';

const AuthContext = createContext({}) 

const AuthProvider = (props) => {
    const [user, setUser] = useState('');
    const [mapTitle, setMapTitle] = useState([]);
    const [myMapTitle, setMyMapTitle] = useState("");
    const [countryText, setCountryText] = useState("");
    const [countryData, setCountryData] = useState([]);
    const [coloredMap, setColoredMap] = useState([]);
    const [population, setPopulation] = useState([]);
    const [birthrate, setBirthRate] = useState([]);
    const [deathrate, setDeathRate] = useState([]);
    const [changeColor, setChangeColor] = useState("#ffff00");
    const [countryColor, setCountryColor] = useState("");
    const [countryEvent, setCountryEvent] = useState([]);
    const [myImage, setMyImage] = useState(null);

    const authContextValue = {
        user, setUser,
        mapTitle, setMapTitle,
        myMapTitle, setMyMapTitle,
        countryData, setCountryData,
        changeColor, setChangeColor,
        countryColor, setCountryColor,
        coloredMap, setColoredMap,
        population, setPopulation,
        birthrate, setBirthRate,
        deathrate, setDeathRate,
        countryText, setCountryText,
        countryEvent, setCountryEvent,
        myImage, setMyImage
  };
  return <AuthContext.Provider value= {authContextValue} {...props}/>
};

const useGlobalState = () => React.useContext(AuthContext);

export {AuthProvider, useGlobalState};