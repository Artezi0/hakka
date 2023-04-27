import { ContextProvider } from "@/context/AuthContext"
import { useState, useEffect } from "react"
import uuid from "react-uuid"
import Link from "next/link"
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
      dateCreated: new Date().toLocaleDateString(),
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
    <main className="blog">
      <header className="blog_header">
        <h1>Blog</h1>
        <Link href="/">Go Back</Link>
      </header>
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

      <section className="blog_list">
        {data.length < 1 ? <p>No blog</p> : data.map(({ uid, title, author, dateCreated, isFeatured, thumbnail, content }) => {
          return (
            <div key={uid} className="blog">
              <div className="blog_thumb" style={{ position: 'relative', width: '100px', height: '100px', objectFit: 'cover'}}>
                <Image 
                  src={thumbnail} 
                  alt="thumbnail" 
                  layout="fill"
                  objectFit="contain"
                />
              </div>
              {isFeatured && <p>Featured</p>}
              <h2 className="blog_title">{title}</h2>
              <p className="blog_author">@{author}</p>
              <p className="blog_date">{dateCreated}</p>
              <p className="blog_content">{content}</p>
              <button type="button" onClick={() => onDelete(uid)}>Delete</button>
            </div>
          ) 
        })}
      </section>
    </main>
  )
}