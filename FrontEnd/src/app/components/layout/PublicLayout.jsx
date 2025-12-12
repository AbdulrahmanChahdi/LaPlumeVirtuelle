import { Outlet } from "react-router-dom"
import HeaderPublic from "./HeaderPublic"
import Footer from "./Footer"

export default function PublicLayout() {
  return (
    <div className="min-h-screen flex flex-col bg-paper">
      <HeaderPublic />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}
