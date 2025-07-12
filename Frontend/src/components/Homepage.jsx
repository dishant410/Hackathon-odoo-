import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchPublicUsers, searchUsersBySkill, clearSearchResults } from '../redux/userSlice';
import Navbar from './Navbar';
import UserCard from './UserCard';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Search, Users, TrendingUp, Star } from 'lucide-react';

export function Homepage() {
    const dispatch = useDispatch();
    // Fix: fallback to empty object if state.user is null
    const userState = useSelector((state) => state.user) || {};
    const { publicUsers = [], searchResults = [], loading = false } = userState;
    const { authUser } = useSelector((state) => state.auth);
    const [searchTerm, setSearchTerm] = useState('');
    const [showSearchResults, setShowSearchResults] = useState(false);

    useEffect(() => {
        dispatch(fetchPublicUsers());
    }, [dispatch]);

    const handleSearch = (e) => {
        e.preventDefault();
        if (searchTerm.trim()) {
            dispatch(searchUsersBySkill(searchTerm));
            setShowSearchResults(true);
        }
    };

    const handleClearSearch = () => {
        setSearchTerm('');
        setShowSearchResults(false);
        dispatch(clearSearchResults());
    };

    const displayUsers = showSearchResults ? searchResults : publicUsers;

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
            <Navbar />

            {/* Hero Section */}
            <div className="container mx-auto px-4 py-12">
                <div className="text-center mb-12">
                    <h1 className="text-5xl font-bold text-gray-900 mb-4">
                        Welcome to Skill Swap Platform
                    </h1>
                    <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
                        Connect with people who have the skills you need and offer your expertise in return.
                        Build meaningful relationships while learning and growing together.
                    </p>

                    {/* Search Bar */}
                    <div className="max-w-md mx-auto mb-8">
                        <form onSubmit={handleSearch} className="flex gap-2">
                            <Input
                                type="text"
                                placeholder="Search for skills (e.g., Photoshop, Excel, JavaScript)"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="flex-1"
                            />
                            <Button type="submit" disabled={loading}>
                                <Search className="w-4 h-4" />
                            </Button>
                        </form>
                        {showSearchResults && (
                            <Button
                                variant="outline"
                                onClick={handleClearSearch}
                                className="mt-2"
                            >
                                Clear Search
                            </Button>
                        )}
                    </div>
                </div>

                {/* Stats Section */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                    <div className="bg-white rounded-lg p-6 shadow-md text-center">
                        <Users className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                        <h3 className="text-2xl font-bold text-gray-900">{publicUsers.length}</h3>
                        <p className="text-gray-600">Active Users</p>
                    </div>
                    <div className="bg-white rounded-lg p-6 shadow-md text-center">
                        <TrendingUp className="w-8 h-8 text-green-600 mx-auto mb-2" />
                        <h3 className="text-2xl font-bold text-gray-900">100+</h3>
                        <p className="text-gray-600">Skills Exchanged</p>
                    </div>
                    <div className="bg-white rounded-lg p-6 shadow-md text-center">
                        <Star className="w-8 h-8 text-yellow-600 mx-auto mb-2" />
                        <h3 className="text-2xl font-bold text-gray-900">4.8</h3>
                        <p className="text-gray-600">Average Rating</p>
                    </div>
                </div>

                {/* Users Section */}
                <div className="mb-8">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-3xl font-bold text-gray-900">
                            {showSearchResults ? 'Search Results' : 'Available Users'}
                        </h2>
                        {showSearchResults && (
                            <p className="text-gray-600">
                                Found {searchResults.length} user{searchResults.length !== 1 ? 's' : ''}
                            </p>
                        )}
                    </div>

                    {loading ? (
                        <div className="text-center py-12">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                            <p className="mt-4 text-gray-600">Loading users...</p>
                        </div>
                    ) : displayUsers.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {displayUsers.map((user) => (
                                <UserCard key={user._id} user={user} />
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-12">
                            <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                            <h3 className="text-xl font-semibold text-gray-900 mb-2">
                                {showSearchResults ? 'No users found' : 'No users available'}
                            </h3>
                            <p className="text-gray-600">
                                {showSearchResults
                                    ? 'Try searching for a different skill or browse all users.'
                                    : 'Be the first to join our platform!'
                                }
                            </p>
                        </div>
                    )}
                </div>

                {/* Call to Action */}
                {!authUser && (
                    <div className="text-center py-12 bg-white rounded-lg shadow-md">
                        <h3 className="text-2xl font-bold text-gray-900 mb-4">
                            Ready to start swapping skills?
                        </h3>
                        <p className="text-gray-600 mb-6">
                            Join our community and start connecting with people who can help you learn and grow.
                        </p>
                        <div className="flex gap-4 justify-center">
                            <Button size="lg" asChild>
                                <a href="/register">Get Started</a>
                            </Button>
                            <Button variant="outline" size="lg" asChild>
                                <a href="/login">Sign In</a>
                            </Button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
