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

const BOOKMAKER_PRIORITY = 'parionssport_fr'; // "Parions Sport"

type ArbitrageOpportunitiesProps = {
  sportGroup: string;
  selectedBookmaker: string;
};

export default function ArbitrageOpportunities({ sportGroup, selectedBookmaker }: ArbitrageOpportunitiesProps) {
  const [opportunities, setOpportunities] = useState<ArbitrageOpportunity[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

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
    <div className="space-y-6">
      {opportunities.length > 0 ? (
        opportunities.map(opp => (
          <div key={opp.match.id} className="bg-card rounded-xl shadow-lg p-5 border transition-all hover:border-primary">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-foreground">{opp.match.home_team} vs {opp.match.away_team}</h3>
              <span className="text-sm text-muted-foreground">{new Date(opp.match.commence_time).toLocaleDateString('fr-FR')}</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
              {opp.outcomes.map(o => (
                <div key={o.name} className="bg-secondary p-3 rounded-lg">
                  <p className="text-sm text-muted-foreground">{o.name}</p>
                  <p className="text-lg font-bold text-primary">{o.price.toFixed(2)}</p>
                  <p className="text-xs text-accent-foreground">{o.bookmaker}</p>
                </div>
              ))}
            </div>
            <div className="mt-4 text-center">
              <p className="text-lg font-bold text-green-500">
                Profit Freebet (100€) : {opp.freebetProfit.toFixed(2)}€
              </p>
              {opp.cashArbitrageROI !== null && (
                <p className="text-sm font-bold text-yellow-400 mt-1">
                  🔥 Surebet Cash : +{opp.cashArbitrageROI.toFixed(2)}%
                </p>
              )}
            </div>
          </div>
        ))
      ) : (
        <div className="text-center p-6 bg-card rounded-xl border">
          <p className="text-muted-foreground">Aucune opportunité d'arbitrage trouvée pour ce sport.</p>
        </div>
      )}
    </div>
  );
}
