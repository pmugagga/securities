import React from 'react';
import { TrendingUp, Shield, Users } from 'lucide-react';

interface HeaderProps {
  onToggleAdmin: () => void;
  isAdminMode: boolean;
}

export const Header: React.FC<HeaderProps> = ({ onToggleAdmin, isAdminMode }) => {
  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <div className="flex items-center space-x-2">
              <Shield className="w-8 h-8 text-blue-600" />
              <h1 className="text-xl font-bold text-gray-900">Uganda Securities</h1>
            </div>
          </div>
          
          <nav className="hidden md:flex items-center space-x-8">
            <div className="flex items-center space-x-1 text-gray-600">
              <TrendingUp className="w-4 h-4" />
              <span className="text-sm">Government Securities</span>
            </div>
            <div className="flex items-center space-x-1 text-gray-600">
              <Users className="w-4 h-4" />
              <span className="text-sm">Trusted by 1000+ Investors</span>
            </div>
          </nav>

          <button
            onClick={onToggleAdmin}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              isAdminMode
                ? 'bg-red-100 text-red-700 hover:bg-red-200'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {isAdminMode ? 'Exit Admin' : 'Admin Panel'}
          </button>
        </div>
      </div>
    </header>
  );
};