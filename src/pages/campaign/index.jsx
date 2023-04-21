import { ContextProvider } from "@/context/AuthContext"
import { useState } from "react"
import uuid from "react-uuid"
import Link from "next/link"

export default function Campaign() {  
  const { handleImageUpload, imageURL, handleCampaign } = ContextProvider()
  const [ credential, setCredential ] = useState()
  
  async function onSubmit() {
    let data = {
      uid: uuid(),
      image: imageURL,
      redirectURL: credential,
    }
    if (imageURL != undefined) {
      try {
        await handleCampaign(data)
        console.table(data)
      } catch(err) {
        console.log(err)
      }
    } else {
      console.log('Ada error')
    }
  }

  async function uploadFile(e) {
    let img = e.target.files[0]
    if (img.size <= 10000000) {
      try {
        await handleImageUpload('campaign', img)
      } catch (err) {
        console.log(err)
      }
    } else {
      console.log('File lu kegedean')
    }
  }
  
  return (
    <main>
      <h1>Campaign</h1>
      <Link href="/">Go Back</Link>
      <hr />
      <form onSubmit={(e) => e.preventDefault() & onSubmit()}>
        <input type="file" accept="image/*" onChange={uploadFile} required/>
        {imageURL && 
        <div>
          <img src={imageURL} alt="preview" width={400}/><br />
          <a href={imageURL} target="_blank">Image Link</a>
        </div>
        } <br />  
        <input type="text" name="redirectURL" onChange={(e) => setCredential(e.target.value)} required/> <br />
        <button type="submit">Submit</button>
      </form>
    </main>
  )
}