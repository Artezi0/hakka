import { createContext, useContext, useEffect, useState } from "react"
import { setDoc, collection, onSnapshot, updateDoc, doc } from "firebase/firestore"
import { ref, deleteObject } from "firebase/storage"
import { db, storage  } from "./Firebase"

const Context = createContext()

export function ContextFunctions({ children }) {
  const [ imageURL, setImageURL ] = useState()

  // Upload campaign
  async function handleCampaign(data) {
    return setDoc(doc(db, "campaign", data.uid), { 
      image : data.image,
      url : data.redirectURL,
      uid : data.uid
    }).then(() => {
      console.table(data)
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
    }).then(() => {
      console.table(data)
    })
  }

  // Upload Sets

  return (
    <Context.Provider value={{
      handleCampaign,
      handleBlog,
    }}>{ children }</Context.Provider>
  )
}

export function ContextProvider() {
  return useContext(Context)
}