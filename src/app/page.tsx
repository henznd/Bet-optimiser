'use client';

import React, { useState, useEffect } from 'react';
import TabNavigation from '@/components/TabNavigation';
import ManualArbitrage from '@/components/ManualArbitrage';
import ArbitrageOpportunities from '@/components/ArbitrageOpportunities';

// Interface pour le typage, à garder synchronisée
interface ArbitrageOpportunity {
  match: any;
  outcomes: any[];
  freebetProfit: number;
  cashArbitrageROI: number | null;
}

export default function Home() {
  const [activeTab, setActiveTab] = useState<'manual' | 'api'>('api');
  const [sportGroups, setSportGroups] = useState<string[]>([]);
  const [selectedSportGroup, setSelectedSportGroup] = useState('soccer');
  const [selectedBookmaker, setSelectedBookmaker] = useState('');
  const [bestOpportunity, setBestOpportunity] = useState<ArbitrageOpportunity | null>(null);
  const [loadingBest, setLoadingBest] = useState(true);
  const [bestOppBookmaker, setBestOppBookmaker] = useState('');

  useEffect(() => {
    async function fetchSports() {
      try {
        const response = await fetch('/api/sports');
        if (response.ok) {
            const data: {group: string}[] = await response.json();
            setSportGroups(Array.from(new Set(data.map((s) => s.group))).sort());
        }
      } catch (error) { console.error("Failed to fetch sports", error); }
    }
    fetchSports();
  }, []);

  useEffect(() => {
    async function fetchBestOpportunity() {
      setLoadingBest(true);
      try {
        const response = await fetch(`/api/best-opportunity?bookmaker=${bestOppBookmaker}`);
        if (response.ok) {
            const data = await response.json();
            setBestOpportunity(data);
        } else {
          setBestOpportunity(null);
        }
      } catch (error) { 
        console.error("Failed to fetch best opportunity", error); 
        setBestOpportunity(null);
      }
      setLoadingBest(false);
    }
    fetchBestOpportunity();
  }, [bestOppBookmaker]);

  return (
    <main className="min-h-screen bg-background flex flex-col items-center p-4 sm:p-8 md:p-12">
      <div className="w-full max-w-4xl">
        <header className="text-center mb-10">
          <h1 className="text-4xl sm:text-5xl font-extrabold text-primary tracking-tight">
            Bet Optimiser
          </h1>
          <p className="mt-2 text-lg text-muted-foreground">
            Trouvez les meilleures opportunités d'arbitrage et optimisez vos mises.
          </p>
        </header>

        <div className="bg-card rounded-xl shadow-lg p-6 mb-8 border border-amber-500/30">
            <h2 className="text-2xl font-bold text-center mb-4 text-amber-500">🔥 Meilleure Opportunité Actuelle</h2>
            <div className="max-w-sm mx-auto mb-6">
              <label className="block text-sm font-medium text-muted-foreground mb-1">
                Filtrer par bookmaker
              </label>
              <select
                  value={bestOppBookmaker}
                  onChange={(e) => setBestOppBookmaker(e.target.value)}
                  className="w-full px-3 py-2 border bg-input rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary"
              >
                  <option value="">Tous les bookmakers</option>
                  <optgroup label="🇫🇷 Bookmakers Français">
                    <option value="parionssport_fr">Parions Sport (FR)</option>
                    <option value="winamax_fr">Winamax (FR)</option>
                    <option value="unibet_fr">Unibet (FR)</option>
                    <option value="betclic_fr">Betclic (FR)</option>
                  </optgroup>
              </select>
            </div>

            {loadingBest ? (
              <div className="text-center p-6"><p className="text-primary animate-pulse">Recherche en cours...</p></div>
            ) : bestOpportunity ? (
                <ArbitrageOpportunities.BestOpportunityCard opportunity={bestOpportunity} onSelect={() => {}} />
            ) : (
              <p className="text-center text-muted-foreground">Aucune opportunité trouvée pour cette sélection.</p>
            )}
        </div>

        <TabNavigation activeTab={activeTab} onTabChange={setActiveTab} />

        {activeTab === 'manual' && <ManualArbitrage />}
        
        {activeTab === 'api' && (
          <div className="mt-6">
            <div className="bg-card rounded-xl shadow-lg p-6 mb-6 border">
              <h2 className="text-2xl font-bold mb-6 text-center text-foreground">
                Rechercher par sport
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
                      <option key={group} value={group}>{group.charAt(0).toUpperCase() + group.slice(1).replace(/_/g, ' ')}</option>
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
