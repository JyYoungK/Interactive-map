import React, {useState} from "react";
import './navComponent/pages.css';
import './Modal.css';
import { useGlobalState } from "./global-context";
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom';
import LoadMap from './navComponent/LoadMap';
import Share from './navComponent/Share';
import Modal from 'react-modal';
import { Form } from 'semantic-ui-react';
import { DataGrid } from '@material-ui/data-grid';

// import {storage} from './config/fire';

const columns = [];
  
const Home = (props) => {
    const [map, setMap] = useState('Map1');
    const [listofcountries, setlistofcountries] = useState([]);
    const [dataofcountries, setdataofcountries] = useState([]);
    const {mapTitle, setMapTitle, setMyMapTitle, countryData, imageofcountries, inputTagData} = useGlobalState();
    const {handleLogout, save, preload, load, remove } = props;
    const [saveModalIsOpen, setSaveModalIsOpen] = useState(false);
    const [LoadModalIsOpen, setLoadModalIsOpen] = useState(false);
    const [CompareModalIsOpen, setCompareModalIsOpen] = useState(false);
    const [SummarizeModalIsOpen, setSummarizeModalIsOpen] = useState(false);
    const modalStyle = {
        overlay: {
            zIndex: 10,
        },
        content: {
            position: 'absolute',
            top: '35%',
            left: '40%',
            right: '40%',
            bottom: '35%',
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
    const modalStyle2 = {
        overlay: {
            zIndex: 10,
        },
        content: {
            position: 'absolute',
            top: '15%',
            left: '15%',
            right: '15%',
            bottom: '15%',
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

    function moreThanOneCountry(){ //Save
        if (countryData.length >= 1 && inputTagData.length>0) {
            setSaveModalIsOpen(true);
        }
        else if(inputTagData.length===0){
            alert("Please include at least one tag and fill the value!")
        } 
        else{
            alert("Please select at least 1 country!")
        }
    }

    function saved(){
        setSaveModalIsOpen(false);
        save();
    }

    function loadCountry(){ //Load
        setLoadModalIsOpen(true);
        preload();
    }

    function moreThanTwoCountries(){ //Compare
        if (countryData.length >= 2 ) {
            console.log("Comparison Opened. These are the available country data: ");
            console.log(countryData)
            
            for (var i = 0; i < countryData.length - 2; i++) {
                listofcountries.push(countryData[i].id + ", ")
            }
            listofcountries.push(countryData[countryData.length-2].id + " and ")
            listofcountries.push(countryData[countryData.length-1].id)

            //Columns
            columns.push({field: 'id', headerName: 'COUNTRY', width: 150})
            columns.push({field: 'tag1value', headerName: countryData[0].tag1name, width: 160})
            if (countryData[0].tagLength >= 2){
                columns.push({field: 'tag2value', headerName: countryData[0].tag2name, width: 160})
            }
            if (countryData[0].tagLength === 3){
                columns.push({field: 'tag3value', headerName: countryData[0].tag3name, width: 160})
            }

            setCompareModalIsOpen(true);
            //setlistofcountries([]); //Resets so that it doesn't add up.
        }
        else{
            alert("Please select at least 2 countries to compare!")
        }
    }

    function summarize(){
        if (countryData.length >= 1 ) {
            console.log("Summarize opened. These are the available country data: ");
            for (var i = 0; i < countryData.length; i++) {
                dataofcountries.push(<span key={i}> 
                <br></br>
                {countryData[i].id}{firstTagResult(i)}{secondTagResult(i)}{thirdTagResult(i)}. 
                <br></br>
                {/* {additionalText(i)} */}
                <br></br>                
                <br></br>
                </span>)
                for (var j = 0; j < imageofcountries.length; j++){
                    if (countryData[i].ISO === imageofcountries[j].ISO){
                        dataofcountries.push(<span key={j}> 
                            <img src={imageofcountries[j].Image} height = "250" width = "350"/>
                        </span>)
                    }
                }
            }
            setSummarizeModalIsOpen(true);
        }
        else{
            alert("Please select at least 1 country to show the summary!")
        }
    }

    function firstTagResult(i){
        if (countryData[i].tagLength >= 1){
            return " has a " + countryData[i].tag1name + " of " + countryData[i].tag1value
        }
        return " has no data available"
    }

    function secondTagResult(i){
        if (countryData[i].tagLength >= 2){
            return ", has a " + countryData[i].tag2name + " of " + countryData[i].tag2value
        }
        else if (countryData[i].tagLength >= 2){
            return ", has no data available"
        }
    }

    function thirdTagResult(i){
        if (countryData[i].tagLength === 3){
            return ", has a " +countryData[i].tag3name + " of " + countryData[i].tag3value
        }
        else if (countryData[i].tagLength >= 3){
            return ", has no data available"
        }    
    }

    function additionalText(i){
        if (countryData[i].countryText !== ""){
            return countryData[i].id + "'s additional note: " + countryData[i].countryText
        }
        return countryData[i].id + " has no additional text available"
    }

    function loaded () {
        setLoadModalIsOpen(false);
        if (map === 'Map1'){
            console.log("Map title " + mapTitle[0] + " has been selected");
            load(0); setMyMapTitle(mapTitle[0])
        }
        else if (map === 'Map2'){
            console.log("Map title " + mapTitle[1] + " has been selected");
            load(1); setMyMapTitle(mapTitle[1])
        }
        else if (map === 'Map3'){
            console.log("Map title " + mapTitle[2] + " has been selected");
            load(2); setMyMapTitle(mapTitle[2])
        }
        else if (map === 'Map4'){
            console.log("Map title " + mapTitle[3] + " has been selected");
            load(3); setMyMapTitle(mapTitle[3])
        }
        else{
            console.log("Map title " + mapTitle[4] + " has been selected");
            load(4); setMyMapTitle(mapTitle[4])      
        }
    }

    function closeComparison(){
        setCompareModalIsOpen(false)
        setSummarizeModalIsOpen(false)
        setlistofcountries([]);//Reset so it doesn't add up
        setdataofcountries([]);//Reset so it doesn't add up
    }

    const handleRemoveConfirm = (e) => {
        const name = e.target.className
        if (name.length > 0){
            if (window.confirm("Deleting this will remove all the data inside. Are you sure?")){
                setMapTitle(mapTitle.filter(item => item !== name));
                remove(name);
                setLoadModalIsOpen(false)
            }
        }
    };

    // const ref = storage.ref("users/User:" + user.uid + "/" + mapTitle);
    // const url = ref.getDownloadURL();

    return (
        <>
            <Router>
            <nav className='navbar'>
                <Link to='/' className='navbar-logo'>
                    YorkU MyMap
                </Link>
                <ul className={'nav-menu active'}>
                    <li className='nav-item'>
                        <button className='logout nav-links' onClick={moreThanOneCountry}>Save</button>
                        <Modal isOpen={saveModalIsOpen} //Modal open depends on setModal
                        ariaHideApp={false} //Hides annoying error
                        onRequestClose={() => setSaveModalIsOpen(false)} //Closes the modal if clicked outside of modal or esc
                        style={ modalStyle }
                        >
                            <div className="saveContents">
                                <h2 style={{margin: "5%"}}> Save </h2>
                                <p>Name of the map </p>
                                <input type="text" placeholder="Your map name.." style={{marginTop: "5%", height: "200%"}} onBlur={event => setMapTitle(event.target.value)}/>
                                <div className="saveButtons">
                                    <button onClick={saved}>Save</button>
                                    <button onClick = {() => setSaveModalIsOpen(false)}> Close </button>
                                </div>
                            </div>
                        </Modal>
                    </li>
                    <li className='nav-item'>
                    <button className='logout nav-links' onClick={loadCountry}>Load</button>
                        <Modal isOpen={LoadModalIsOpen} //Modal open depends on setModal
                        ariaHideApp={false} //Hides annoying error
                        onRequestClose={() => setLoadModalIsOpen(false)} //Closes the modal if clicked outside of modal or esc
                        style={ modalStyle }
                        >
                            <div className="saveContents">
                                <h2 style={{margin: "5%"}}> Load </h2>
                                <p>Your list of maps (Maximum 5) </p>
                                <Form.Group inline>
                                    <div style={{display: 'flex'}}>
                                        <Form.Radio label={mapTitle[0]} checked={map === 'Map1'} value="Map1" onClick={() => setMap('Map1')}/>
                                        <div className={mapTitle[0]} onClick={handleRemoveConfirm}> {'-----x'} </div>
                                    </div>
                                    <div style={{display: 'flex'}}>
                                        <Form.Radio label={mapTitle[1]} checked={map === 'Map2'} value="Map2" onClick={() => setMap('Map2')}/>
                                        <div className={mapTitle[1]} onClick={handleRemoveConfirm}> {'-----x'} </div>
                                    </div>
                                    <div style={{display: 'flex'}}>
                                        <Form.Radio label={mapTitle[2]} checked={map === 'Map3'} value="Map3" onClick={() => setMap('Map3')}/>
                                        <div className={mapTitle[2]} onClick={handleRemoveConfirm}> {'-----x'} </div>
                                    </div>
                                    <div style={{display: 'flex'}}>
                                        <Form.Radio label={mapTitle[3]} checked={map === 'Map4'} value="Map4" onClick={() => setMap('Map4')}/>
                                        <div className={mapTitle[3]} onClick={handleRemoveConfirm}> {'-----x'} </div>
                                    </div>
                                    <div style={{display: 'flex'}}>
                                        <Form.Radio label={mapTitle[4]} checked={map === 'Map5'} value="Map5" onClick={() => setMap('Map5')}/>
                                        <div className={mapTitle[4]} onClick={handleRemoveConfirm}> {'-----x'} </div>
                                    </div>
                                </Form.Group>

                                <div className="saveButtons">
                                    <button onClick = {loaded}>Load</button> 
                                    <button onClick = {() => setLoadModalIsOpen(false)}> Close </button>
                                </div>
                            </div>
                        </Modal>
                    </li>
                    <li className='nav-item'>
                    <button className='logout nav-links' onClick={moreThanTwoCountries}>Compare</button>
                        <Modal isOpen={CompareModalIsOpen} //Modal open depends on setModal
                        ariaHideApp={false} //Hides annoying error
                        onRequestClose={closeComparison} //Closes the modal if clicked outside of modal or esc
                        style={ modalStyle2 }
                        >
                            <div className="compareContents">
                                {/* <h2 style={{margin: "5%"}}> Compare </h2> */}
                                <h2>Comparison of the following countries: </h2>
                                <h2> {listofcountries} </h2>
                                <br></br>

                                <div style={{ height: 400, width: '100%' }}>
                                    <DataGrid rows={countryData} columns={columns} pageSize={10}/>
                                    {/* If you want checkbox <DataGrid rows={rows} columns={columns} pageSize={10} checkboxSelection /> */}
                                </div>
                                {/* <Image source={{ uri: url }}/> */}
                                <div className="compareButtons">
                                    <button onClick = {closeComparison}> Close </button>
                                </div>
                            </div>
                        </Modal>
                    </li>
                    <li className='nav-item'>
                    <button className='logout nav-links' onClick={summarize}>Summary</button>
                        <Modal isOpen={SummarizeModalIsOpen} //Modal open depends on setModal
                        ariaHideApp={false} //Hides annoying error
                        onRequestClose={closeComparison} //Closes the modal if clicked outside of modal or esc
                        style={ modalStyle2 }
                        >
                            <div className="compareContents">
                                <h2>Summary: </h2>
                                <br></br>
                                <br></br>
                                <div className="summarizedText">
                                    {dataofcountries}
                                </div>
                                <div className="compareButtons">
                                    <button onClick = {closeComparison}> Close </button>
                                </div>
                            </div>
                        </Modal>
                    </li>
                    {/* <li className='nav-item'>
                        <Link
                        to='/share'
                        className='nav-links'
                        >
                        Share
                        </Link>
                    </li> */}
                    <li className='nav-item'>
                        <button className='logout nav-links' onClick={handleLogout}>Logout</button>
                    </li>
                </ul>
            </nav>
            <Switch>
                <Route path='/' exact component={LoadMap} />
                <Route path='/share' component={Share} />
                {/* <button className='logout' onClick={handleLogout}>Logout</button> */}
            </Switch>
            </Router>
        </>
    );
};

export default Home;