import { Routes, Route, Navigate } from "react-router-dom"

import Home from "../features/home/Home"
import Login from "../features/auth/Login"
import Register from "../features/auth/Register"

import PublicLayout from "../components/layout/PublicLayout"
import MainLayout from "../components/layout/MainLayout"
import LibraryLayout from "../components/layout/LibraryLayout"
import RequireRegistration from "../guards/RequireRegistration"
import RequireAuth from "../guards/RequireAuth"
import PreferencesSignupForm from "../components/PreferencesSignupForm"

import DigitalBooks from "../features/library/DigitalBooks"
import Audiobooks from "../features/library/Audiobooks"
import Podcasts from "../features/library/Podcasts"
import Dashboard from "../features/dashboard/Dashboard"
import BooksPublic from "../features/public/BooksPublic"
import AudiobooksPublic from "../features/public/AudiobooksPublic"
import PodcastsPublic from "../features/public/PodcastsPublic"

export default function AppRouter() {
  return (
    <Routes>

      {/* ================= PAGES PUBLIQUES ================= */}
      <Route element={<PublicLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/public/livres" element={<BooksPublic />} />
        <Route path="/public/audiobooks" element={<AudiobooksPublic />} />
        <Route path="/public/podcasts" element={<PodcastsPublic />} />
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
      <Route
        element={
          <RequireAuth>
            <MainLayout />
          </RequireAuth>
        }
      >
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/library" element={<LibraryLayout />}>
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
