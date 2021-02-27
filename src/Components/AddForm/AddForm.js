import React, { useState, useEffect } from "react"
import { ADD_NEW_PROFILE, UPLOAD_FIRST_IMAGE, UPLOAD_SECOND_IMAGE } from "../../constants"
import Compress from "compress.js"

import "./AddForm.css"
import { Link } from "react-router-dom"

const AddForm = () => {

    const compress = new Compress()

    const [inputData, setInputData] = useState({
        name:"",
        age: "",
        skills: ""
    })

    const [file1, setFile1] = useState("")
    const [file2, setFile2] = useState("")

    const [imageUrls, setImageUrls] = useState({
        firstImageUrl: "",
        secondImageUrl: ""
    })

    const [profilePicture, setProfilePicture] = useState("")


    const handleChange = e => {
        const name = e.target.name
        const value = e.target.value

            setInputData(prev => {
                return {
                    ...prev,
                    [name] : value
                }
            })

    }

    const handleSubmit = e => {
        e.preventDefault()

        const { name, age, skills } = inputData
        const { firstImageUrl, secondImageUrl } = imageUrls

        if(name && age && skills && firstImageUrl && secondImageUrl && profilePicture) {

            let profileImage = ""
            let otherImage = ""

            if(profilePicture === firstImageUrl ) {
                profileImage = firstImageUrl
                otherImage = secondImageUrl
            } else {
                profileImage = secondImageUrl
                otherImage = firstImageUrl
            }

            console.log(60,name, age, skills, profileImage, otherImage)

            fetch(ADD_NEW_PROFILE, {
                method: "POST",
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    name: inputData.name,
                    age: inputData.age,
                    skills: inputData.skills,
                    profileImage,
                    otherImage
                })
            }).then(data => data.json())
            .then(json => {
                console.log(json)
                alert(json.message)
            })
        } else {
            alert("Click on Upload images/ Fill all the fields ")
        }
    }

    const resizeImageFn = async imageFile => {
        const resizedImage = await compress.compress([imageFile], {
            size: 2, // the max size in MB, defaults to 2MB
            quality: 1, // the quality of the image, max is 1,
            maxWidth: 1280, // the max width of the output image, defaults to 1920px
            maxHeight: 920, // the max height of the output image, defaults to 1920px
            resize: true // defaults to true, set false if you do not want to resize the image width and height
          })

          return resizedImage
    }

    const handleUploadImage1 = async e => {
        const file = e.target.files[0]

        // const newFile = await resizeImageFn(file)

        const image64 = await convertToBase64(file)
        
        console.log(file)

        setFile1(image64)
    }

    const handleUploadImage2 = async e => {
        const file = e.target.files[0]
        // const newFile = await resizeImageFn(file)

        const image64 = await convertToBase64(file)
        // console.log(file, image64)
        setFile2(image64)
    }

    const convertToBase64 = file => {
        return new Promise((resolve, reject) => {
            const fileReader = new FileReader()
            fileReader.readAsDataURL(file)

            fileReader.onload = () => {
                resolve(fileReader.result)
            }

            fileReader.onerror = error => {
                reject(error)
            }
        })
    }

    const handleSubmitImages = e => {
        
        e.preventDefault()

        if(file1 === file2) {
            if(file1) {
                fetch(UPLOAD_FIRST_IMAGE, {
                    method: 'POST',
                    body: JSON.stringify({
                        image64 : file1,
                    }),
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json'
                    }
                })
                .then(data => data.json())
                .then(json => setImageUrls(prev => {
                    return {
                        ...prev,
                        firstImageUrl : json.output
                    }
                }))
            }
    
            if(file2) {
                fetch(UPLOAD_SECOND_IMAGE, {
                    method: 'POST',
                    body: JSON.stringify({
                        image64 : file2,
                    }),
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json'
                    }
                })
                .then(data => data.json())
                .then(json => setImageUrls(prev => {
                    return {
                        ...prev,
                        secondImageUrl : json.output
                    }
                }))
            }
        } else {
            alert("Upload same images")
        }
    }

    const handleProfilePicSelection = (item) => {
        setProfilePicture(item)
    }
 
    return (
        <div>
            <div>
                <form onSubmit={handleSubmitImages} encType="multipart/form-data" action="/upload" method="post" className="image-form">
                    <label>
                        First Image: 
                        <input type="file" name="image1"  accept="image/*" onChange={handleUploadImage1}/>
                    </label>

                    <label>
                        Second Image: 
                        <input type="file" name="image2"  accept="image/*" onChange={handleUploadImage2} />
                    </label>
                    <button>Submit images</button>
                </form>
                <form onSubmit={handleSubmit} className="input-form">
                    <label>
                        
                        <input type="text" name="name" onChange={handleChange} placeholder="Enter name"/>
                    </label>

                    <label>
                        
                        <input type="text" name="age" onChange={handleChange} placeholder="Enter age"/>
                    </label>

                    <label>
                        
                        <input type="text" name="skills" onChange={handleChange} placeholder="Skills, comma seperated"/>
                    </label>


                    { (imageUrls.firstImageUrl && imageUrls.secondImageUrl) &&
                        <div className="image-uploads-group">
                            <p>Select and image below as the profile pciture</p>
                            <div className="image-uploads">
                            <p onClick={() => handleProfilePicSelection(imageUrls.firstImageUrl)} className={profilePicture === imageUrls.firstImageUrl ? "highlight" : ""}>First Image uploaded</p> 
                            <p onClick={() => handleProfilePicSelection(imageUrls.secondImageUrl)} className={profilePicture === imageUrls.secondImageUrl ? "highlight" : ""}>Second Image uploaded</p>
                        </div>
                        </div>
                        
                    }
                    
                    <input type="submit" value="Submit" className="submit-button"/>
                </form>
                <div style={{ marginTop: "5%", fontSize: "22px" }}>
                    <Link to="/showAllUserData">View all users</Link>
                </div>

                <div style={{ marginTop:"3%", fontSize:"18px", border:"2px solid cyan" }}>
                    <p>First upload both the images, </p>
                     <p>   submit them using the submit images button and </p>
                       <p> then submit the form</p>
                </div>
            </div>
        </div>
    )
}

export default AddForm;