'use client';

import React from 'react';

type TabNavigationProps = {
  activeTab: 'manual' | 'api';
  onTabChange: (tab: 'manual' | 'api') => void;
};

export default function TabNavigation({ activeTab, onTabChange }: TabNavigationProps) {
  return (
    <div className="flex space-x-1 rounded-xl bg-gray-200 p-1 mb-6">
      <button
        className={`w-full rounded-lg px-3 py-2.5 text-sm font-medium leading-5 ${
          activeTab === 'manual'
            ? 'bg-white text-gray-900 shadow'
            : 'text-gray-700 hover:bg-white/[0.12] hover:text-gray-900'
        }`}
        onClick={() => onTabChange('manual')}
      >
        Calcul Manuel
      </button>
      <button
        className={`w-full rounded-lg px-3 py-2.5 text-sm font-medium leading-5 ${
          activeTab === 'api'
            ? 'bg-white text-gray-900 shadow'
            : 'text-gray-700 hover:bg-white/[0.12] hover:text-gray-900'
        }`}
        onClick={() => onTabChange('api')}
      >
        Cotes en Direct
      </button>
    </div>
  );
}

