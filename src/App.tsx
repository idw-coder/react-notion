import { BrowserRouter, Routes, Route } from "react-router-dom"
import Layout from "@/Layout"
import { Home } from "@/pages/Home"
import NoteDetail from "@/pages/NoteDetail"
import SignIn from "@/pages/Signin"
import SignUp from "@/pages/Signup"

function App() {

  return (
    <BrowserRouter>
      <div className="h-full">
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="/:id" element={<NoteDetail />} />
          </Route>
          <Route path="signin" element={<SignIn />} />
          <Route path="signup" element={<SignUp />} />
        </Routes>
        Hello World
      </div>
    </BrowserRouter>
  )
}

export default App
