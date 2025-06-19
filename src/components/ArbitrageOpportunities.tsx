'use client';

import React, { useState, useEffect } from 'react';

// Types pour les données statiques
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

// Données statiques pour les opportunités d'arbitrage
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
        {
          bookmaker: 'Betclic',
          team: 'Manchester City',
          odds: 2.1,
          stake: 476.19,
        },
        {
          bookmaker: 'Unibet',
          team: 'Arsenal',
          odds: 3.8,
          stake: 263.16,
        },
        {
          bookmaker: 'Winamax',
          team: 'Draw',
          odds: 3.2,
          stake: 312.50,
        },
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
        {
          bookmaker: 'PMU',
          team: 'PSG',
          odds: 1.8,
          stake: 555.56,
        },
        {
          bookmaker: 'Parions Sport',
          team: 'Marseille',
          odds: 4.2,
          stake: 238.10,
        },
        {
          bookmaker: 'Netbet',
          team: 'Draw',
          odds: 3.5,
          stake: 285.71,
        },
      ],
    },
  },
];

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
    <div className="space-y-6 p-4">
      {opportunities.map((opportunity, index) => (
        <div
          key={opportunity.game.id}
          className="bg-white shadow rounded-lg p-6 border border-gray-200"
        >
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">
              {opportunity.game.home_team} vs {opportunity.game.away_team}
            </h3>
            <span className="text-green-600 font-semibold">
              Return: {opportunity.opportunity.totalReturn.toFixed(2)}%
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {opportunity.opportunity.bets.map((bet, betIndex) => (
              <div
                key={betIndex}
                className="bg-gray-50 p-4 rounded-lg"
              >
                <div className="font-medium">{bet.team}</div>
                <div className="text-sm text-gray-600">Bookmaker: {bet.bookmaker}</div>
                <div className="text-sm text-gray-600">Odds: {bet.odds.toFixed(2)}</div>
                <div className="text-sm text-gray-600">
                  Stake: {bet.stake.toFixed(2)}€
                </div>
              </div>
            ))}
          </div>

          <div className="mt-4 text-sm text-gray-500">
            Match starts at: {new Date(opportunity.game.commence_time).toLocaleString()}
          </div>
        </div>
      ))}
    </div>
  );
}
