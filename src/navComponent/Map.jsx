import React, { useState, useEffect, Component } from 'react';
import { MapContainer, GeoJSON,} from "react-leaflet";
// import {Icon} from 'react-native-elements';
// import TagInput from 'react-native-tags-input';
import "leaflet/dist/leaflet.css";
import "./MyMap.css";
import './pages.css';
import { useGlobalState } from "../global-context";
import Modal from 'react-modal';
import { features } from "../data/countries.json";
import ListItems from './ListTags'


const Map = () => {
  const { myMapTitle, setCountryData, changeColor, setChangeColor, coloredMap, setColoredMap, countryText, setCountryText,countryEvent, inputTag, setInputTag, inputTagData, setInputTagData, tag1, settag1, tag2, settag2, tag3, settag3, tag1value, settag1value, tag2value, settag2value, tag3value, settag3value, setCountryEvent, myImage } = useGlobalState();
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
          //Adds new ISO countryData //(Change here if you add more data)--------------------------------------------------------
          ISO: countryEvent.target.feature.properties.ISO_A3,
          color: changeColor,
          tag1name: tag1,
          tag2name: tag2,
          tag3name: tag3,
          tag1value: tag1value,
          tag2value: tag2value,
          tag3value: tag3value,
          id : countryEvent.target.feature.properties.ADMIN,
          arrayIndex : countryEvent.target.feature.properties.arrayIndex,
          countryText : countryText,   
          // image : myImage,     
        });
    });

    const countries = [];
    for (let i = 0; i < features.length; i++) {
      const country = features[i];
      if (country.properties.ISO_A3 === countryEvent.target.feature.properties.ISO_A3){
        // country.properties.countryText = " : " + countryText;\        
        country.properties.countryText = " : Data Available";
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

  function addTag(e){
    e.preventDefault();
    // setCountryData(countryData.filter(item => item.ISO !== countryEvent.target.feature.properties.ISO_A3)); //Removes the countryData with matching ISO
    setInputTagData([... inputTagData , { //Adds new ISO countryData
      data: inputTag,
    }]);  
    console.log(inputTagData);
  }

 

  return (
    <div>
          <form className="tag-area">
              <input type="text" placeholder= "Enter a tag" className="addTagInput" onBlur={event => setInputTag(event.target.value)}/>
              <button type="submit" className="addTagButton" onClick = {addTag}> Add </button>
              <ListItems/>
          </form>

          <h1 style ={{textAlign: "center"}}> {myMapTitle} </h1>
          <MapContainer style = {{height: "80vh", zIndex : 1}} doubleClickZoom={false} zoom = {2} minZoom = {2} center = {[50, 13]}>{/* Displays the zoom button*/}
              {/* Displays the map */}
              <GeoJSON key={JSON.stringify(coloredMap, countryText)} style = {countryStyle} onEachFeature={onEachCountry} data = {coloredMap} /> 
          </MapContainer>
          <Modal isOpen={countryModalIsOpen} //Modal open depends on setModal
                        ariaHideApp={false} //Hides annoying error
                        onRequestClose={() => setCountryModalIsOpen(false)} //Closes the modal if clicked outside of modal or esc
                        style={ modalStyle }
                        >
                            <div className="saveContents">
                                <h2>Add information to the map </h2>
                                <br></br>
                                <div> Select a color to this country <input type = "color" value = {changeColor} onChange={e => setChangeColor(e.target.value)}/>  </div>
                                {/* <br></br>
                                {" Upload an image "} 
                                <input type="file" /> */}
                                <br></br>
                                <div> 
                                  <input type="text" placeholder= "Enter a tag" style={{marginTop: "5%", width:"40%",height: "200%"}} onBlur={event => settag1(event.target.value)}/>
                                  <input type="number" placeholder= {tag1 + " value"} style={{marginLeft: "5%"}} onBlur={event => settag1value(event.target.value)}/>
                                </div>
                                <br></br>
                                <div> 
                                  <input type="text" placeholder= "Enter a tag" style={{marginTop: "5%", width:"40%",height: "200%"}} onBlur={event => settag2(event.target.value)}/>
                                  <input type="number" placeholder= {tag2 + " value"} style={{marginLeft: "5%"}} onBlur={event => settag2value(event.target.value)}/>
                                </div>
                                <br></br>
                                <div> 
                                  <input type="text" placeholder= "Enter a tag" style={{marginTop: "5%", width:"40%",height: "200%"}} onBlur={event => settag3(event.target.value)}/>
                                  <input type="number" placeholder= {tag3 + " value"} style={{marginLeft: "5%"}} onBlur={event => settag3value(event.target.value)}/>
                                </div>
                                <br></br>
                                {/* <div> Birth Rate <input type="number" placeholder= "Birth Rate" min="1" max="10000" onBlur={event => setBirthRate(event.target.value)}/></div>
                                <br></br>
                                <div> Death Rate <input type="number" placeholder= "Death Rate" min="1" max="10000" onBlur={event => setDeathRate(event.target.value)}/> </div>
                                <br></br> */}
                                <input type="text" placeholder= "Add additional information here" style={{marginTop: "5%", height: "200%"}} onBlur={event => setCountryText(event.target.value)}/>
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
