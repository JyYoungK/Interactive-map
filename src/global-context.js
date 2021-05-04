import React, {createContext, useState} from 'react';

const AuthContext = createContext({}) 

const AuthProvider = (props) => {
    const [user, setUser] = useState('');
    const [mapTitle, setMapTitle] = useState([]);
    const [myMapTitle, setMyMapTitle] = useState("");
    const [countryText, setCountryText] = useState("");
    const [countryData, setCountryData] = useState([]);
    const [coloredMap, setColoredMap] = useState([]);
    const [inputTag, setInputTag] = useState([]);
    const [inputTagData, setInputTagData] = useState([]);
    const [inputTagValue, setInputTagValue] = useState([]);
    const [changeColor, setChangeColor] = useState("#ffff00");
    const [countryColor, setCountryColor] = useState("");
    const [countryEvent, setCountryEvent] = useState([]);
    const [myImage, setMyImage] = useState(null);
    const [imageofcountries, setimageofcountries] = useState([]);

    const authContextValue = {
        user, setUser,
        mapTitle, setMapTitle,
        myMapTitle, setMyMapTitle,
        countryData, setCountryData,
        changeColor, setChangeColor,
        countryColor, setCountryColor,
        coloredMap, setColoredMap,
        countryText, setCountryText,
        countryEvent, setCountryEvent,
        inputTag, setInputTag, 
        inputTagData, setInputTagData,
        inputTagValue, setInputTagValue,
        myImage, setMyImage,
        imageofcountries, setimageofcountries,
  };
  return <AuthContext.Provider value= {authContextValue} {...props}/>
};

const useGlobalState = () => React.useContext(AuthContext);

export {AuthProvider, useGlobalState};