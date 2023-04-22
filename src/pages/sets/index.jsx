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

  console.log(credential)

  return (
    <main>
      <div>
        <h1>Upload Set</h1>
        <Link href="/">Go Back</Link>
      </div>
      <hr />
      <form action="">
        {/* 
          1. Set name -
          2. Description -
          3. Category
          4. Price -
          5. Product included
          6. Available stock - 
          7. Images

          id-ID IDR
        */}
        <input type="text" name="name" placeholder="Name" onChange={onChange}/>
        <textarea name="description" placeholder="Description" onChange={onChange}></textarea>
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