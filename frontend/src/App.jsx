import { BrowserRouter } from "react-router-dom";
import Navbar from "./components/Navbar"
import AnimatedRoutes from "./components/AnimatedRoutes"
import Chatbot from "./components/Chatbot"
import Footer from "./components/Footer"

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <AnimatedRoutes />
      <Footer />
      <Chatbot />
    </BrowserRouter>
  )
}

export default App
