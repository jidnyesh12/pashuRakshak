import React, { useState, useEffect } from 'react';
import { Users, Building2, FileText, TrendingUp, Trash2, UserPlus, UserMinus, UserCheck } from 'lucide-react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import NgoManagement from '../../components/admin/NgoManagement';
// import { useAuth } from '../../context/AuthContext';
import { userAPI, reportsAPI, ngoAPI } from '../../utils/api';
import toast from 'react-hot-toast';
import type { User, AnimalReport } from '../../types';

const AdminDashboard: React.FC = () => {
    // const { user } = useAuth();
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState<'overview' | 'ngos' | 'users' | 'reports' | 'ngo-reps'>('overview');
    const [users, setUsers] = useState<User[]>([]);
    const [reports, setReports] = useState<AnimalReport[]>([]);
    const [ngoRepresentatives, setNgoRepresentatives] = useState<User[]>([]);
    const [stats, setStats] = useState({
        totalUsers: 0,
        totalReports: 0,
        totalNgos: 0,
        activeReports: 0
    });

    useEffect(() => {
        loadDashboardData();
    }, []);

    const loadDashboardData = async () => {
        try {
            const [usersData, reportsData, ngosData, ngoRepsData] = await Promise.all([
                userAPI.getAllUsers(),
                reportsAPI.getAllReports(),
                ngoAPI.getAllNgos(),
                userAPI.getPendingNgoRepresentatives()
            ]);

            setUsers(usersData);
            setReports(reportsData);
            setNgoRepresentatives(ngoRepsData);

            setStats({
                totalUsers: usersData.length,
                totalReports: reportsData.length,
                totalNgos: ngosData.length,
                activeReports: reportsData.filter(r => !['CASE_RESOLVED'].includes(r.status)).length
            });
        } catch (error) {
            toast.error('Failed to load dashboard data');
        } finally {
            setLoading(false);
        }
    };

    const handleToggleUserStatus = async (userId: number) => {
        try {
            await userAPI.toggleUserStatus(userId);
            toast.success('User status updated');
            loadDashboardData();
        } catch (error) {
            toast.error('Failed to update user status');
        }
    };

    const handleDeleteUser = async (userId: number) => {
        if (window.confirm('Are you sure you want to delete this user?')) {
            try {
                await userAPI.deleteUser(userId);
                toast.success('User deleted successfully');
                loadDashboardData();
            } catch (error) {
                toast.error('Failed to delete user');
            }
        }
    };

    if (loading) {
        return (
            <DashboardLayout>
                <div className="flex justify-center items-center min-h-[60vh]">
                    <LoadingSpinner size="lg" />
                </div>
            </DashboardLayout>
        );
    }

    return (
        <DashboardLayout>
            <div className="space-y-6">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
                    <p className="text-gray-600 mt-2">Manage users, NGOs, and reports</p>
                </div>

                {/* Tab Navigation */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 mb-6">
                    <div className="flex gap-2 p-2">
                        <button
                            onClick={() => setActiveTab('overview')}
                            className={`flex-1 py-3 px-4 rounded-lg font-medium transition-all flex items-center justify-center gap-2 ${activeTab === 'overview'
                                ? 'bg-teal-500 text-white shadow-md'
                                : 'hover:bg-gray-100 text-gray-600'
                                }`}
                        >
                            <TrendingUp className="w-5 h-5" />
                            Overview
                        </button>
                        <button
                            onClick={() => setActiveTab('ngos')}
                            className={`flex-1 py-3 px-4 rounded-lg font-medium transition-all flex items-center justify-center gap-2 ${activeTab === 'ngos'
                                ? 'bg-teal-500 text-white shadow-md'
                                : 'hover:bg-gray-100 text-gray-600'
                                }`}
                        >
                            <Building2 className="w-5 h-5" />
                            NGOs
                        </button>
                        <button
                            onClick={() => setActiveTab('users')}
                            className={`flex-1 py-3 px-4 rounded-lg font-medium transition-all flex items-center justify-center gap-2 ${activeTab === 'users'
                                ? 'bg-teal-500 text-white shadow-md'
                                : 'hover:bg-gray-100 text-gray-600'
                                }`}
                        >
                            <Users className="w-5 h-5" />
                            Users
                        </button>
                        <button
                            onClick={() => setActiveTab('reports')}
                            className={`flex-1 py-3 px-4 rounded-lg font-medium transition-all flex items-center justify-center gap-2 ${activeTab === 'reports'
                                ? 'bg-teal-500 text-white shadow-md'
                                : 'hover:bg-gray-100 text-gray-600'
                                }`}
                        >
                            <FileText className="w-5 h-5" />
                            Reports
                        </button>
                        <button
                            onClick={() => setActiveTab('ngo-reps')}
                            className={`flex-1 py-3 px-4 rounded-lg font-medium transition-all flex items-center justify-center gap-2 ${activeTab === 'ngo-reps'
                                ? 'bg-teal-500 text-white shadow-md'
                                : 'hover:bg-gray-100 text-gray-600'
                                }`}
                        >
                            <UserCheck className="w-5 h-5" />
                            NGO Reps
                        </button>
                    </div>
                </div>

                {/* Tab Content */}
                {activeTab === 'overview' && (
                    <div className="space-y-6">
                        {/* Stats Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            <StatCard
                                icon={<Users className="w-8 h-8 text-blue-600" />}
                                title="Total Users"
                                value={stats.totalUsers}
                                bgColor="bg-blue-100"
                            />
                            <StatCard
                                icon={<Building2 className="w-8 h-8 text-green-600" />}
                                title="Total NGOs"
                                value={stats.totalNgos}
                                bgColor="bg-green-100"
                            />
                            <StatCard
                                icon={<FileText className="w-8 h-8 text-purple-600" />}
                                title="Total Reports"
                                value={stats.totalReports}
                                bgColor="bg-purple-100"
                            />
                            <StatCard
                                icon={<TrendingUp className="w-8 h-8 text-orange-600" />}
                                title="Active Cases"
                                value={stats.activeReports}
                                bgColor="bg-orange-100"
                            />
                        </div>

                        {/* Quick Info */}
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <button
                                    onClick={() => setActiveTab('ngos')}
                                    className="p-4 rounded-lg border-2 border-gray-200 hover:border-teal-500 transition-all text-left"
                                >
                                    <Building2 className="w-6 h-6 text-teal-600 mb-2" />
                                    <h4 className="font-semibold text-gray-900">Manage NGOs</h4>
                                    <p className="text-sm text-gray-600">Review pending NGO registrations</p>
                                </button>
                                <button
                                    onClick={() => setActiveTab('users')}
                                    className="p-4 rounded-lg border-2 border-gray-200 hover:border-teal-500 transition-all text-left"
                                >
                                    <Users className="w-6 h-6 text-teal-600 mb-2" />
                                    <h4 className="font-semibold text-gray-900">Manage Users</h4>
                                    <p className="text-sm text-gray-600">View and manage user accounts</p>
                                </button>
                                <button
                                    onClick={() => setActiveTab('reports')}
                                    className="p-4 rounded-lg border-2 border-gray-200 hover:border-teal-500 transition-all text-left"
                                >
                                    <FileText className="w-6 h-6 text-teal-600 mb-2" />
                                    <h4 className="font-semibold text-gray-900">View Reports</h4>
                                    <p className="text-sm text-gray-600">Monitor all animal rescue reports</p>
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'ngos' && <NgoManagement />}

                {activeTab === 'users' && (
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200">
                        <div className="p-6">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">User Management</h3>
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead>
                                        <tr className="border-b border-gray-200">
                                            <th className="text-left py-3 px-4 font-semibold text-gray-700">Username</th>
                                            <th className="text-left py-3 px-4 font-semibold text-gray-700">Email</th>
                                            <th className="text-left py-3 px-4 font-semibold text-gray-700">Roles</th>
                                            <th className="text-left py-3 px-4 font-semibold text-gray-700">Status</th>
                                            <th className="text-left py-3 px-4 font-semibold text-gray-700">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {users.map((u) => (
                                            <tr key={u.id} className="border-b border-gray-100 hover:bg-gray-50">
                                                <td className="py-3 px-4">{u.username}</td>
                                                <td className="py-3 px-4">{u.email}</td>
                                                <td className="py-3 px-4">
                                                    <div className="flex gap-1">
                                                        {u.roles.map((role) => (
                                                            <span
                                                                key={role}
                                                                className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full"
                                                            >
                                                                {role}
                                                            </span>
                                                        ))}
                                                    </div>
                                                </td>
                                                <td className="py-3 px-4">
                                                    <span
                                                        className={`px-3 py-1 rounded-full text-xs font-medium ${u.enabled
                                                            ? 'bg-green-100 text-green-800'
                                                            : 'bg-red-100 text-red-800'
                                                            }`}
                                                    >
                                                        {u.enabled ? 'Active' : 'Inactive'}
                                                    </span>
                                                </td>
                                                <td className="py-3 px-4">
                                                    <div className="flex gap-2">
                                                        <button
                                                            onClick={() => handleToggleUserStatus(u.id)}
                                                            className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                                                            title={u.enabled ? 'Disable' : 'Enable'}
                                                        >
                                                            {u.enabled ? (
                                                                <UserMinus className="w-4 h-4 text-orange-600" />
                                                            ) : (
                                                                <UserPlus className="w-4 h-4 text-green-600" />
                                                            )}
                                                        </button>
                                                        <button
                                                            onClick={() => handleDeleteUser(u.id)}
                                                            className="p-2 rounded-lg hover:bg-red-50 transition-colors"
                                                            title="Delete"
                                                        >
                                                            <Trash2 className="w-4 h-4 text-red-600" />
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'reports' && (
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200">
                        <div className="p-6">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">All Animal Reports</h3>
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead>
                                        <tr className="border-b border-gray-200">
                                            <th className="text-left py-3 px-4 font-semibold text-gray-700">Tracking ID</th>
                                            <th className="text-left py-3 px-4 font-semibold text-gray-700">Animal</th>
                                            <th className="text-left py-3 px-4 font-semibold text-gray-700">Location</th>
                                            <th className="text-left py-3 px-4 font-semibold text-gray-700">Status</th>
                                            <th className="text-left py-3 px-4 font-semibold text-gray-700">Reporter</th>
                                            <th className="text-left py-3 px-4 font-semibold text-gray-700">Date</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {reports.map((report) => (
                                            <tr key={report.id} className="border-b border-gray-100 hover:bg-gray-50">
                                                <td className="py-3 px-4 font-mono text-sm">{report.trackingId}</td>
                                                <td className="py-3 px-4">{report.animalType}</td>
                                                <td className="py-3 px-4 text-sm">{report.location || report.address}</td>
                                                <td className="py-3 px-4">
                                                    <span className="px-3 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                                                        {report.status}
                                                    </span>
                                                </td>
                                                <td className="py-3 px-4">{report.reporterName}</td>
                                                <td className="py-3 px-4 text-sm text-gray-600">
                                                    {new Date(report.createdAt).toLocaleDateString()}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'ngo-reps' && (
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200">
                        <div className="p-6">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">NGO Representative Management</h3>
                            <p className="text-sm text-gray-600 mb-4">
                                Pending NGO representatives need admin approval to access the system.
                            </p>
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead>
                                        <tr className="border-b border-gray-200">
                                            <th className="text-left py-3 px-4 font-semibold text-gray-700">Username</th>
                                            <th className="text-left py-3 px-4 font-semibold text-gray-700">Email</th>
                                            <th className="text-left py-3 px-4 font-semibold text-gray-700">Full Name</th>
                                            <th className="text-left py-3 px-4 font-semibold text-gray-700">Phone</th>
                                            <th className="text-left py-3 px-4 font-semibold text-gray-700">Status</th>
                                            <th className="text-left py-3 px-4 font-semibold text-gray-700">Created</th>
                                            <th className="text-left py-3 px-4 font-semibold text-gray-700">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {ngoRepresentatives.length === 0 ? (
                                            <tr>
                                                <td colSpan={7} className="py-8 text-center text-gray-500">
                                                    No pending NGO representatives
                                                </td>
                                            </tr>
                                        ) : (
                                            ngoRepresentatives.map((rep) => (
                                                <tr key={rep.id} className="border-b border-gray-100 hover:bg-gray-50">
                                                    <td className="py-3 px-4">{rep.username}</td>
                                                    <td className="py-3 px-4">{rep.email}</td>
                                                    <td className="py-3 px-4">{rep.fullName}</td>
                                                    <td className="py-3 px-4">{rep.phone || 'N/A'}</td>
                                                    <td className="py-3 px-4">
                                                        <span className="px-3 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
                                                            Pending Approval
                                                        </span>
                                                    </td>
                                                    <td className="py-3 px-4 text-sm text-gray-600">
                                                        {new Date(rep.createdAt).toLocaleDateString()}
                                                    </td>
                                                    <td className="py-3 px-4">
                                                        <button
                                                            onClick={() => handleToggleUserStatus(rep.id)}
                                                            className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors flex items-center gap-2"
                                                            title="Approve and Activate"
                                                        >
                                                            <UserCheck className="w-4 h-4" />
                                                            Approve
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </DashboardLayout>
    );
};

interface StatCardProps {
    icon: React.ReactNode;
    title: string;
    value: number;
    bgColor: string;
}

const StatCard: React.FC<StatCardProps> = ({ icon, title, value, bgColor }) => {
    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center gap-4">
                <div className={`${bgColor} p-3 rounded-lg`}>{icon}</div>
                <div>
                    <p className="text-gray-600 text-sm">{title}</p>
                    <p className="text-2xl font-bold text-gray-900">{value}</p>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;