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
import BookDetail from "../features/library/BookDetail"
import DigitalBookDetail from "../features/library/DigitalBookDetail"
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
        <Route path="/auth/login" element={<Login />} />
        <Route path="/auth/register" element={<Register />} />
        <Route path="/catalogue" element={<BooksPublic />} />
        <Route path="/public/livres" element={<BooksPublic />} />
        <Route path="/public/audiobooks" element={<AudiobooksPublic />} />
        <Route path="/public/podcasts" element={<PodcastsPublic />} />
        {/* Discover routes - accessible to all users */}
        <Route path="/discover/books" element={<BooksPublic />} />
        <Route path="/discover/audiobooks" element={<AudiobooksPublic />} />
        <Route path="/discover/podcasts" element={<PodcastsPublic />} />
        {/* Book detail - accessible to all users */}
        <Route path="/library/books/:externalId" element={<BookDetail />} />
        {/* Preferences form - now at root home after registration */}
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
        <Route path="/onboarding/preferences" element={<PreferencesSignupForm />} />
        <Route path="/library" element={<LibraryLayout />}>
          <Route path="digital-books" element={<DigitalBooks />} />
          <Route path="audiobooks" element={<Audiobooks />} />
          <Route path="podcasts" element={<Podcasts />} />
          {/* Route pour les détails d'un livre numérique interne */}
          <Route path="digital-books/:id" element={<DigitalBookDetail />} />
        </Route>
      </Route>

      {/* ================= FALLBACK ================= */}
      <Route path="*" element={<Navigate to="/" replace />} />

    </Routes>
  )
}
