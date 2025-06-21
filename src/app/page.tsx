'use client';

import React, { useState, useEffect } from 'react';
import TabNavigation from '@/components/TabNavigation';
import ManualArbitrage from '@/components/ManualArbitrage';
import ArbitrageOpportunities from '@/components/ArbitrageOpportunities';

interface Sport {
  group: string;
}

export default function Home() {
  const [activeTab, setActiveTab] = useState<'manual' | 'api'>('manual');
  const [sportGroups, setSportGroups] = useState<string[]>([]);
  const [selectedSportGroup, setSelectedSportGroup] = useState('');
  const [selectedBookmaker, setSelectedBookmaker] = useState('');

  useEffect(() => {
    const fetchSports = async () => {
      try {
        const response = await fetch('/api/sports');
        const availableSports: Sport[] = await response.json();
        const uniqueGroups = Array.from(new Set(availableSports.map(s => s.group))).sort();
        setSportGroups(uniqueGroups);
      } catch (error) {
        console.error("Impossible de charger les groupes de sports :", error);
      }
    };
    fetchSports();
  }, []);

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
                Recherche d'opportunités
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-muted-foreground mb-1">
                    Sport
                  </label>
                  <select
                    value={selectedSportGroup}
                    onChange={(e) => setSelectedSportGroup(e.target.value)}
                    className="w-full px-3 py-2 border bg-input rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    <option value="">Sélectionnez un sport</option>
                    {sportGroups.map(group => (
                      <option key={group} value={group}>{group}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-muted-foreground mb-1">
                    Bookmaker
                  </label>
                  <select
                    value={selectedBookmaker}
                    onChange={(e) => setSelectedBookmaker(e.target.value)}
                    className="w-full px-3 py-2 border bg-input rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    <option value="">Tous les bookmakers</option>
                    <optgroup label="🇫🇷 Bookmakers Français">
                      <option value="parionssport_fr">Parions Sport (FR)</option>
                      <option value="winamax_fr">Winamax (FR)</option>
                      <option value="unibet_fr">Unibet (FR)</option>
                      <option value="betclic_fr">Betclic (FR)</option>
                    </optgroup>
                    <optgroup label="🌍 Autres Bookmakers">
                      <option value="winamax_de">Winamax (DE)</option>
                      <option value="unibet_it">Unibet (IT)</option>
                      <option value="unibet_nl">Unibet (NL)</option>
                      <option value="betsson">Betsson</option>
                      <option value="pinnacle">Pinnacle</option>
                      <option value="williamhill">William Hill</option>
                      <option value="sport888">888sport</option>
                      <option value="coolbet">Coolbet</option>
                      <option value="nordicbet">Nordic Bet</option>
                      <option value="tipico_de">Tipico</option>
                      <option value="onexbet">1xBet</option>
                      <option value="gtbets">GTbets</option>
                      <option value="betfair_ex_eu">Betfair</option>
                    </optgroup>
                  </select>
                </div>
              </div>
            </div>
            <ArbitrageOpportunities 
              sportGroup={selectedSportGroup} 
              selectedBookmaker={selectedBookmaker}
            />
          </div>
        )}
      </div>
    </main>
  );
}
