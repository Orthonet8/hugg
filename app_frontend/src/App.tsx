import { Navigate, Route, Routes } from "react-router-dom";
import { ProtectedRoute } from "./components/auth/ProtectedRoute";
import { AppLayout } from "./components/layout/AppLayout";
import { AuthPage } from "./pages/AuthPage";
import { CalendarPage } from "./pages/CalendarPage";
import { FamilyPage } from "./pages/FamilyPage";
import { GoogleAuthCallbackPage } from "./pages/GoogleAuthCallbackPage";
import { LanguagePickerPage } from "./pages/LanguagePickerPage";
import { NewsPage } from "./pages/NewsPage";
import { NotificationsPage } from "./pages/NotificationsPage";
import { ProfilePage } from "./pages/ProfilePage";
import { RegistrationPage } from "./pages/RegistrationPage";
import { SetPasswordPage } from "./pages/SetPasswordPage";
import { useAuthStore } from "./context/useAuthStore";
import { useI18n } from "./i18n/I18nProvider";

function App() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const { languageSelected } = useI18n();

  return (
    <Routes>
      {/* Language picker — first visit only */}
      <Route
        path="/language"
        element={
          languageSelected ? <Navigate to="/login" replace /> : <LanguagePickerPage />
        }
      />

      {/* Public routes */}
      <Route
        path="/login"
        element={
           isAuthenticated
              ? <Navigate to="/news" replace />
              : <AuthPage />
        }
      />
      <Route path="/set-password" element={<SetPasswordPage />} />
      <Route path="/auth/google/callback" element={<GoogleAuthCallbackPage />} />
      <Route path="/register/:stepId" element={<RegistrationPage />} />

      {/* Protected routes — require authentication */}
      <Route element={<ProtectedRoute />}>
        <Route element={<AppLayout />}>
          <Route path="/" element={<Navigate to="/news" replace />} />
          <Route path="/news" element={<NewsPage />} />
          <Route path="/calendar" element={<CalendarPage />} />
          <Route path="/family" element={<FamilyPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/notifications" element={<NotificationsPage />} />
        </Route>
      </Route>

      {/* Catch-all */}
      <Route
        path="*"
        element={
          !languageSelected
            ? <Navigate to="/language" replace />
            : isAuthenticated
              ? <Navigate to="/news" replace />
              : <Navigate to="/login" replace />
        }
      />
    </Routes>
  );
}

export default App;
