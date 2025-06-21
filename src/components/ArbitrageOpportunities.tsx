'use client';

import React, { useState, useEffect } from 'react';

interface Outcome {
  name: string;
  price: number;
}

interface Bookmaker {
  key: string;
  title: string;
  markets: {
    key: 'h2h';
    outcomes: Outcome[];
  }[];
}

interface Match {
  id: string;
  sport_title: string;
  home_team: string;
  away_team: string;
  commence_time: string;
  bookmakers: Bookmaker[];
}

interface ArbitrageOpportunity {
  match: any; // Simplifié pour la démo
  outcomes: {
    name: string;
    price: number;
    bookmaker: string;
  }[];
  freebetProfit: number;
  cashArbitrageROI: number | null;
}

interface BetDistribution {
  cashStakes: number[];
  freebetStakes: number[];
  totalProfit: number;
}

const BOOKMAKER_PRIORITY = 'parionssport_fr'; // "Parions Sport"

// Composant pour calculer la répartition des mises
function BetCalculator({ opportunity, onClose }: { opportunity: ArbitrageOpportunity; onClose: () => void }) {
  const [cashAmount, setCashAmount] = useState<number>(0);
  const [freebetAmount, setFreebetAmount] = useState<number>(10);
  const [distribution, setDistribution] = useState<BetDistribution | null>(null);

  const calculateDistribution = () => {
    const { outcomes } = opportunity;
    const C = outcomes.map(o => o.price);
    const n = outcomes.length;

    let cashStakes = Array(n).fill(0), cashProfit = 0;
    let freebetStakes = Array(n).fill(0), freebetProfit = 0;

    if (cashAmount > 0) {
      const invC = C.map(c => 1 / c);
      const sumInvC = invC.reduce((a, b) => a + b, 0);
      const totalReturn = cashAmount / sumInvC;
      cashProfit = totalReturn - cashAmount;
      cashStakes = C.map(c => totalReturn / c);
    }

    if (freebetAmount > 0) {
      const A = C.map(c => c - 1);
      if (A.every(a => a > 0)) {
        const invA = A.map(a => 1 / a);
        const sumInvA = invA.reduce((a, b) => a + b, 0);
        freebetProfit = freebetAmount / sumInvA;
        freebetStakes = A.map(a => freebetProfit / a);
      }
    }
    
    setDistribution({
      cashStakes,
      freebetStakes,
      totalProfit: cashProfit + freebetProfit,
    });
  };

  useEffect(() => {
    calculateDistribution();
  }, [cashAmount, freebetAmount, opportunity]);

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-card rounded-xl shadow-2xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto border">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold">Calculateur de répartition</h2>
          <button
            onClick={onClose}
            className="text-muted-foreground hover:text-foreground"
          >
            ✕
          </button>
        </div>

        <div className="mb-4">
          <h3 className="font-semibold mb-2">{opportunity.match.home_team} vs {opportunity.match.away_team}</h3>
          <div className="grid grid-cols-3 gap-2 text-sm">
            {opportunity.outcomes.map((outcome, index) => (
              <div key={index} className="bg-secondary p-2 rounded text-center">
                <div className="font-medium">{outcome.name}</div>
                <div className="text-primary font-bold">{outcome.price.toFixed(2)}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-6">
          <div>
            <label className="block text-sm font-medium mb-1">Montant Cash (€)</label>
            <input
              type="number"
              value={cashAmount}
              onChange={(e) => setCashAmount(Number(e.target.value))}
              className="w-full px-3 py-2 border bg-input rounded-md"
              min="0"
              step="10"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Montant Freebet (€)</label>
            <input
              type="number"
              value={freebetAmount}
              onChange={(e) => setFreebetAmount(Number(e.target.value))}
              className="w-full px-3 py-2 border bg-input rounded-md"
              min="0"
              step="10"
            />
          </div>
        </div>

        {distribution && (
          <div className="space-y-4 pt-4">
            <div className="bg-primary/5 border border-primary/20 rounded-lg p-4">
              <h4 className="font-bold text-primary mb-2 text-center">📊 Répartition des mises</h4>
              <div className={`grid grid-cols-${opportunity.outcomes.length} gap-4 text-center`}>
                {opportunity.outcomes.map((outcome, index) => (
                    <div key={index}>
                        <div className="text-sm text-muted-foreground">{outcome.name}</div>
                        <div className="text-lg font-bold">{(distribution.cashStakes[index] + distribution.freebetStakes[index]).toFixed(2)}€</div>
                        <div className="text-xs text-muted-foreground mt-1">Cash: {distribution.cashStakes[index].toFixed(2)}€</div>
                        <div className="text-xs text-muted-foreground">Freebet: {distribution.freebetStakes[index].toFixed(2)}€</div>
                    </div>
                ))}
              </div>
              <div className="text-xs text-center text-muted-foreground mt-3 pt-2 border-t border-primary/10">
                Total misé : <span className="font-semibold">{(cashAmount + freebetAmount).toFixed(2)}€</span>
              </div>
            </div>
            
            <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-4 text-center">
              <div className="text-sm font-semibold text-muted-foreground">Profit total garanti</div>
              <div className={`text-3xl font-bold ${distribution.totalProfit >= 0 ? 'text-green-600 dark:text-green-500' : 'text-red-600 dark:text-red-500'}`}>
                {distribution.totalProfit > 0 ? '+' : ''}{distribution.totalProfit.toFixed(2)}€
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

type ArbitrageOpportunitiesProps = {
  sportGroup: string;
  selectedBookmaker: string;
};

export default function ArbitrageOpportunities({ sportGroup, selectedBookmaker }: ArbitrageOpportunitiesProps) {
  const [opportunities, setOpportunities] = useState<ArbitrageOpportunity[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedOpportunity, setSelectedOpportunity] = useState<ArbitrageOpportunity | null>(null);

  useEffect(() => {
    if (!sportGroup) {
      setOpportunities([]);
      return;
    }

    const fetchOdds = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(`/api/arbitrage-by-sport?group=${sportGroup}&bookmaker=${selectedBookmaker}`);
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Erreur lors de la récupération des opportunités');
        }
        const opportunities: ArbitrageOpportunity[] = await response.json();
        setOpportunities(opportunities);

      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchOdds();
  }, [sportGroup, selectedBookmaker]);

  if (!sportGroup) {
    return (
      <div className="text-center p-6 bg-card rounded-xl border">
        <p className="text-muted-foreground">Veuillez sélectionner un sport pour voir les opportunités.</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="text-center p-6 bg-card rounded-xl border">
        <p className="text-primary animate-pulse">Recherche des meilleures opportunités sur toutes les compétitions...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 bg-destructive/10 border-l-4 border-destructive text-destructive-foreground rounded-lg">
        <h3 className="font-bold">❌ Erreur</h3>
        <p>{error}</p>
      </div>
    );
  }

  return (
    <>
      <div className="space-y-6">
        {opportunities.length > 0 ? (
          opportunities.map(opp => (
            <BestOpportunityCard 
              key={opp.match.id} 
              opportunity={opp} 
              onSelect={(opportunity) => setSelectedOpportunity(opportunity)}
            />
          ))
        ) : (
          <div className="text-center p-6 bg-card rounded-xl border">
            <p className="text-muted-foreground">Aucune opportunité d'arbitrage trouvée pour ce sport.</p>
          </div>
        )}
      </div>

      {selectedOpportunity && (
        <BetCalculator 
          opportunity={selectedOpportunity} 
          onClose={() => setSelectedOpportunity(null)} 
        />
      )}
    </>
  );
}

function BestOpportunityCard({ opportunity, onSelect }: { opportunity: ArbitrageOpportunity; onSelect: (opportunity: ArbitrageOpportunity) => void }) {
  const [showCalculator, setShowCalculator] = useState(false);

  return (
    <>
      <div 
        className="bg-card rounded-xl shadow-lg p-5 border transition-all hover:border-primary cursor-pointer max-w-2xl mx-auto"
        onClick={() => {
          onSelect(opportunity);
          setShowCalculator(true);
        }}
      >
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold text-foreground">{opportunity.match.home_team} vs {opportunity.match.away_team}</h3>
          <span className="text-sm text-muted-foreground">{new Date(opportunity.match.commence_time).toLocaleDateString('fr-FR')}</span>
        </div>
        <div className={`grid grid-cols-1 md:grid-cols-${opportunity.outcomes.length} gap-4 text-center`}>
          {opportunity.outcomes.map(o => (
            <div key={o.name} className="bg-secondary p-3 rounded-lg">
              <p className="text-sm text-muted-foreground">{o.name}</p>
              <p className="text-lg font-bold text-primary">{o.price.toFixed(2)}</p>
              <p className="text-xs text-accent-foreground">{o.bookmaker}</p>
            </div>
          ))}
        </div>
        <div className="mt-4 text-center">
          <p className="text-lg font-bold text-green-500">
            Profit Freebet (100€) : {opportunity.freebetProfit.toFixed(2)}€
          </p>
          {opportunity.cashArbitrageROI !== null && (
            <p className="text-sm font-bold text-yellow-400 mt-1">
              🔥 Surebet Cash : +{opportunity.cashArbitrageROI.toFixed(2)}%
            </p>
          )}
          <p className="text-sm text-muted-foreground mt-2 opacity-80 group-hover:opacity-100 transition-opacity">💡 Cliquez pour calculer votre répartition</p>
        </div>
      </div>
      {showCalculator && (
        <BetCalculator 
          opportunity={opportunity} 
          onClose={() => setShowCalculator(false)} 
        />
      )}
    </>
  );
}

ArbitrageOpportunities.BestOpportunityCard = BestOpportunityCard;
