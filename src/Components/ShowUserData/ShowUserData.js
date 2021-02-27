import React, { useState, useEffect } from "react"
import { GET_PROFILE, GET_ALL_PROFILES } from "../../constants"
import EditUserPopup from "../EditUserPopup/EditUserPopup"

import "./ShowUserData.css"

const ShowUserData = () => {

    const [allUserData, setAllUserData] = useState([])
    const [currentUser, setCurrentUser] = useState({})

    useEffect(() => {
        fetch(GET_ALL_PROFILES)
        .then(data => data.json())
        .then(json => setAllUserData(json))
    },[])

    const handleGetUserData = (uniqueId) => {
        fetch(GET_PROFILE.replace("__UNIQUEID__",uniqueId))
        .then(data => data.json())
        .then(json => setCurrentUser(...json))
    }

    const handleClosePopup = () => {
        setCurrentUser({})
    }

    return (
        <div>
            <div>
                {allUserData ? allUserData.map((item, index) => {
                    return (
                        <div key={item.createdAt} className={"singleUserData-block "+ (Object.keys(currentUser).length > 0 ? "dull" : "")}>
                            <p>{index+1}</p>
                            <div className="singleUserData" onClick={() => handleGetUserData(item.createdAt)}>
                                <p>{item.name}</p>
                                <p>{item.age}</p>
                                <ul>
                                    {item.skills.map((skill, skillindex) => {
                                        return (
                                            <li key={skillindex}>{skill}</li>
                                        )
                                    })}
                                </ul>
                                <img src={item.profileImage} alt="profilePicture" />
                            </div>
                        </div>
                    )})
                :
                <p>No data to display</p>
                }
            </div>

            <div>
                {Object.keys(currentUser).length>0 && <EditUserPopup currentUser={currentUser} handleClosePopup={handleClosePopup}/>}
            </div>
        </div>
    )
}

export default ShowUserData;