import Head from 'next/head'
import Link from 'next/link'

export default function Home() {
  return (
    <>
      <Head>
        <title>HAKKA Admin</title>
        <meta name="description" content="Admin panel for Hakka" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <main>
        <h1>Mau Upload Apa?</h1>
        <ul>
          <li><Link href='/campaign'>Campaign</Link></li>
          <li><Link href='/blog'>Blog</Link></li>
          <li><Link href='/product'>Product</Link></li>
        </ul>
      </main>
    </>
  )
}
