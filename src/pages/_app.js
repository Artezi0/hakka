import { ContextFunctions } from "@/context/AuthContext"

export default function App({ Component, pageProps }) {
  return (
    <ContextFunctions>
      <Component {...pageProps} />
    </ContextFunctions>
  )
}
