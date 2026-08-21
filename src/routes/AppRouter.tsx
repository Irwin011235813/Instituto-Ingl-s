import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from '@/context/AuthContext';
import { ProtectedRoute } from './ProtectedRoute';
import { RoleRoute } from './RoleRoute';
import { Sidebar } from '@/components/layout/Sidebar';
import { PublicNavbar } from '@/components/layout/PublicNavbar';
import { Footer } from '@/components/layout/Footer';
import { PublicHomePage } from '@/pages/PublicHomePage';
import { DashboardPage } from '@/pages/DashboardPage';
import { TurnosPage } from '@/pages/TurnosPage';
import { CursosPage } from '@/pages/CursosPage';

function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-paper">
      <Sidebar />
      {/* Margen izquierdo solo en desktop, donde el sidebar es fijo y persistente */}
      <div className="lg:pl-64">{children}</div>
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