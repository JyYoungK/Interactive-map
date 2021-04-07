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
    const [tag1, settag1] = useState([]);
    const [tag2, settag2] = useState([]);
    const [tag3, settag3] = useState([]);
    const [tag1value, settag1value] = useState([]);
    const [tag2value, settag2value] = useState([]);
    const [tag3value, settag3value] = useState([]);
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
        countryText, setCountryText,
        countryEvent, setCountryEvent,
        inputTag, setInputTag, 
        inputTagData, setInputTagData,
        tag1, settag1,
        tag2, settag2,
        tag3, settag3,
        tag1value, settag1value,
        tag2value, settag2value,
        tag3value, settag3value,
        myImage, setMyImage
  };
  return <AuthContext.Provider value= {authContextValue} {...props}/>
};

const useGlobalState = () => React.useContext(AuthContext);

export {AuthProvider, useGlobalState};