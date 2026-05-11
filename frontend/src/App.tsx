import { Navigate, Route, Routes } from "react-router-dom";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { AppShell } from "./components/layout/AppShell";
import { AdminEditorPage } from "./pages/AdminEditorPage";
import { AdminLoginPage } from "./pages/AdminLoginPage";
import { HomePage } from "./pages/HomePage";
import { PostDetailsPage } from "./pages/PostDetailsPage";

const App = () => {
  return (
    <AppShell>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/post/:slug" element={<PostDetailsPage />} />
        <Route path="/admin" element={<AdminLoginPage />} />
        <Route
          path="/admin/editor"
          element={(
            <ProtectedRoute>
              <AdminEditorPage />
            </ProtectedRoute>
          )}
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AppShell>
  );
};

export default App;
