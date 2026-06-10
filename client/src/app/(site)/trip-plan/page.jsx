"use client";
import TripPlanPage from '../../../views/TripPlanPage';
import { ProtectedRoute } from '../../../components/common/ProtectedRoute';

export default function TripPlanRoute() {
  return (
    <ProtectedRoute>
      <TripPlanPage />
    </ProtectedRoute>
  );
}
