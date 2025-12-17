'use client';

import { useEffect, useState } from 'react';
import DashboardLayout from '@/components/dashboard/sidebar';
import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Analytics from '@/components/dashboard/analytics';
import { UsersLoading } from '@/components/dashboard/users-loading';
import {
  Calendar,
  Users as UsersIcon,
  CreditCard,
  MapPin,
  Clock,
  CheckCircle,
  XCircle,
} from 'lucide-react';
import Link from 'next/link';

interface User {
  _id: string;
  fullName: string;
  email: string;
  phone: string;
  role: string;
  status: 'active' | 'inactive' | 'pending';
  createdAt: string;
  updatedAt: string;
}

interface Booking {
  _id: string;
  user: {
    name: string;
    email: string;
  };
  tour: {
    title: string;
    destination: string;
    price: number;
  };
  travelers: number;
  totalAmount: number;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  paymentStatus: 'pending' | 'paid' | 'refunded' | 'failed' | 'on-demand';
  createdAt: string;
}

interface ManagerDashboardProps {
  params: {
    id: string;
  };
}

export default function ManagerDashboard({ params }: ManagerDashboardProps) {
  const [users, setUsers] = useState<User[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  const router = useRouter();
  const { data: session, status: sessionStatus } = useSession();

  useEffect(() => {
    if (sessionStatus === 'loading') return;

    if (!session?.user || (session.user as any).role !== 'manager') {
      router.push('/');
      return;
    }

    fetchData();
  }, [session, sessionStatus, router]);

  const fetchData = async () => {
    try {
      const [usersResponse, bookingsResponse] = await Promise.all([
        fetch('/api/users', { cache: 'no-store' }),
        fetch('/api/admin/bookings', { cache: 'no-store' }),
      ]);

      const usersData = await usersResponse.json();
      const bookingsData = await bookingsResponse.json();

      if (usersData.success) setUsers(usersData.data || []);
      if (bookingsData.success) setBookings(bookingsData.data || []);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const userStats = {
    total: users.length,
    active: users.filter((u) => u.status === 'active').length,
    inactive: users.filter((u) => u.status === 'inactive').length,
    pending: users.filter((u) => u.status === 'pending').length,
  };

  const bookingStats = {
    total: bookings.length,
    confirmed: bookings.filter((b) => b.status === 'confirmed').length,
    pending: bookings.filter((b) => b.status === 'pending').length,
    completed: bookings.filter((b) => b.status === 'completed').length,
    cancelled: bookings.filter((b) => b.status === 'cancelled').length,
    totalRevenue: bookings
      .filter((b) => b.paymentStatus === 'paid')
      .reduce((sum, b) => sum + b.totalAmount, 0),
    totalTravelers: bookings
      .filter((b) => b.status !== 'cancelled')
      .reduce((sum, b) => sum + b.travelers, 0),
  };

  const recentBookings = [...bookings]
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() -
        new Date(a.createdAt).getTime()
    )
    .slice(0, 5);

  if (loading || sessionStatus === 'loading') {
    return <UsersLoading />;
  }

  if (!session || (session.user as any)?.role !== 'manager') {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-100">
        <div className="text-center p-8 bg-white shadow-lg rounded-lg">
          <h1 className="text-2xl font-bold text-red-600 mb-4">
            You are not authorized to access this dashboard
          </h1>
          <p className="text-gray-700 mb-6">
            You do not have permissions to access this dashboard.
          </p>
          <button
            onClick={() => signOut({ callbackUrl: '/' })}
            className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Logout and return to the home page
          </button>
        </div>
      </div>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
            Manager Dashboard
          </h1>
          <Link
            href={`/dashboard/${params.id}/bookings`}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-center"
          >
            Bookings Management
          </Link>
        </div>

        {/* User Statistics */}
        <div>
          <h2 className="text-lg font-semibold mb-4">User Statistics</h2>
          <Analytics
            active={userStats.active}
            total={userStats.total}
            inactive={userStats.inactive}
            pending={userStats.pending}
          />
        </div>

        {/* Booking Statistics */}
        <div>
          <h2 className="text-lg font-semibold mb-4">Booking Statistics</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatCard
              icon={<Calendar className="text-blue-600" />}
              label="Total Bookings"
              value={bookingStats.total}
            />
            <StatCard
              icon={<CheckCircle className="text-green-600" />}
              label="Confirmed Bookings"
              value={bookingStats.confirmed}
            />
            <StatCard
              icon={<Clock className="text-yellow-600" />}
              label="Pending Bookings"
              value={bookingStats.pending}
            />
            <StatCard
              icon={<CreditCard className="text-green-600" />}
              label="Total Revenue"
              value={`${bookingStats.totalRevenue.toLocaleString()} Dollars`}
            />
          </div>
        </div>

        {/* Additional Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <StatCard
            icon={<UsersIcon className="text-purple-600" />}
            label="Total Travelers"
            value={bookingStats.totalTravelers}
          />
          <StatCard
            icon={<XCircle className="text-red-600" />}
            label="Cancelled Bookings"
            value={bookingStats.cancelled}
          />
        </div>

        {/* Recent Bookings */}
        <div className="bg-white rounded-lg shadow-sm border">
          <div className="px-6 py-4 border-b flex justify-between">
            <h3 className="text-lg font-semibold">Recent Bookings</h3>
            <button
              onClick={() =>
                router.push(`/dashboard/${params.id}/bookings`)
              }
              className="text-blue-600 hover:underline text-sm"
            >
              Show All
            </button>
          </div>
          <div className="p-6">
            {recentBookings.length === 0 ? (
              <p className="text-gray-500 text-center">
                No recent bookings found
              </p>
            ) : (
              <div className="space-y-4">
                {recentBookings.map((booking) => (
                  <div
                    key={booking._id}
                    className="flex justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 cursor-pointer"
                    onClick={() =>
                      window.open(
                        `/booking-confirmation/${booking._id}`,
                        '_blank'
                      )
                    }
                  >
                    <div className="flex items-center gap-3">
                      <MapPin className="text-blue-600" />
                      <div>
                        <p className="font-medium">
                          {booking.tour.title}
                        </p>
                        <p className="text-sm text-gray-500">
                          {booking.user.name} •{' '}
                          {booking.travelers} People
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">
                        {booking.totalAmount.toLocaleString()} Dollars
                      </p>
                      <p className="text-sm text-gray-500">
                        {new Date(
                          booking.createdAt
                        ).toLocaleDateString('en-US')}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

function StatCard({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: any;
}) {
  return (
    <div className="bg-white rounded-lg shadow-sm border p-6 flex items-center gap-3">
      <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
        {icon}
      </div>
      <div>
        <p className="text-sm text-gray-600">{label}</p>
        <p className="text-xl font-bold">{value}</p>
      </div>
    </div>
  );
}
