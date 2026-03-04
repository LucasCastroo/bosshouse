import { useLenis } from './hooks/useLenis'
import Hero from './sections/Hero'
import Booking from './sections/Booking'

export default function App() {
  useLenis()

  return (
    <main>
      <Hero />
      <Booking />
    </main>
  )
}
