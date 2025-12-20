import { Outlet } from "react-router-dom"
import HeaderConnected from "./HeaderConnected"
import Footer from "./Footer"

export default function MainLayout() {
  return (
    <div className="main-layout">
      <HeaderConnected />
      <main>
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}
