'use client';

import React, { useState } from 'react';
import SportSelector from '@/components/SportSelector';
import ArbitrageOpportunities from '@/components/ArbitrageOpportunities';

export default function Home() {
  const [selectedSport, setSelectedSport] = useState('');
  const [selectedBookmaker, setSelectedBookmaker] = useState('');

  return (
    <main className="min-h-screen p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-8">
          Arbitrage Calculator
        </h1>

        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">
            Select Sport and Bookmaker
          </h2>
          <SportSelector
            onSportSelect={setSelectedSport}
            onBookmakerSelect={setSelectedBookmaker}
          />
        </div>

        {selectedSport && (
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-semibold mb-4">
              Arbitrage Opportunities
            </h2>
            <ArbitrageOpportunities
              sportKey={selectedSport}
              selectedBookmaker={selectedBookmaker}
            />
          </div>
        )}
      </div>
    </main>
  );
}
