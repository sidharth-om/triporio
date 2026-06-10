"use client";
import TripCartPage from '../../../views/TripCartPage';
import { ProtectedRoute } from '../../../components/common/ProtectedRoute';

export default function TripCartRoute() {
  return (
    <ProtectedRoute>
      <TripCartPage />
    </ProtectedRoute>
  );
}
