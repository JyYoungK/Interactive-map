import React, { useState, useEffect } from 'react';
import { MapContainer, GeoJSON,} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import "./MyMap.css";
import './pages.css';
import { useGlobalState } from "../global-context";
import Modal from 'react-modal';
import { features } from "../data/countries.json";

const Map = () => {
  const { myMapTitle, setCountryData, changeColor, setChangeColor, coloredMap, setColoredMap, countryText, setCountryText, countryEvent, setCountryEvent, myImage } = useGlobalState();
  const [countryModalIsOpen, setCountryModalIsOpen] = useState(false);
  const modalStyle = {
    overlay: {
        zIndex: 10,
    },
    content: {
        position: 'absolute',
        top: '25%',
        left: '30%',
        right: '30%',
        bottom: '25%',
        border: '1px solid #ccc',
        backgroundColor: 'white',
        overflow: 'auto',
        WebkitOverflowScrolling: 'touch',
        borderRadius: '4px',
        outline: 'none',
        padding: '20px',
        zIndex: 10,
    }
  };

  useEffect(() => { //the point is to fire off a side effect that should fire after a state value changes (since it depends on that state value).
    setColoredMap(coloredMap)}, [])

  const countryStyle = {
      fillColor: "green", //country color
      color: "black", // border color
      fillOpacity: 1,
      weight: 2, // border thickness
      dashArray: 1, // if you want to make border into dashed line
      zIndex: 1,
  }

  const onEachCountry = (country, layer) => {
    layer.options.fillColor = country.properties.color;
    const countryName = country.properties.ADMIN;
    const countryText = country.properties.countryText;
    layer.bindPopup(countryName + " " + countryText);
    // layer.options.fillOpacity = 0.2; // number can go from 0-9
    // If you want to make countries have different colors use below-------------------------
    // const colorIndex = Math.floor(Math.random() * this.color.length);
    // layer.options.fillColor = this.color[colorIndex]; // number can go from 0-9
    layer.on({ //Clickable function
          click: setEvent
    })
    layer.on('mouseover', function() { layer.openPopup(); }); //Show country names
    layer.on('mouseout', function() { layer.closePopup(); });
  }

  const setEvent = (event)=> { 
    setCountryModalIsOpen(true);
    setCountryEvent(event)  
  } ;

  function storeCountryData () {
    // Old version
    // setCountryData(countryData.filter(item => item.ISO !== countryEvent.target.feature.properties.ISO_A3)); //Removes the countryData with matching ISO
    
    // setCountryData([... countryData , { //Adds new ISO countryData
    //   ISO: countryEvent.target.feature.properties.ISO_A3,
    // }]);   
    
    setCountryData((prevCountryData) => {
      return prevCountryData
        .filter(
          //Removes the countryData with matching ISO
          (item) => item.ISO !== countryEvent.target.feature.properties.ISO_A3
        )
        .concat({
          //Adds new ISO countryData
          ISO: countryEvent.target.feature.properties.ISO_A3,
          color: changeColor,
          name : countryEvent.target.feature.properties.ADMIN,
          arrayIndex : countryEvent.target.feature.properties.arrayIndex,
          countryText : countryText,   
          // image : myImage,     
        });
    });

    const countries = [];
    for (let i = 0; i < features.length; i++) {
      const country = features[i];
      if (country.properties.ISO_A3 === countryEvent.target.feature.properties.ISO_A3){
        country.properties.countryText = " : " + countryText;
        country.properties.color = changeColor;
      }
      countries.push(country)
    }
    setColoredMap(countries);
  }

  function eraseCountryData () {
    countryEvent.target.setStyle({ //Adds color data to be visualized in frontend
        fillColor: "green", //country color
        color: "black", // border color
        fillOpacity: 0.5,
        weight: 2, // border thickness
        dashArray: 1, // if you want to make border into dashed line
        zIndex: 1,
    })
    
    setCountryData((prevCountryData) => {
      return prevCountryData
        .filter(
          //Removes the countryData with matching ISO
          (item) => item.ISO !== countryEvent.target.feature.properties.ISO_A3
        )
    });

    const countries = [];
    for (let i = 0; i < features.length; i++) {
      const country = features[i];
      if (country.properties.ISO_A3 === countryEvent.target.feature.properties.ISO_A3){
        country.properties.color = "green";
        country.properties.countryText = ": No data available";
      }
      countries.push(country)
    }
    setColoredMap(countries);
  }

  function saveCountryData () {
    storeCountryData();
    setCountryModalIsOpen(false);
  }

  function removeCountryData () {
    eraseCountryData();
    setCountryModalIsOpen(false);
  }

 
  return (
    <div>
          <h1 style ={{textAlign: "center"}}> {myMapTitle} </h1>
          <MapContainer style = {{height: "80vh", zIndex : 1}} doubleClickZoom={false} zoom = {2} minZoom = {2} center = {[50, 13]}>{/* Displays the zoom button*/}
              <GeoJSON key={JSON.stringify(coloredMap, countryText)} style = {countryStyle} onEachFeature={onEachCountry} data = {coloredMap} />{/*Displays the map */}
          </MapContainer>
          <Modal isOpen={countryModalIsOpen} //Modal open depends on setModal
                        ariaHideApp={false} //Hides annoying error
                        onRequestClose={() => setCountryModalIsOpen(false)} //Closes the modal if clicked outside of modal or esc
                        style={ modalStyle }
                        >
                            <div className="saveContents">
                                <h2>Add information to the map </h2>
                                <br></br>
                                {" Select a color to this country "} 
                                <input type = "color" value = {changeColor} 
                                onChange={e => setChangeColor(e.target.value)}
                                ></input> 
                                {/* <br></br>
                                {" Upload an image "} 
                                <input type="file" /> */}
                                <br></br>
                                <input type="text" placeholder= "Add information here" style={{marginTop: "5%", height: "200%"}} onBlur={event => setCountryText(event.target.value)}/>
                                <div className="saveButtons">
                                    <button className="saveButtons" onClick = {saveCountryData}> Save </button> 
                                    <button className="saveButtons" onClick= {removeCountryData}> Remove </button>  
                                    <button className="saveButtons" onClick = {() => setCountryModalIsOpen(false)}> Close </button>
                                </div>
                            </div>
          </Modal>
    </div> 
  );
}

export default Map;
