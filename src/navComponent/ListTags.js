import React from 'react';
import './ListTags.css'
import { useGlobalState } from "../global-context";

function ListTags(){
    const { inputTagData } = useGlobalState();

    return(
        <div className="listTags">
            { inputTagData.map((localState) =>(
                <p> <option key={localState.data}> {localState.data} </option> </p>
            )) }
        </div>

    )
}

export default ListTags;