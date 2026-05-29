import { createBrowserRouter } from 'react-router-dom'
import { AppLayout } from '@/components/layout/AppLayout'
import { ProtectedRoute } from './ProtectedRoute'
import { LoginPage } from '@/modules/auth/pages/LoginPage'
import { WaitingApprovalPage } from '@/modules/auth/pages/WaitingApprovalPage'
import { AdminPage } from '@/modules/admin/pages/AdminPage'
import { TournamentsPage } from '@/modules/fifa/pages/TournamentsPage'
import { TournamentDetailPage } from '@/modules/fifa/pages/TournamentDetailPage'
import { HeadToHeadPage } from '@/modules/fifa/pages/HeadToHeadPage'

export const router = createBrowserRouter([
  {
    path: '/login',
    element: <LoginPage />,
  },
  {
    path: '/waiting-approval',
    element: <WaitingApprovalPage />,
  },
  {
    element: (
      <ProtectedRoute>
        <AppLayout />
      </ProtectedRoute>
    ),
    children: [
      {
        path: '/dashboard',
        element: <TournamentsPage />,
      },
      {
        path: '/tournaments/:id',
        element: <TournamentDetailPage />,
      },
      {
        path: '/head-to-head',
        element: <HeadToHeadPage />,
      },
      {
        path: '/admin',
        element: (
          <ProtectedRoute requiredRole="ADMIN">
            <AdminPage />
          </ProtectedRoute>
        ),
      },
    ],
  },
  {
    path: '*',
    element: <LoginPage />,
  },
])
