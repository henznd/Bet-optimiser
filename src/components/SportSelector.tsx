'use client';

import React, { useState } from 'react';

// Données statiques pour les sports
const AVAILABLE_SPORTS = [
  { key: 'soccer_epl', title: 'Premier League' },
  { key: 'soccer_la_liga', title: 'La Liga' },
  { key: 'soccer_bundesliga', title: 'Bundesliga' },
  { key: 'soccer_serie_a', title: 'Serie A' },
  { key: 'soccer_ligue_1', title: 'Ligue 1' },
  { key: 'basketball_nba', title: 'NBA' },
  { key: 'americanfootball_nfl', title: 'NFL' },
];

// Bookmakers français
const FRENCH_BOOKMAKERS = [
  'betclic',
  'unibet_fr',
  'winamax',
  'zebet',
  'parionssport',
  'netbet',
  'pmu',
];

type SportSelectorProps = {
  onSportSelect: (sportKey: string) => void;
  onBookmakerSelect: (bookmaker: string) => void;
};

export default function SportSelector({ onSportSelect, onBookmakerSelect }: SportSelectorProps) {
  const [selectedSport, setSelectedSport] = useState<string>('');
  const [selectedBookmaker, setSelectedBookmaker] = useState<string>(FRENCH_BOOKMAKERS[0]);

  const handleSportChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const sportKey = event.target.value;
    setSelectedSport(sportKey);
    onSportSelect(sportKey);
  };

  const handleBookmakerChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const bookmaker = event.target.value;
    setSelectedBookmaker(bookmaker);
    onBookmakerSelect(bookmaker);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4">
      <div>
        <label htmlFor="sport-select" className="block text-sm font-medium text-gray-700 mb-2">
          Select Sport
        </label>
        <select
          id="sport-select"
          value={selectedSport}
          onChange={handleSportChange}
          className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        >
          <option value="">Select a sport</option>
          {AVAILABLE_SPORTS.map((sport) => (
            <option key={sport.key} value={sport.key}>
              {sport.title}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="bookmaker-select" className="block text-sm font-medium text-gray-700 mb-2">
          Select Bookmaker
        </label>
        <select
          id="bookmaker-select"
          value={selectedBookmaker}
          onChange={handleBookmakerChange}
          className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        >
          {FRENCH_BOOKMAKERS.map((bookmaker) => (
            <option key={bookmaker} value={bookmaker}>
              {bookmaker.charAt(0).toUpperCase() + bookmaker.slice(1).replace('_', ' ')}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
