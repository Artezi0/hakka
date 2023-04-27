import Link from "next/link"
import Select from "react-select"
import CurrencyInput from "react-currency-input-field"
import { useState } from "react"

export default function Sets() {
  const [ products, setProducts ] = useState([])
  const [ credential, setCredential ] = useState({
    name: '',
    description: '',
    price : '',
    stock : '',
  })
  

  function onChange(e) {
    const { name, value } = e.target
    setCredential((prev) => {
      return {
        ...prev,
        [name] : value
      }
    })
  }

  function onSubmit() {
    console.table(credential)
  }

  function addProduct() {
    // let product = {
    //   name: 'Product 1',
    //   sizes: ['s', 'm', 'l']
    // }
  }
  
  //     uploadMultipleFiles(e) {
  //         this.fileObj.push(e.target.files)
  //         for (let i = 0; i < this.fileObj[0].length; i++) {
  //             this.fileArray.push(URL.createObjectURL(this.fileObj[0][i]))
  //         }
  //         this.setState({ file: this.fileArray })
  //     }

  return (
    <main>
      <div>
        <h1>Upload Set</h1>
        <Link href="/">Go Back</Link>
      </div>
      <hr />
      <form action="">
        <input type="text" name="name" placeholder="Name" onChange={onChange}/>
        <textarea name="description" placeholder="Description" onChange={onChange}></textarea>
        <Select 
          name="category"
          placeholder="Category"
          isMulti
        />
        <Select 
          name="volume"
          placeholder="Volume"
        />
        <CurrencyInput 
          name="price"
          placeholder="Price"
          prefix="Rp"
          decimalSeparator="," 
          groupSeparator="." 
          intlConfig={{
            locale : 'id-ID',
            currency: 'IDR'  
          }}
        />
        <input type="number" name="stock" placeholder="Stock" onChange={onChange}/>
        <hr />        
        <button type="button">Add product</button>
        <button type="submit">Submit</button>
      </form>
    </main>
  )
}