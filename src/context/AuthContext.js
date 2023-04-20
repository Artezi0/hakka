import { createContext, useContext, useEffect, useState } from "react"
import { setDoc, collection, onSnapshot, updateDoc, doc } from "firebase/firestore"
import { ref, uploadBytes, getDownloadURL } from "firebase/storage" 
import { db, storage } from "./Firebase"
import uuid from "react-uuid"

const Context = createContext()

export function ContextFunctions({ children }) {
  const [ imageURL, setImageURL ] = useState()

  // Handle image uploads
  async function handleImageUpload(path, file) {
    const parentRef = ref(storage, path)
    const imageRef = ref(parentRef, uuid())

    return uploadBytes(imageRef, file)
      .then(() => {
        getDownloadURL(imageRef)
          .then((url) => {
            setImageURL(url)
          })
      })
  }

  // Upload campaign
  async function handleCampaign(data) {
    return setDoc(doc(db, "campaign", data.uid), { 
      image : data.image,
      url : data.redirectURL,
      uid : data.uid
    })
  }

  // Upload blog
  async function handleBlog(data) {
    return setDoc(doc(db, "blog", data.uid), {
      uid: data.uid,
      dateCreated: data.dateCreated,
      title: data.title,
      author: data.author,
      content: data.content,
      thumbnail: data.thumbnail,
      isFeatured: data.isFeatured, 
    })
  }

  return (
    <Context.Provider value={{
      // Handle image
      imageURL,
      handleImageUpload,

      // Handle campaign
      handleCampaign,

      // Handle blog
      handleBlog,
    }}>{ children }</Context.Provider>
  )
}

export function ContextProvider() {
  return useContext(Context)
}