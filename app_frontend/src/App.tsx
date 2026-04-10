import { Navigate, Route, Routes } from "react-router-dom";
import { AppLayout } from "./components/layout/AppLayout";
import { CalendarPage } from "./pages/CalendarPage";
import { FamilyPage } from "./pages/FamilyPage";
import { NewsPage } from "./pages/NewsPage";
import { NotificationsPage } from "./pages/NotificationsPage";
import { ProfilePage } from "./pages/ProfilePage";

function App() {
  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route path="/" element={<Navigate to="/news" replace />} />
        <Route path="/news" element={<NewsPage />} />
        <Route path="/calendar" element={<CalendarPage />} />
        <Route path="/family" element={<FamilyPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/notifications" element={<NotificationsPage />} />
      </Route>
      <Route path="*" element={<Navigate to="/news" replace />} />
    </Routes>
  );
}

export default App;
