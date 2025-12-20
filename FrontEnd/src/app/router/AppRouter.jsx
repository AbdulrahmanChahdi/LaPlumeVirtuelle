import { Routes, Route, Navigate } from "react-router-dom"

import Home from "../features/home/Home"
import Login from "../features/auth/Login"
import Register from "../features/auth/Register"

import PublicLayout from "../components/layout/PublicLayout"
import MainLayout from "../components/layout/MainLayout"
import LibraryLayout from "../components/layout/LibraryLayout"
import RequireRegistration from "../guards/RequireRegistration"
import PreferencesSignupForm from "../components/PreferencesSignupForm"

import DigitalBooks from "../features/library/DigitalBooks"
import Audiobooks from "../features/library/Audiobooks"
import Podcasts from "../features/library/Podcasts"

export default function AppRouter() {
  return (
    <Routes>

      {/* ================= PAGES PUBLIQUES ================= */}
      <Route element={<PublicLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route
          path="/onboarding/preferences"
          element={
            <RequireRegistration>
              <PreferencesSignupForm />
            </RequireRegistration>
          }
        />
      </Route>

      {/* ================= APPLICATION (connecté) ================= */}
      <Route element={<MainLayout />}>
        <Route path="/library" element={<LibraryLayout />}>
          <Route index element={<Navigate to="digital-books" replace />} />
          <Route path="digital-books" element={<DigitalBooks />} />
          <Route path="audiobooks" element={<Audiobooks />} />
          <Route path="podcasts" element={<Podcasts />} />
        </Route>
      </Route>

      {/* ================= FALLBACK ================= */}
      <Route path="*" element={<Navigate to="/" replace />} />

    </Routes>
  )
}
