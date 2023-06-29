import uuid from "react-uuid"
import Head from "next/head"
import Link from "next/link"
import Image from "next/legacy/image"
import { useState, useEffect } from "react"
import { uploadBytes, getDownloadURL, ref, deleteObject } from "firebase/storage"
import { storage } from "@/context/Firebase"
import { ContextProvider } from "@/context/AuthContext"
import { collection, deleteDoc, doc, onSnapshot } from "firebase/firestore"
import { db } from "@/context/Firebase"

export default function Campaign() {  
  const { handleCampaign } = ContextProvider()
  const [ redirect, setRedirect ] = useState()
  const [ preview, setPreview ] = useState()
  const [ image, setImage ] = useState()
  const [ data, setData ] = useState([])
  const [ error, setError ] = useState("")

  useEffect(() => {
    onSnapshot(collection(db, 'campaign'), (snapshot) => {
      let data = []
      snapshot.docs.forEach((doc) => {
        data.push({ uid: doc.uid, ...doc.data()})
        setData(data)
      }, (err) => {
        console.log(err)
      })
    })
  }, [])

  async function onSubmit() {
    let data = {
      uid: uuid(),
      image: image,
      redirectURL: redirect ? redirect : '',
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
        setPreview(false)
        setRedirect(false)
      } catch(err) {
        console.log(err)
      }
    } else {
      console.log('Ada error')
    }
  }

  async function onDelete(uid) {
    const parentRef = ref(storage, "campaign")
    const imageRef = ref(parentRef, uid)

    try {
      await deleteDoc(doc(db, 'campaign', uid))
        .then(() => {
          deleteObject(imageRef)
        })
      location.reload()
    } catch (err) {
      console.log(err)
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
    <>
     <Head>
        <title>HAKKA Admin - Campaign</title>
        <meta name="description" content="Admin panel for Hakka" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <main className="campaign">
        <header className="campaign_header">
          <h1>Upload Campaign</h1>
          <Link href="/">Go Back</Link>
        </header>
        <section className="campaign_input">
          <form onSubmit={(e) => e.preventDefault() & onSubmit()}>
            <div className="campaign_input-img">
              <input type="file" accept="image/*" onChange={(e) => handleImageUpload(e)} required/>
              {preview && 
                <div className="img_preview" style={{ position: 'relative', width: '200px', height: '200px', objectFit: 'cover'}}>
                  <Image src={preview} alt="preview" layout="fill" objectFit="contain"/>
                </div>
              }
              <label>Recomended image size 1128 px x 500 px. Max file size 5 mb</label>
            </div>
            <div className="campaign_input-redirect">
              <input type="text" name="redirectURL" placeholder="Redirect URL" onChange={(e) => setRedirect(e.target.value)}/>
            </div>
            <button type="submit">Submit</button>
          </form>
        </section>
        <section className="campaign_list">
          <ul className="datas">
            {data.length < 1 ? <p>No campaign</p> : data.map(({ uid, url, image }) => {
              return (
                <li key={uid} className="data">
                  <Image 
                    width={200}
                    height={100}
                    src={image} 
                    alt="preview"

                  /> 
                  <br />
                  {url !== "" && <a href={url} target="_blank">Redirect Link</a>}
                  <div className="data_btn">
                    <button type="button">Edit</button>
                    <button type="button" onClick={() => onDelete(uid)}>Delete</button>
                  </div>
                </li>
              )
            })}
          </ul>
        </section>
      </main>
    </>
  )
}