import Link from "next/link"
import uuid from "react-uuid"
import Head from "next/head"
import Image from "next/legacy/image"

import { db } from "@/context/Firebase"
import { useState, useEffect } from "react"
import { storage } from "@/context/Firebase"
import { ref, getDownloadURL, uploadBytes, deleteObject } from "firebase/storage"
import { ContextProvider } from "@/context/AuthContext"
import { collection, deleteDoc, doc, onSnapshot } from "firebase/firestore"
import CurrencyInput from "react-currency-input-field"

export default function Sets() {
  const [ data, setData ] = useState([])
  const [ preview, setPreview ] = useState()
  const [ image, setImage ] = useState()
  const { handleProduct } = ContextProvider()
  const [ credential, setCredential ] = useState({
    uid : uuid(),
    dateAdded : new Date().getDate(),
    name : '',
    description : '',
    link : '',
    price : '',
  })
  
  useEffect(() => {
    onSnapshot(collection(db, "product"), (snapshot) => {
      let data = []
      snapshot.docs.forEach((doc) => {
        data.push({ uid: doc.uid, ...doc.data()})
        setData(data)
      }, (err) => {
        console.log(err)
      })
    })
  }, [])
  
  function onChange(e) {
    const { name, value } = e.target
    setCredential((prev) => {
      return {
        ...prev,
        [name] : value
      }
    })
  }
    
  async function onSubmit() {
    const baseRef = ref(storage, "product")
    const rootRef = ref(baseRef, credential.uid)
    
    if (image != undefined) {
      try {
        await uploadBytes(rootRef, image)
        .then(() => {
          getDownloadURL(rootRef)
            .then((url) => {
              handleProduct(credential, url)
            })
          })
        location.reload()
      } catch(err) {
        console.log(err)
      }
    } else {
      console.log('Ada error')
    }
  }

  async function onDelete(uid) {
    const baseRef = ref(storage, "product")
    const rootRef = ref(baseRef, credential.uid)

    try {
      await deleteDoc(doc(db, 'product', uid))
        .then(() => {
          deleteObject(rootRef)
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
        <title>HAKKA Admin - Product</title>
        <meta name="description" content="Admin panel for Hakka" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        </Head>
      <main className="product">
        <div className="product_header">
          <h1>Upload Product</h1>
          <Link href="/">Go Back</Link>
        </div>
        <section className="product_input">
          <form onSubmit={(e) => e.preventDefault() & onSubmit()}>
            <input type="text" name="name" placeholder="Name" onChange={onChange} required/> <br />
            <input type="text" name="description" placeholder="Description" onChange={onChange} required/> <br />
            <input type="text" name="link" placeholder="Link Affiliate" onChange={onChange} required/> <br />
            {preview &&
              <Image 
                src={preview}
                alt="Product images"
                width={100}
                height={100}
              />
            }
            <label htmlFor="images">Product Images</label>
            <input type="file" name="images" id="images" multiple accept="image/*" onChange={handleImageUpload} required/><br />
            <input type="number" name="price" placeholder="Price" onChange={onChange} required />
            <button type="submit">Submit</button>
          </form>
        </section>
        <section className="campaign_list">
          <ul className="datas">
          {data.length < 1 ? <p>No product</p> : data.map(({uid, name, image, description, price, dateAdded}) => {
            return (
              <li key={uid} className="data">
                <Image 
                  src={image}
                  alt="Product images"
                  width={100}
                  height={100}
                />
                <div className="data_title">
                  <p>{name}</p>
                  <CurrencyInput 
                    value={price}
                    disabled={true}
                    prefix="Rp"
                    decimalSeparator=","
                    groupSeparator="."
                  />
                </div>
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