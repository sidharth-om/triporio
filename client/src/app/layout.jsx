"use client";
import '../index.css';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from '../context/AuthContext';
import { TripProvider } from '../context/TripContext';

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="scroll-smooth" suppressHydrationWarning>
      <body className="bg-[#0a0f1e] text-slate-300 antialiased overflow-x-hidden" suppressHydrationWarning>
        <Toaster 
          position="top-center"
          toastOptions={{
            style: {
              background: '#1e293b',
              color: '#fff',
              borderRadius: '12px',
              border: '1px solid rgba(255,255,255,0.1)',
            },
            success: { iconTheme: { primary: '#22c55e', secondary: '#fff' } },
          }}
        />
        <AuthProvider>
          <TripProvider>
            {children}
          </TripProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
