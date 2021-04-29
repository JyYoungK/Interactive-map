import React, { useState, useEffect, Component } from 'react';
import { MapContainer, GeoJSON,} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import "./MyMap.css";
import './pages.css';
import { useGlobalState } from "../global-context";
import Modal from 'react-modal';
import { features } from "../data/countries.json";
import ListTags from './ListTags'
import {library} from '@fortawesome/fontawesome-svg-core';
import {faTrash} from '@fortawesome/free-solid-svg-icons';

library.add(faTrash);

const Map = () => {
  const { myMapTitle, setCountryData, changeColor, setChangeColor, coloredMap, setColoredMap, countryText, setCountryText, inputTag, setInputTag, inputTagData, setInputTagData, inputTagValue, setInputTagValue, countryEvent, setCountryEvent, myImage, setMyImage } = useGlobalState();
  const [countryModalIsOpen, setCountryModalIsOpen] = useState(false);
  const [countryModal2IsOpen, setCountryModal2IsOpen] = useState(false);
  const [countryTagValues, setCountryTagValues] = useState([]);
  const [countryName, setCountryName] = useState("");
  const [preview, setPreview] = useState()
  const [Samplestate, setSampleState] = useState([])


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

    // inputTagData.map((localState) =>(
    //   console.log("show me smth " + localState.data)
    // ))
      console.log("Selected country: " + event.target.feature.properties.ADMIN)
      console.log("country tag values: ")

      console.log(event.target.feature.properties)
      console.log(preview)

      setCountryName(event.target.feature.properties.ADMIN)
      setCountryEvent(event);     
      if (event.target.feature.properties.tagLength > 0){
        console.log("Opening a modal with data")
        setCountryModal2IsOpen(true);
        countryValues(event);
      } 
      else {
        console.log("Opening a fresh modal")
        setCountryModalIsOpen(true);
      }     
  } ;

  function countryValues(event){
    if (event.target.feature.properties.tagLength === 1){
      setCountryTagValues([event.target.feature.properties.tag1value])
    }
    else if (event.target.feature.properties.tagLength === 2){
      setCountryTagValues([event.target.feature.properties.tag1value, event.target.feature.properties.tag2value])
    }
    else if (event.target.feature.properties.tagLength === 3){
      setCountryTagValues([event.target.feature.properties.tag1value, event.target.feature.properties.tag2value, event.target.feature.properties.tag3value])
    }
  }

  function storeCountryData () {
    // Old version
    // setCountryData(countryData.filter(item => item.ISO !== countryEvent.target.feature.properties.ISO_A3)); //Removes the countryData with matching ISO
    
    // setCountryData([... countryData , { //Adds new ISO countryData
    //   ISO: countryEvent.target.feature.properties.ISO_A3,
    // }]);   
    // console.log("Successfully loaded " + myImage.name)
    // console.log(inputTagValue.length + " length value")
    // const countries = [];
    // for (let i = 0; i < features.length; i++) {
    //   const country = features[i];
    //   if (country.properties.ISO_A3 === countryEvent.target.feature.properties.ISO_A3){
    //     // country.properties.countryText = " : " + countryText;\        
    //     country.properties.countryText = " : Data Available";
    //     country.properties.color = changeColor;
    //     country.properties.tagLength = inputTagData.length
    //   }
    //   countries.push(country)
    // }
    // setColoredMap(countries);
    if (inputTagData.length === 0){
      const countries = [];
      for (let i = 0; i < features.length; i++) {
        const country = features[i];
        if (country.properties.ISO_A3 === countryEvent.target.feature.properties.ISO_A3){
          // country.properties.countryText = " : " + countryText;\        
          country.properties.countryText = " : Data Available";
          country.properties.color = changeColor;
          country.properties.tagLength = 0;
          country.properties.image = myImage;
        }
        countries.push(country)
      }
      setColoredMap(countries);

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
            id : countryEvent.target.feature.properties.ADMIN,
            arrayIndex : countryEvent.target.feature.properties.arrayIndex,
            countryText : countryText,
            tagLength: 0,
            image : myImage, 
          });
        });
    }

    if (inputTagData.length === 1){
      const countries = [];
      for (let i = 0; i < features.length; i++) {
        const country = features[i];
        if (country.properties.ISO_A3 === countryEvent.target.feature.properties.ISO_A3){
          // country.properties.countryText = " : " + countryText;\        
          country.properties.countryText = " : Data Available";
          country.properties.color = changeColor;
          country.properties.tagLength = 1;
          country.properties.image = myImage;
          country.properties.tag1name = inputTagValue[0].tagName;
          country.properties.tag1value = inputTagValue[0].data;
        }
        countries.push(country)
      }
      setColoredMap(countries);

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
          id : countryEvent.target.feature.properties.ADMIN,
          arrayIndex : countryEvent.target.feature.properties.arrayIndex,
          countryText : countryText,
          tagLength: 1,
          tag1name: inputTagValue[0].tagName,
          tag1value: inputTagValue[0].data,  
          tag2name: inputTagValue[0].tagName,
          tag2value: inputTagValue[0].data,  
          tag3name: inputTagValue[0].tagName,
          tag3value: inputTagValue[0].data,  
          image : myImage,   
        });
      });
    }
    if (inputTagData.length === 2){
      const countries = [];
      for (let i = 0; i < features.length; i++) {
        const country = features[i];
        if (country.properties.ISO_A3 === countryEvent.target.feature.properties.ISO_A3){
          // country.properties.countryText = " : " + countryText;\        
          country.properties.countryText = " : Data Available";
          country.properties.color = changeColor;
          country.properties.tagLength = 2;
          country.properties.image = myImage;
          country.properties.tag1name = inputTagValue[0].tagName;
          country.properties.tag1value = inputTagValue[0].data;        
          country.properties.tag2name = inputTagValue[1].tagName;
          country.properties.tag2value = inputTagValue[1].data;   
        }
        countries.push(country)
      }
      setColoredMap(countries);

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
          id : countryEvent.target.feature.properties.ADMIN,
          arrayIndex : countryEvent.target.feature.properties.arrayIndex,
          countryText : countryText,
          tagLength: 2,
          tag1name: inputTagValue[0].tagName,
          tag1value: inputTagValue[0].data,  
          tag2name: inputTagValue[1].tagName,
          tag2value: inputTagValue[1].data,  
          tag3name: inputTagValue[1].tagName,
          tag3value: inputTagValue[1].data,  
          image : myImage,  
        });
      });
    }   
    if (inputTagData.length === 3){
      const countries = [];
      for (let i = 0; i < features.length; i++) {
        const country = features[i];
        if (country.properties.ISO_A3 === countryEvent.target.feature.properties.ISO_A3){
          // country.properties.countryText = " : " + countryText;\        
          country.properties.countryText = " : Data Available";
          country.properties.color = changeColor;
          country.properties.tagLength = 3;
          country.properties.image = myImage;
          country.properties.tag1name = inputTagValue[0].tagName;
          country.properties.tag1value = inputTagValue[0].data;        
          country.properties.tag2name = inputTagValue[1].tagName;
          country.properties.tag2value = inputTagValue[1].data;   
          country.properties.tag3name = inputTagValue[2].tagName;
          country.properties.tag3value = inputTagValue[2].data;   
        }        
        countries.push(country)
      }
      setColoredMap(countries);

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
            id : countryEvent.target.feature.properties.ADMIN,
            arrayIndex : countryEvent.target.feature.properties.arrayIndex,
            countryText : countryText,
            tagLength: 3,
            tag1name: inputTagValue[0].tagName,
            tag1value: inputTagValue[0].data,  
            tag2name: inputTagValue[1].tagName,
            tag2value: inputTagValue[1].data,  
            tag3name: inputTagValue[2].tagName,
            tag3value: inputTagValue[2].data,  
            image : myImage,    
          });
      });
    }
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
        country.properties.tagLength = 0;
      }
      countries.push(country)
    }
    setColoredMap(countries);
  }

  function saveCountryData () {
    
      // if (inputTagValue.length !== inputTagData.length){
      //   alert("Please fill all the values!")
      // }
      // else{
        storeCountryData();
        setCountryModalIsOpen(false);
        setInputTagValue([]);//Reset so it doesn't add up     
        setCountryTagValues([]);//Reset so it doesn't add up
      // }
  }

  function removeCountryData () {
    eraseCountryData();
    setCountryModalIsOpen(false);
    setCountryModal2IsOpen(false);
    setInputTagValue([]);//Reset so it doesn't add up
    setCountryTagValues([]);//Reset so it doesn't add up
  }

  function closeComparison(){
    setCountryModalIsOpen(false)
    setCountryModal2IsOpen(false)
    setInputTagValue([]);//Reset so it doesn't add up
    setCountryTagValues([]);//Reset so it doesn't add up
  }

  function addTag(e){
    e.preventDefault();
    if (!(inputTagData.filter(tagData => tagData.data === inputTag).length > 0)){ //Checks if its not duplicate
      if (inputTagData.length < 3){
        setInputTagData([... inputTagData, {
          data: inputTag,
          length: inputTagData.length
        }]);  
      }
      else{
        alert("You have exceeded the max number of tags!")
      }
    }
    else{
      alert("Same tag already exists!")
    }
  }

  const toInputUppercase = e => {
    e.target.value = ("" + e.target.value).toUpperCase();
  }

  function tagHandler(tag, value) {
    setInputTagValue([... inputTagValue, {
      tagName: tag,
      data: value,
    }]);  
  }

  //File Image Display
  useEffect(() => {
    if (!myImage) {
        setPreview(undefined)
        return
    }

    const objectUrl = URL.createObjectURL(myImage)
    setPreview(objectUrl)

    // free memory when ever this component is unmounted
    return () => URL.revokeObjectURL(objectUrl)
}, [myImage])

  const onSelectFile = e => {

    setMyImage(e.target.files[0])
  }

 
  return (
    <div>
          <form className="tag-area">
              <input type="text" placeholder= "Enter a tag" className="addTagInput" onBlur={event => setInputTag(event.target.value)} onInput={toInputUppercase}/>
              <button type="submit" className="addTagButton" onClick = {addTag}> Add </button>
              <ListTags/>
          </form>

          <h1 style ={{textAlign: "center"}}> {myMapTitle} </h1>
          <MapContainer style = {{height: "80vh", zIndex : 1}} doubleClickZoom={false} zoom = {2} minZoom = {2} center = {[50, 13]}>{/* Displays the zoom button*/}
              {/* Displays the map */}
              <GeoJSON key={JSON.stringify(coloredMap, countryText)} style = {countryStyle} onEachFeature = {onEachCountry} data = {coloredMap} /> 
          </MapContainer>
          {/**************************************************************************** 1st Modal ****************************************************************************/}
          <Modal isOpen={countryModalIsOpen} //Modal open depends on setModal
                        ariaHideApp={false} //Hides annoying error
                        onRequestClose={() => closeComparison} //Closes the modal if clicked outside of modal or esc
                        style={ modalStyle }
                        >
                            <div className="saveContents">
                                <h2>Add information to {countryName} </h2>
                                <br></br>
                                <div> Select a color to this country <input type = "color" value = {changeColor} onChange={e => setChangeColor(e.target.value)}/>  </div>
                                <br></br>
                                {/* <input type="file" onChange={e => setMyImage(e.target.files[0])} accept="image/x-png,image/gif,image/jpeg"/> */}
                                <div>
                                    <input type='file' onChange={onSelectFile} accept="image/x-png,image/gif,image/jpeg"/>
                                    <br></br>
                                    {myImage &&  <img src={preview} height = "250" width = "320" /> }
                                </div>
                                <br></br>
                                <form onSubmit = {saveCountryData}>
                                  <div>
                                      { inputTagData.map((localState) =>(
                                          <div>
                                              <div className="tagData2"> {localState.data} </div>
                                              <div className="tagValue"> : <input type="text" style={{width: "10vw"}} onBlur={e => tagHandler(localState.data, e.target.value) } required/> </div>
                                          </div>
                                      )) }
                                  </div>
    
                                  <div className="saveButtons">
                                      <button type="submit" className="saveButtons"> Save </button> 
                                      <button className="saveButtons" onClick= {removeCountryData}> Remove </button>  
                                      <button className="saveButtons" onClick = {closeComparison}> Close </button>
                                  </div>
                                </form>
                            </div>
          </Modal>
          {/**************************************************************************** 1st Modal ****************************************************************************/}

          {/**************************************************************************** 2nd Modal ****************************************************************************/}
          <Modal isOpen={countryModal2IsOpen} //Modal open depends on setModal
                        ariaHideApp={false} //Hides annoying error
                        onRequestClose={() => closeComparison} //Closes the modal if clicked outside of modal or esc
                        style={ modalStyle }
                        >
                            <div className="saveContents">
                                <h2>Change information to the map </h2>
                                <br></br>
                                <div> Select a color to this country <input type = "color" value = {changeColor} onChange={e => setChangeColor(e.target.value)}/>  </div>
                                <br></br>
                                {/* <input type="file" onChange={e => setMyImage(e.target.files[0])} accept="image/x-png,image/gif,image/jpeg"/> */}
                                <div>
                                    <input type='file' onChange={onSelectFile} accept="image/x-png,image/gif,image/jpeg"/>
                                    {myImage &&  <img src={preview} /> }
                                </div>                                
                                <br></br>
                                        
                                <form onSubmit = {saveCountryData}>
                                  <div>
                                    { inputTagData.map((localState) =>(
                                        <div>
                                            <div className="tagData2"> {localState.data} </div>
                                            <div className="tagValue"> : <input type="text" placeholder = {countryTagValues[localState.length]} style={{width: "10vw"}} onBlur={e => tagHandler(localState.data, e.target.value) } required/> </div>
                                        </div>
                                    )) }
                                  </div>
  
                                  <div className="saveButtons">
                                      <button type="submit" className="saveButtons"> Save </button> 
                                      <button className="saveButtons" onClick= {removeCountryData}> Remove </button>  
                                      <button className="saveButtons" onClick = {closeComparison}> Close </button>
                                  </div>
                                </form>
                            </div>
          </Modal>
          {/**************************************************************************** 2nd Modal ****************************************************************************/}
    </div> 
  );
}

export default Map;
