import { createBrowserRouter } from 'react-router-dom'
import { AppLayout } from '@/components/layout/AppLayout'
import { ProtectedRoute } from './ProtectedRoute'
import { LoginPage } from '@/modules/auth/pages/LoginPage'
import { WaitingApprovalPage } from '@/modules/auth/pages/WaitingApprovalPage'
import { AdminPage } from '@/modules/admin/pages/AdminPage'
import { TournamentsPage } from '@/modules/fifa/pages/TournamentsPage'
import { TournamentDetailPage } from '@/modules/fifa/pages/TournamentDetailPage'
import { CreateTournamentPage } from '@/modules/fifa/pages/CreateTournamentPage'
import { HeadToHeadPage } from '@/modules/fifa/pages/HeadToHeadPage'
import { ProfilePage } from '@/modules/profile/pages/ProfilePage'

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
        path: '/tournaments/new',
        element: (
          <ProtectedRoute requiredRole="ADMIN">
            <CreateTournamentPage />
          </ProtectedRoute>
        ),
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
        path: '/profile',
        element: <ProfilePage />,
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
