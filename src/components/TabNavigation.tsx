'use client';

import React from 'react';

type TabNavigationProps = {
  activeTab: 'manual' | 'api';
  onTabChange: (tab: 'manual' | 'api') => void;
};

export default function TabNavigation({ activeTab, onTabChange }: TabNavigationProps) {
  return (
    <div className="flex justify-center p-1 mb-6">
      <div className="flex space-x-2 rounded-lg bg-secondary p-1.5">
        <button
          className={`w-full rounded-md px-4 py-2 text-sm font-medium transition-all ${
            activeTab === 'manual'
              ? 'bg-primary text-primary-foreground shadow-md'
              : 'text-muted-foreground hover:bg-background/50'
          }`}
          onClick={() => onTabChange('manual')}
        >
          Calcul Manuel
        </button>
        <button
          className={`w-full rounded-md px-4 py-2 text-sm font-medium transition-all ${
            activeTab === 'api'
              ? 'bg-primary text-primary-foreground shadow-md'
              : 'text-muted-foreground hover:bg-background/50'
          }`}
          onClick={() => onTabChange('api')}
        >
          Cotes en Direct
        </button>
      </div>
    </div>
  );
}

