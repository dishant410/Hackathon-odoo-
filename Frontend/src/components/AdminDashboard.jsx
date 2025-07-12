import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import {
    Users,
    TrendingUp,
    Star,
    Activity,
    Shield,
    MessageSquare,
    BarChart3,
    Settings,
    ArrowLeft
} from 'lucide-react';
import { toast } from 'sonner';
import { useNavigate } from "react-router-dom";

const AdminDashboard = () => {
    const { authUser } = useSelector((state) => state.auth);
    const [activeTab, setActiveTab] = useState('overview');
    const [stats, setStats] = useState({
        users: { total: 0, active: 0, banned: 0 },
        swaps: { total: 0, pending: 0, accepted: 0, rejected: 0 },
        feedback: { total: 0, averageRating: 0 }
    });
    const [activityLogs, setActivityLogs] = useState([]);
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();

    useEffect(() => {
        if (authUser?.isAdmin) {
            fetchStats();
            fetchActivityLogs();
            fetchUsers();
        }
    }, [authUser]);

    const fetchStats = async () => {
        try {
            const response = await fetch('http://localhost:8080/api/v1/admin/stats', {
                headers: {
                    'Authorization': `Bearer ${authUser?.token}`
                }
            });
            const data = await response.json();
            setStats(data);
        } catch (error) {
            console.error('Failed to fetch stats:', error);
        }
    };

    const fetchActivityLogs = async () => {
        try {
            const response = await fetch('http://localhost:8080/api/v1/admin/activity-logs', {
                headers: {
                    'Authorization': `Bearer ${authUser?.token}`
                }
            });
            const data = await response.json();
            setActivityLogs(data.logs || []);
        } catch (error) {
            console.error('Failed to fetch activity logs:', error);
        }
    };

    const fetchUsers = async () => {
        try {
            const response = await fetch('http://localhost:8080/api/v1/user/all', {
                headers: {
                    'Authorization': `Bearer ${authUser?.token}`
                }
            });
            const data = await response.json();
            setUsers(data);
        } catch (error) {
            console.error('Failed to fetch users:', error);
        }
    };

    const handleBanUser = async (userId) => {
        try {
            setLoading(true);
            const response = await fetch(`http://localhost:8080/api/v1/user/ban/${userId}`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${authUser?.token}`
                }
            });

            if (response.ok) {
                toast.success('User banned successfully');
                fetchUsers();
                fetchStats();
            } else {
                toast.error('Failed to ban user');
            }
        } catch (error) {
            toast.error('Failed to ban user');
        } finally {
            setLoading(false);
        }
    };

    const handleUnbanUser = async (userId) => {
        try {
            setLoading(true);
            const response = await fetch(`http://localhost:8080/api/v1/user/unban/${userId}`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${authUser?.token}`
                }
            });

            if (response.ok) {
                toast.success('User unbanned successfully');
                fetchUsers();
                fetchStats();
            } else {
                toast.error('Failed to unban user');
            }
        } catch (error) {
            toast.error('Failed to unban user');
        } finally {
            setLoading(false);
        }
    };

    if (!authUser?.isAdmin) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
                <div className="text-center">
                    <Shield className="w-16 h-16 text-red-500 mx-auto mb-4" />
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">Access Denied</h2>
                    <p className="text-gray-600 mb-6">You don't have admin privileges to view this page.</p>
                    <Button asChild>
                        <a href="/">Back to Home</a>
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
            {/* Header */}
            <div className="bg-white shadow-sm border-b">
                <div className="container mx-auto px-4 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <Button variant="ghost" asChild>
                                <a href="/">
                                    <ArrowLeft className="w-4 h-4 mr-2" />
                                    Back to Home
                                </a>
                            </Button>
                            <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
                        </div>
                        <div className="flex items-center gap-2">
                            <Shield className="w-5 h-5 text-blue-600" />
                            <span className="text-sm text-gray-600">Admin Panel</span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-4 py-8">
                {/* Tab Navigation */}
                <div className="flex gap-1 bg-white rounded-lg p-1 mb-8 shadow-sm">
                    <button
                        onClick={() => setActiveTab('overview')}
                        className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${activeTab === 'overview'
                            ? 'bg-blue-600 text-white'
                            : 'text-gray-600 hover:text-gray-900'
                            }`}
                    >
                        <BarChart3 className="w-4 h-4 inline mr-2" />
                        Overview
                    </button>
                    <button
                        onClick={() => setActiveTab('users')}
                        className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${activeTab === 'users'
                            ? 'bg-blue-600 text-white'
                            : 'text-gray-600 hover:text-gray-900'
                            }`}
                    >
                        <Users className="w-4 h-4 inline mr-2" />
                        Users
                    </button>
                    <button
                        onClick={() => setActiveTab('activity')}
                        className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${activeTab === 'activity'
                            ? 'bg-blue-600 text-white'
                            : 'text-gray-600 hover:text-gray-900'
                            }`}
                    >
                        <Activity className="w-4 h-4 inline mr-2" />
                        Activity Logs
                    </button>
                </div>

                {activeTab === 'overview' && (
                    /* Overview Tab */
                    <div className="space-y-6">
                        {/* Stats Cards */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="bg-white rounded-xl p-6 shadow-lg">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm font-medium text-gray-600">Total Users</p>
                                        <p className="text-3xl font-bold text-gray-900">{stats.users.total}</p>
                                        <p className="text-sm text-green-600">{stats.users.active} active</p>
                                    </div>
                                    <Users className="w-12 h-12 text-blue-600" />
                                </div>
                            </div>

                            <div className="bg-white rounded-xl p-6 shadow-lg">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm font-medium text-gray-600">Total Swaps</p>
                                        <p className="text-3xl font-bold text-gray-900">{stats.swaps.total}</p>
                                        <p className="text-sm text-yellow-600">{stats.swaps.pending} pending</p>
                                    </div>
                                    <TrendingUp className="w-12 h-12 text-green-600" />
                                </div>
                            </div>

                            <div className="bg-white rounded-xl p-6 shadow-lg">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm font-medium text-gray-600">Average Rating</p>
                                        <p className="text-3xl font-bold text-gray-900">{stats.feedback.averageRating.toFixed(1)}</p>
                                        <p className="text-sm text-blue-600">{stats.feedback.total} reviews</p>
                                    </div>
                                    <Star className="w-12 h-12 text-yellow-600" />
                                </div>
                            </div>
                        </div>

                        {/* Quick Actions */}
                        <div className="bg-white rounded-xl shadow-lg p-6">
                            <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <Button className="bg-blue-600 hover:bg-blue-700">
                                    <MessageSquare className="w-4 h-4 mr-2" />
                                    Send Platform Message
                                </Button>
                                <Button variant="outline">
                                    <Settings className="w-4 h-4 mr-2" />
                                    Platform Settings
                                </Button>
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'users' && (
                    /* Users Tab */
                    <div className="bg-white rounded-xl shadow-lg p-6">
                        <h3 className="text-lg font-semibold mb-6">User Management</h3>

                        {loading ? (
                            <div className="text-center py-8">
                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                                <p className="mt-2 text-gray-600">Loading users...</p>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {users.map((user) => (
                                    <div key={user._id} className="border rounded-lg p-4 flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center text-white font-semibold">
                                                {user.name?.charAt(0)?.toUpperCase() || 'U'}
                                            </div>
                                            <div>
                                                <h4 className="font-medium">{user.name}</h4>
                                                <p className="text-sm text-gray-600">{user.email}</p>
                                                <p className="text-xs text-gray-500">
                                                    Joined: {new Date(user.createdAt).toLocaleDateString()}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-2">
                                            {user.isBanned ? (
                                                <span className="px-2 py-1 bg-red-100 text-red-800 text-xs rounded-full">Banned</span>
                                            ) : (
                                                <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">Active</span>
                                            )}

                                            {user.isBanned ? (
                                                <Button
                                                    size="sm"
                                                    onClick={() => handleUnbanUser(user._id)}
                                                    disabled={loading}
                                                    className="bg-green-600 hover:bg-green-700"
                                                >
                                                    Unban
                                                </Button>
                                            ) : (
                                                <Button
                                                    size="sm"
                                                    variant="outline"
                                                    onClick={() => handleBanUser(user._id)}
                                                    disabled={loading}
                                                >
                                                    Ban
                                                </Button>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}

                {activeTab === 'activity' && (
                    /* Activity Logs Tab */
                    <div className="bg-white rounded-xl shadow-lg p-6">
                        <h3 className="text-lg font-semibold mb-6">Activity Logs</h3>

                        <div className="space-y-4">
                            {activityLogs.length === 0 ? (
                                <p className="text-gray-500 text-center py-8">No activity logs found</p>
                            ) : (
                                activityLogs.map((log) => (
                                    <div key={log._id} className="border rounded-lg p-4">
                                        <div className="flex items-center justify-between mb-2">
                                            <div className="flex items-center gap-2">
                                                <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                                                    {log.action}
                                                </span>
                                                <span className="text-sm text-gray-600">
                                                    {new Date(log.createdAt).toLocaleString()}
                                                </span>
                                            </div>
                                        </div>

                                        <div className="text-sm">
                                            <p><strong>User:</strong> {log.user?.name || 'Unknown'}</p>
                                            {log.targetUser && (
                                                <p><strong>Target:</strong> {log.targetUser?.name || 'Unknown'}</p>
                                            )}
                                            {log.details && (
                                                <p><strong>Details:</strong> {log.details}</p>
                                            )}
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminDashboard; 