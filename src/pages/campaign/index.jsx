import uuid from "react-uuid"
import Link from "next/link"
import Image from "next/legacy/image"
import { useState } from "react"
import { uploadBytes, getDownloadURL, ref } from "firebase/storage"
import { storage } from "@/context/Firebase"
import { ContextProvider } from "@/context/AuthContext"

export default function Campaign() {  
  const [ credential, setCredential ] = useState()
  const [ image, setImage ] = useState()
  const [ preview, setPreview ] = useState()
  const { handleCampaign } = ContextProvider()

  async function onSubmit() {
    let data = {
      uid: uuid(),
      image: image,
      redirectURL: credential,
    }

    const parentRef = ref(storage, "campaign")
    const imageRef = ref(parentRef, data.uid)

    if (image != undefined) {
      try {
        await uploadBytes(imageRef, image)
        .then(() => {
          getDownloadURL(imageRef)
            .then((url) => {
              data.image = url
              handleCampaign(data)
            })
          })
      } catch(err) {
        console.log(err)
      }
    } else {
      console.log('Ada error')
    }
  }

  function handleImageUpload(e) {
    let image = e.target.files[0]
    const reader = new FileReader()

    if (image.size <= 5000000) {
      setImage(image)
      reader.onloadend = () => {
        setPreview(reader.result)
      }
      reader.readAsDataURL(image)
    } else {
      console.log('File lu kegedean')
    }
  }
  
  return (
    <main>
      <div>
        <h1>Upload Campaign</h1>
        <Link href="/">Go Back</Link>
      </div>
      <hr />
      <br />
      <form onSubmit={(e) => e.preventDefault() & onSubmit()}>
        <input type="file" accept="image/*" onChange={(e) => handleImageUpload(e)} required/>
        {preview && 
        <div style={{ position: 'relative', width: '200px', height: '200px', objectFit: 'cover'}}>
          <Image 
            src={preview} 
            alt="preview" 
            layout="fill"
            objectFit="contain"
          />
        </div>
        } <br />  
        <input type="text" name="redirectURL" onChange={(e) => setCredential(e.target.value)} required/> <br />
        <button type="submit">Submit</button>
      </form>
    </main>
  )
}