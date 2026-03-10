import { Outlet } from "react-router-dom"
import HeaderConnected from "./HeaderConnected"
import Footer from "./Footer"

export default function AdminLayout() {
	return (
		<div className="min-h-screen flex flex-col bg-paper">
			<HeaderConnected />
			<main className="flex-1">
				<Outlet />
			</main>
			<Footer />
		</div>
	)
}

