import { Routes, Route, Navigate } from "react-router-dom"

import MainLayout from "../components/layout/MainLayout"
import LibraryLayout from "../components/layout/LibraryLayout"

import Login from "../features/auth/Login"
import Register from "../features/auth/Register"

import DigitalBooks from "../features/library/DigitalBooks"
import Audiobooks from "../features/library/Audiobooks"
import Podcasts from "../features/library/Podcasts"

export default function AppRouter() {
  return (
    <Routes>

      <Route path="/" element={<Navigate to="/library/digital-books" replace />} />

      {/* <Route path="/auth/login" element={<Login />} />
      <Route path="/auth/register" element={<Register />} /> */}

      <Route element={<MainLayout />}>
        <Route path="/library" element={<LibraryLayout />}>
          <Route path="digital-books" element={<DigitalBooks />} />
          <Route path="audiobooks" element={<Audiobooks />} />
          <Route path="podcasts" element={<Podcasts />} />
          <Route index element={<Navigate to="digital-books" replace />} />
        </Route>
      </Route>

      <Route path="*" element={<Navigate to="/library/digital-books" replace />} />

    </Routes>
  )
}
