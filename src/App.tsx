import { BrowserRouter, Routes, Route } from "react-router-dom"
import Layout from "@/Layout"
import { Home } from "@/pages/Home"
import NoteDetail from "@/pages/NoteDetail"
import SignIn from "@/pages/Signin"
import SignUp from "@/pages/Signup"
import { useCurrentUserStore } from "./modules/auth/current-user.state"
import { useEffect, useState } from "react"
import { authRepository } from "./modules/auth/auth.repository"

function App() {
  // GitHub Pagesデプロイのためのbasename → Viteのconfig.tsで設定
  const basename = import.meta.env.BASE_URL;

  const [isLoading, setIsLoading] = useState(true);
  const currentUserStore = useCurrentUserStore();

  useEffect(() => {
    setSession();
  }, []);

  const setSession = async () => {
    const currentUser = await authRepository.getCurrentUser();
    currentUserStore.set(currentUser);
    setIsLoading(false);
  }

  if (isLoading) return <div />;

  return (
    <BrowserRouter basename={basename}>
      <div className="h-full">
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="/notes/:id" element={<NoteDetail />} />
          </Route>
          <Route path="signin" element={<SignIn />} />
          <Route path="signup" element={<SignUp />} />
        </Routes>
      </div>
    </BrowserRouter>
  )
}

export default App
