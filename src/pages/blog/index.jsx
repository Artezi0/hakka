import { ContextProvider } from "@/context/AuthContext"
import { useState } from "react"
import uuid from "react-uuid"
import Link from "next/link"
import { storage } from "@/context/Firebase"
import { uploadBytes, getDownloadURL, ref } from "firebase/storage"

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
      <h1>Blog</h1>
      <Link href="/">Go Back</Link>
      <hr />
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
          <RichTextEditor.Toolbar sticky stickyOffset={60}>
          <RichTextEditor.ControlsGroup>
            <RichTextEditor.ClearFormatting />
            <RichTextEditor.Bold />
            <RichTextEditor.Italic />
          </RichTextEditor.ControlsGroup>

          <RichTextEditor.ControlsGroup>
            <RichTextEditor.H1 />
            <RichTextEditor.H2 />
            <RichTextEditor.H3 />
          </RichTextEditor.ControlsGroup>

          <RichTextEditor.ControlsGroup>
            <RichTextEditor.Link />
            <RichTextEditor.Unlink />
          </RichTextEditor.ControlsGroup> 
         
          <RichTextEditor.ControlsGroup>
            <RichTextEditor.AlignLeft />
            <RichTextEditor.AlignCenter />
            <RichTextEditor.AlignJustify />
            <RichTextEditor.AlignRight />
          </RichTextEditor.ControlsGroup>
        </RichTextEditor.Toolbar>
      <RichTextEditor.Content />
        </RichTextEditor>
        <label htmlFor="featured">Featured</label>
        <input type="checkbox" id="featured" name="featured" onChange={() => isFeatured(!featured)}/> <br />
        <button type="submit">Post</button>
      </form>
    </main>
  )
}