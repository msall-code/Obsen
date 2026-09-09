import React from 'react';
import ListUser from '../../components/Users/ListUser';

export default function AdminDashboard() {
    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold text-gray-800">Administration du Système</h1>
            <ListUser />
        </div>
    );
}