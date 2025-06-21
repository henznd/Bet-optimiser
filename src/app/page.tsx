'use client';

import React, { useState } from 'react';
import TabNavigation from '@/components/TabNavigation';
import ManualArbitrage from '@/components/ManualArbitrage';
import ArbitrageOpportunities from '@/components/ArbitrageOpportunities';

export default function Home() {
  const [activeTab, setActiveTab] = useState<'manual' | 'api'>('manual');
  const [selectedSport, setSelectedSport] = useState('');
  const [selectedBookmaker, setSelectedBookmaker] = useState('');

  return (
    <main className="min-h-screen bg-background flex flex-col items-center p-4 sm:p-8 md:p-12">
      <div className="w-full max-w-4xl">
        <div className="text-center mb-10">
          <h1 className="text-4xl sm:text-5xl font-extrabold text-primary tracking-tight">
            Bet Optimiser
          </h1>
          <p className="mt-2 text-lg text-muted-foreground">
            Calculateur d'arbitrage pour maximiser vos gains
          </p>
        </div>
        
        <TabNavigation activeTab={activeTab} onTabChange={setActiveTab} />

        {activeTab === 'manual' ? (
          <ManualArbitrage />
        ) : (
          <div>
            <div className="bg-card rounded-xl shadow-lg p-6 mb-6 border">
              <h2 className="text-2xl font-bold mb-6 text-center text-foreground">
                Recherche de cotes en direct
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Sport
                  </label>
                  <select
                    value={selectedSport}
                    onChange={(e) => setSelectedSport(e.target.value)}
                    className="w-full px-3 py-2 border bg-input rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    <option value="">Sélectionnez un sport</option>
                    <option value="soccer_france_ligue_1">Ligue 1</option>
                    <option value="soccer_france_ligue_2">Ligue 2</option>
                    <option value="soccer_uefa_champs_league">Champions League</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Bookmaker
                  </label>
                  <select
                    value={selectedBookmaker}
                    onChange={(e) => setSelectedBookmaker(e.target.value)}
                    className="w-full px-3 py-2 border bg-input rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    <option value="">Sélectionnez un bookmaker</option>
                    <option value="betclic">Betclic</option>
                    <option value="winamax">Winamax</option>
                    <option value="unibet">Unibet</option>
                  </select>
                </div>
              </div>
            </div>
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
