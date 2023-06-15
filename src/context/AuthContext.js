import { createContext, useContext } from "react"
import { setDoc, doc } from "firebase/firestore"
import { db  } from "./Firebase"

const Context = createContext()

export function ContextFunctions({ children }) {
  
  // Upload campaign
  async function handleCampaign(data) {
    return setDoc(doc(db, "campaign", data.uid), { 
      image: data.image,
      url: data.redirectURL,
      uid: data.uid
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

  // Upload product
  async function handleProduct(data, url) {
    return setDoc(doc(db, "product", data.uid), {
      uid: data.uid,
      name: data.name,
      dateAdded: data.dateAdded,
      description: data.description,
      link: data.link,
      price: data.price,
      image: url,
    }).then(() => {
      console.table(data)
    })
  }

  return (
    <Context.Provider value={{
      handleCampaign,
      handleBlog,
      handleProduct,
    }}>{ children }</Context.Provider>
  )
}

export function ContextProvider() {
  return useContext(Context)
}