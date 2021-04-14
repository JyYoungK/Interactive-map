import React from 'react';
import './ListTags.css'
import { useGlobalState } from "../global-context";
import trashicon from '../img/trash.jpg';

const ListTags = () => {
    const { inputTagData, setInputTagData } = useGlobalState();

    const removeTag = (e) => {
        const name = e.target.name
        setInputTagData(inputTagData.filter(item => item.data !== name)); //Removes the data with matching ISO
      }

    return(
        <div className="listTags">
            { inputTagData.map((localState) =>(
                <div className="tagArea" >
                    <p> 
                        <option className="tagData" key={localState.data}> {localState.data} </option>
                        <img src = {trashicon} className="tagPic" name = {localState.data} onClick={removeTag} width = "20vw" height ="20vh" />
                     </p>
                </div>
            )) }
        </div>

    )
}

export default ListTags;