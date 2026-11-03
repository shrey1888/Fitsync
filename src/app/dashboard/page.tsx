'use client';

import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import UserDashboard from '@/components/dashboard/UserDashboard';

export default function DashboardPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#FAF9F6]">
      <Navbar />

      <main className="flex-1 py-12 sm:py-16 px-4 sm:px-6 lg:px-8">
        <UserDashboard />
      </main>

      <Footer />
    </div>
  );
}
