import React, { useState, useEffect} from 'react';
import fire from './config/fire'
import "./App.css";
import Login from './Login';
import Home from './Home';
import firebase from 'firebase';
import { useGlobalState } from "./global-context";
import { features } from "./data/countries.json";
import {storage} from './config/fire';


export default function App (){
  const { user, setUser, mapTitle, setMapTitle, countryData, setColoredMap, setCountryData} = useGlobalState();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [hasAccount, setHasAccount] = useState(false);
  var database = firebase.database();
  const countries = [];

  const clearInputs = () => {
    setEmail('');
    setPassword('');
  }

  const clearErrors = () => {
    setEmailError('');
    setPasswordError('');
  }

  const handleLogin = () => {
    clearErrors();
    fire
      .auth()
      .signInWithEmailAndPassword(email,password)
      .catch((err) => {
        switch(err.code){
          case "auth/invalid-email":
          case "auth/user-disabled":
          case "auth/user-not-found":
            setEmailError(err.message);
            break;
          case "auth/wrong-password":
            setPasswordError(err.message);
            break;
        }
      });
    };

  const handleSignUp = () => {
    clearErrors();
    fire
      .auth()
      .createUserWithEmailAndPassword(email,password)
      .catch((err) => {
        switch(err.code){
          case "auth/email-already-in-use":
          case "auth/invalid-email":
            setEmailError(err.message);
            break;
          case "auth/weak-password":
            setPasswordError(err.message);
            break;
        }
      });
    };

  const handleLogout = () => {
    fire.auth().signOut();
  };

  const save = () => {
    console.log("Successfully saved "+ mapTitle +" under " + user.uid);
    var usersRef = database.ref("users");
    var userExists = database.ref("users/User:" + user.uid + "/" + mapTitle);

    userExists.once("value")
    .then(function(userinDB){
        for (var i = 0; i < (countryData.length); i++) {
          // storage.ref("users/User:" + user.uid + "/" + mapTitle + "/Images" + i).put(countryData[i].image);

          if (userinDB.exists()){ //if a map exists under a username 
            //1. Choose to update (Change here if you add more data)--------------------------------------------------------
            firebase.database().ref("users/User:" + user.uid + '/' + mapTitle + '/Obj' + i).update({
              CountryISO: countryData[i].ISO,
              CountryColor: countryData[i].color,
              ArrayIndex : countryData[i].arrayIndex,
              CountryText : countryData[i].countryText,
              Population: countryData[i].population,
              BirthRate: countryData[i].birthrate,
              DeathRate: countryData[i].deathrate,
              Name: countryData[i].id,
            });
          }
          else{ //Create a new map under a username (Change here if you add more data)--------------------------------------------------------
            usersRef.child("User:" + user.uid).child(mapTitle + '/Obj' + i).update({
              CountryISO: countryData[i].ISO,
              CountryColor: countryData[i].color,
              ArrayIndex : countryData[i].arrayIndex,
              CountryText : countryData[i].countryText,
              Population: countryData[i].population,
              BirthRate: countryData[i].birthrate,
              DeathRate: countryData[i].deathrate,
              Name: countryData[i].id,
            });
          }
        }
    });
  }

  useEffect(() => {
    const load = () => {
      for (let i = 0; i < features.length; i++) {
        const country = features[i];
        country.properties.countryText = ": No data available";
        country.properties.arrayIndex = i;
        if(country.properties.color === undefined){
          country.properties.color = "green";
        }
        countries.push(country)
      }
      setColoredMap(countries); 
    }
    load();
  }, []);

  const preload = () => {
    setMapTitle([]); //Resets so that it doesn't add up.
    var Dataref = database.ref("users/User:" + user.uid);
    let toAdd = []
    Dataref.on("value", function(objData) {
      objData.forEach((function(child) { //never put setState inside a loop. Also this is same function as
        toAdd.push(child.key)     
      }))
      console.log("Loading all the maps ... " + toAdd);
      setMapTitle(prevMapTitles => [...prevMapTitles, ...toAdd]) //I learned to never put setState inside a loop.
      // setMapTitle([... mapTitle , { //Adds new ISO countryData
      //   Title: toAdd,
      // }]);  
    });
  }

  const load = (e) => {
    var Dataref = database.ref("users/User:" + user.uid + "/" + mapTitle[e]);
    
    Dataref.on("value", function(objData) {

       let cData = [];
       console.log("Loading a selected map called " + mapTitle[e] + "...");
       objData.forEach(child =>{ //this but older style.
         cData.push(child.val());

         setCountryData((prevCountryData) => { //(Change here if you add more data)--------------------------------------------------------
            return prevCountryData
              .concat({
                arrayIndex : child.val().ArrayIndex,
                color: child.val().CountryColor,
                ISO: child.val().CountryISO,
                countryText : child.val().CountryText,  
                id : child.val().Name,
                population: child.val().Population,
                birthrate: child.val().BirthRate,
                deathrate: child.val().DeathRate, 
              });
         });

         console.log(child.val().Name + " has following properties. " + "Array Index: " + child.val().ArrayIndex + ", ISO: " + child.val().CountryISO + ", Color: " + child.val().CountryColor + ", Text: " + child.val().CountryText);     
   
         for (let i = 0; i < features.length; i++) {
            const country = features[i];
            country.properties.color = "green";
    
            for (let j = 0; j < cData.length; j++){
              if (country.properties.ISO_A3 === cData[j].CountryISO){
                country.properties.color = cData[j].CountryColor;
                country.properties.countryText = ": " + cData[j].CountryText;
              }
            }
            countries.push(country)
         }
         setColoredMap(countries);  
       });
    });
  }

  const remove = (removeTitle) => {
    database.ref("users/User:" + user.uid + "/" + removeTitle).remove();
    console.log("Successfully removed " + removeTitle + "!")
    alert("Your map " + removeTitle + " now has been removed.")
  }

  const authListener = () => {
    fire.auth().onAuthStateChanged((user) => {
        if (user) {
          clearInputs();
          setUser(user);
        }
        else {
          setUser("");
        }
    });
  };
 
  useEffect(() => {
    authListener();
  }, []);

  return (
    <div className="App">
      {user ? (
        <Home handleLogout={handleLogout} save={save} preload = {preload} load={load} remove={remove}/>
      ) : (
        <Login 
          email={email} 
          setEmail={setEmail} 
          password={password} 
          setPassword={setPassword} 
          handleLogin={handleLogin}
          handleSignUp={handleSignUp}
          hasAccount={hasAccount}
          setHasAccount={setHasAccount}
          emailError={emailError}
          passwordError={passwordError}
        />
      )}

    </div>
  );
}

