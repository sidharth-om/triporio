"use client";
import AdminLayout from '../../views/admin/AdminLayout';
import { AdminRoute } from '../../components/common/ProtectedRoute';

export default function AdminLayoutWrapper({ children }) {
  return (
    <AdminRoute>
      <AdminLayout>{children}</AdminLayout>
    </AdminRoute>
  );
}
