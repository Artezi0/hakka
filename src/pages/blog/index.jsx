import { ContextProvider } from "@/context/AuthContext"
import { useState, useEffect } from "react"
import uuid from "react-uuid"
import Link from "next/link"
import Head from "next/head"
import { storage } from "@/context/Firebase"
import { uploadBytes, getDownloadURL, ref, deleteObject } from "firebase/storage"
import { onSnapshot, collection, deleteDoc, doc } from "firebase/firestore"
import { db } from "@/context/Firebase"
import Toolbar from "@/components/Toolbar"

import { RichTextEditor } from "@mantine/tiptap"
import { useEditor } from '@tiptap/react';
import { Link as TiptapLink } from "@tiptap/extension-link";
import { Heading as TiptapHeading } from "@tiptap/extension-heading";
import TextAlign from "@tiptap/extension-text-align";
import StarterKit from '@tiptap/starter-kit';
import Placeholder from "@tiptap/extension-placeholder";
import Image from "next/legacy/image"

export default function Blog() {
  const { handleBlog  } = ContextProvider()
  const [ featured, isFeatured ] = useState(false)
  const [ content, setContent ] = useState('')
  const [ preview, setPreview ] = useState()
  const [ image, setImage ] = useState()
  const [ data, setData ] = useState([]) 
  const [ credential, setCredential ] = useState({
    title: '',
    author: '',
    content: '',
  }) 

  const editor = useEditor({
    extensions: [
      StarterKit.configure({ heading: false }),
      TiptapLink,
      TiptapHeading,
      TextAlign.configure({ types: ['heading', 'paragraph'] }),
      Placeholder.configure({ placeholder: 'Start writting...' })
    ],
    onUpdate() {
      setContent(editor.getHTML())
    },
  })

  useEffect(() => {
    onSnapshot(collection(db, 'blog'), (snapshot) => {
      let data = []
      snapshot.docs.forEach((doc) => {
        data.push({ uid: doc.uid, ...doc.data()})
        setData(data)
      }, (err) => {
        console.log(err)
      })
    })
  }, [])

  function handleChange(e) {
    const { name, value } = e.target
    setCredential((prev) => {
      return {
        ...prev,
        [name] : value
      }
    })
  }

  async function onSubmit() {
    let data = {
      uid: uuid(),
      dateCreated: new Date().toDateString().split(' ').slice(1).join(' '),
      title: credential.title,
      author: credential.author,
      content: content,
      thumbnail: image,
      isFeatured: featured,
    }

    const parentRef = ref(storage, "blog")
    const imageRef = ref(parentRef, data.uid)
    
    if (image != undefined) {
      try {
        await uploadBytes(imageRef, image)
        .then(() => {
          getDownloadURL(imageRef)
            .then((url) => {
              data.thumbnail = url
              handleBlog(data)
            })
        })
        location.reload() // Temporary fix
      } catch(err) {
        console.log(err)
      }
    } else {
      console.log('Ada error')
    }
  }  

  async function onDelete(uid) {
    const parentRef = ref(storage, "blog")
    const imageRef = ref(parentRef, uid)

    try {
      await deleteDoc(doc(db, 'blog', uid))
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
        <title>HAKKA Admin - Blog</title>
        <meta name="description" content="Admin Panel For Hakka" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <main className="blog">
        <header className="blog_header">
          <h1>Blog</h1>
          <Link href="/">Go Back</Link>
        </header>
        <section>
          <form onSubmit={(e) => e.preventDefault() & onSubmit()}>
            <input type="text" name="title" placeholder="Title" onChange={handleChange}/> <br />
            <input type="text" name="author" placeholder="Author" onChange={handleChange}/> <br />
            <input type="file" name="thumbnail" onChange={handleImageUpload}/>
            {preview && 
            <div style={{ position: 'relative', width: '200px', height: '200px', objectFit: 'cover'}}>
              <Image 
                src={preview} 
                alt="preview" 
                layout="fill"
                objectFit="contain"
                />
            </div>        }
            <RichTextEditor editor={editor}>
              <Toolbar />
              <RichTextEditor.Content />
            </RichTextEditor>
            <label htmlFor="featured">Featured</label>
            <input type="checkbox" id="featured" name="featured" onChange={() => isFeatured(!featured)}/> <br />
            <button type="submit">Post</button>
          </form>
        </section>
        <section className="blog_list">
          <ul className="datas">
          {data.length < 1 ? <p>No blog</p> : data.map(({ uid, title, author, dateCreated, isFeatured, thumbnail, content }) => {
            return (
              <ul key={uid} className="data">
                <Image className="data_img"
                  width={100}
                  height={100}
                  objectFit="cover"
                  src={thumbnail} 
                  alt="thumbnail" 
                />
                <div className="data_title">
                  {isFeatured && <p>Featured</p>}
                  <p className="blog_title">{title}</p>
                </div>
                <div className="data_btn">
                  <button type="button">View</button>
                  <button type="button">Edit</button>
                  <button type="button" onClick={() => onDelete(uid)}>Delete</button>
                </div>
              </ul>
            ) 
          })}
          </ul>
        </section>
      </main>
    </>
  )
}