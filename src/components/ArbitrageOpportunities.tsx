'use client';

import React, { useState, useEffect } from 'react';

type Bet = {
  bookmaker: string;
  team: string;
  odds: number;
  stake: number;
};

type ArbitrageOpportunity = {
  game: {
    id: string;
    home_team: string;
    away_team: string;
    commence_time: string;
  };
  opportunity: {
    totalReturn: number;
    bets: Bet[];
  };
};

type ArbitrageOpportunitiesProps = {
  sportKey: string;
  selectedBookmaker: string;
};

const MOCK_OPPORTUNITIES: ArbitrageOpportunity[] = [
  {
    game: {
      id: '1',
      home_team: 'Manchester City',
      away_team: 'Arsenal',
      commence_time: '2024-01-15T20:00:00Z',
    },
    opportunity: {
      totalReturn: 2.5,
      bets: [
        { bookmaker: 'Betclic', team: 'Manchester City', odds: 2.1, stake: 476.19 },
        { bookmaker: 'Unibet', team: 'Arsenal', odds: 3.8, stake: 263.16 },
        { bookmaker: 'Winamax', team: 'Draw', odds: 3.2, stake: 312.50 },
      ],
    },
  },
  {
    game: {
      id: '2',
      home_team: 'PSG',
      away_team: 'Marseille',
      commence_time: '2024-01-16T21:00:00Z',
    },
    opportunity: {
      totalReturn: 1.8,
      bets: [
        { bookmaker: 'PMU', team: 'PSG', odds: 1.8, stake: 555.56 },
        { bookmaker: 'Parions Sport', team: 'Marseille', odds: 4.2, stake: 238.10 },
        { bookmaker: 'Netbet', team: 'Draw', odds: 3.5, stake: 285.71 },
      ],
    },
  },
];

export default function ArbitrageOpportunities({ sportKey, selectedBookmaker }: ArbitrageOpportunitiesProps) {
  const [opportunities, setOpportunities] = useState<ArbitrageOpportunity[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!sportKey) {
      setOpportunities([]);
      return;
    }

    setLoading(true);
    
    setTimeout(() => {
      setOpportunities(MOCK_OPPORTUNITIES);
      setLoading(false);
    }, 1000);
  }, [sportKey]);

  if (loading) {
    return <div className="text-center p-4">Loading opportunities...</div>;
  }

  if (opportunities.length === 0) {
    return (
      <div className="text-center p-4">
        No arbitrage opportunities found for the selected sport.
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6">
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="bg-gradient-to-r from-orange-500 to-red-500 px-6 py-4">
          <h2 className="text-xl sm:text-2xl font-bold text-white text-center">
            🔄 Cotes en Direct
          </h2>
          <p className="text-orange-100 text-sm text-center mt-1">
            Fonctionnalité en cours de développement
          </p>
        </div>

        <div className="p-4 sm:p-6">
          <div className="bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200 rounded-lg p-6 mb-6">
            <div className="flex items-center justify-center space-x-3 mb-4">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
              <h3 className="text-lg font-semibold text-orange-800">🚧 En Développement</h3>
            </div>
            <p className="text-center text-orange-700 mb-4">
              Cette fonctionnalité permettra bientôt de récupérer automatiquement les cotes en direct 
              depuis les bookmakers et d'identifier les opportunités d'arbitrage en temps réel.
            </p>
            <div className="bg-white rounded-lg p-4 border border-orange-200">
              <h4 className="font-semibold text-gray-800 mb-2">📋 Fonctionnalités prévues :</h4>
              <ul className="text-sm text-gray-700 space-y-1">
                <li>• 🔗 Intégration API des bookmakers (Betclic, Winamax, Unibet)</li>
                <li>• ⚡ Mise à jour automatique des cotes en temps réel</li>
                <li>• 🎯 Détection automatique des opportunités d'arbitrage</li>
                <li>• 📊 Filtres par sport, compétition et bookmaker</li>
                <li>• 🔔 Alertes pour les meilleures opportunités</li>
                <li>• 📱 Notifications push sur mobile</li>
              </ul>
            </div>
          </div>

          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-3">⚙️ Configuration</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Sport
                </label>
                <select
                  value={sportKey}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  disabled
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
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  disabled
                >
                  <option value="">Sélectionnez un bookmaker</option>
                  <option value="betclic">Betclic</option>
                  <option value="winamax">Winamax</option>
                  <option value="unibet">Unibet</option>
                </select>
              </div>
            </div>
            <p className="text-xs text-gray-500 mt-2">
              ⚠️ Les sélecteurs sont désactivés pendant le développement
            </p>
          </div>

          <div className="text-center py-8">
            <div className="text-6xl mb-4">🔄</div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">
              Bientôt disponible !
            </h3>
            <p className="text-gray-600">
              Nous travaillons actuellement sur l'intégration des APIs des bookmakers 
              pour vous offrir les meilleures opportunités d'arbitrage en temps réel.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
