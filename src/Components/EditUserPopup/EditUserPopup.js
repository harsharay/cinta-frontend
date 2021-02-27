import React, { useState, useEffect } from "react"
import { UPDATE_USER_PROFILE } from "../../constants"

import "./EditUserPopup.css"

const EditUserPopup = ({ currentUser,handleClosePopup }) => {

    const [clickedEdit, setClickedEdit] = useState("")
    const [updatedUserDetails, setUpdatedUserDetails] = useState({
        name: currentUser.name,
        age: currentUser.age,
        skills: currentUser.skills.join(",")
    })

    useEffect(() => {
        console.log(currentUser)
    },[])

    const handleDoubleClick = data => {
        if(data === "name") {
            setClickedEdit("name")
        } else if(data === "age") {
            setClickedEdit("age")
        } else if(data === "skills") {
            setClickedEdit("skills")
        }
    }

    const handleUpdateInput = e => {
        const name = e.target.name
        const value = e.target.value

        setUpdatedUserDetails(prev => {
            return {
                ...prev,
                [name] : value
            }
        })
    }

    const handleUpdateInServer = () => {
        fetch(UPDATE_USER_PROFILE, {
            method: "POST",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                name: updatedUserDetails.name,
                age: updatedUserDetails.age,
                skills: updatedUserDetails.skills,
                uniqueId: currentUser.createdAt
            })
        }).then(data => data.json())
        .then(json => {
            handleClosePopup()
        })
    }

    return (
        <div className="editUser-root">
            <p>Click on items below to update</p>
            <p className='close' onClick={() => handleClosePopup()}>Close</p>
            <div className="editUser-content">
                { clickedEdit==="name" ? <input type="text" name="name" value={updatedUserDetails.name} onChange={handleUpdateInput}/> : <p onDoubleClick={() => handleDoubleClick("name")}>{currentUser.name}</p> }
                { clickedEdit==="age" ? <input type="text" name="age" value={updatedUserDetails.age} onChange={handleUpdateInput}/> : <p onDoubleClick={() => handleDoubleClick("age")}>{currentUser.age}</p> }
                { clickedEdit==="skills" ? <input type="text" name="skills" value={updatedUserDetails.skills} onChange={handleUpdateInput}/> : 
                    <ul>
                        {currentUser.skills.map((skill, skillindex) => {
                            return (
                                <li key={skillindex} onDoubleClick={() => handleDoubleClick("skills")}>{skill}</li>
                            )
                        })}
                    </ul>}
                <button onClick={handleUpdateInServer}>Confirm update</button>
            </div>
        </div>
    )
}

export default EditUserPopup;