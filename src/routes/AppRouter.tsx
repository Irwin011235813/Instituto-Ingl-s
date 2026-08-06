import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from '@/context/AuthContext';
import { ProtectedRoute } from './ProtectedRoute';
import { RoleRoute } from './RoleRoute';
import { Navbar } from '@/components/layout/Navbar';
import { PublicNavbar } from '@/components/layout/PublicNavbar';
import { Footer } from '@/components/layout/Footer';
import { AdminFooter } from '@/components/layout/AdminFooter';
import { PublicHomePage } from '@/pages/PublicHomePage';
import { DashboardPage } from '@/pages/DashboardPage';
import { TurnosPage } from '@/pages/TurnosPage';
import { CursosPage } from '@/pages/CursosPage';

function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">{children}</main>
      <AdminFooter />
    </div>
  );
}

function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col">
      <PublicNavbar />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}

export function AppRouter() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Landing pública: identidad lúdica, visible sin sesión iniciada */}
          <Route
            path="/"
            element={
              <PublicLayout>
                <PublicHomePage />
              </PublicLayout>
            }
          />

          {/* Panel interno: identidad sobria, requiere sesión */}
          <Route
            path="/panel"
            element={
              <ProtectedRoute>
                <AppLayout>
                  <DashboardPage />
                </AppLayout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/turnos"
            element={
              <ProtectedRoute>
                <AppLayout>
                  <TurnosPage />
                </AppLayout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/cursos"
            element={
              <ProtectedRoute>
                <AppLayout>
                  <RoleRoute rolesPermitidos={['admin', 'profesor']}>
                    <CursosPage />
                  </RoleRoute>
                </AppLayout>
              </ProtectedRoute>
            }
          />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
