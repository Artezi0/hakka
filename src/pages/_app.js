import { ContextFunctions } from "@/context/AuthContext"
import '@/main.scss'

export default function App({ Component, pageProps }) {
  return (
    <ContextFunctions>
      <Component {...pageProps} />
    </ContextFunctions>
  )
}
