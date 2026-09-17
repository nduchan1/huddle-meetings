import { HashRouter, Route, Routes } from 'react-router'
import { Layout } from './components/Layout'
import { ToastProvider } from './components/Toast'
import { AboutPage } from './pages/AboutPage'
import { EditMeetingPage } from './pages/EditMeetingPage'
import { HomePage } from './pages/HomePage'
import { MeetingsPage } from './pages/MeetingsPage'
import { NewMeetingPage } from './pages/NewMeetingPage'
import { NotFoundPage } from './pages/NotFoundPage'

export default function App() {
  return (
    <HashRouter>
      <ToastProvider>
        <Routes>
          <Route element={<Layout />}>
            <Route index element={<HomePage />} />
            <Route path="meetings" element={<MeetingsPage />} />
            <Route path="meetings/new" element={<NewMeetingPage />} />
            <Route path="meetings/:id/edit" element={<EditMeetingPage />} />
            <Route path="about" element={<AboutPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Route>
        </Routes>
      </ToastProvider>
    </HashRouter>
  )
}
