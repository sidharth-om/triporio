"use client";
import DashboardPage from '../../../views/DashboardPage';
import { ProtectedRoute } from '../../../components/common/ProtectedRoute';

export default function DashboardRoute() {
  return (
    <ProtectedRoute>
      <DashboardPage />
    </ProtectedRoute>
  );
}
