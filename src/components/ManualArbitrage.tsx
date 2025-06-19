'use client';

import React, { useState } from 'react';

interface ArbitrageResult {
  freebetDistribution: {
    victory: number;
    draw: number;
    defeat: number;
  };
  cashDistribution: {
    victory: number;
    draw: number;
    defeat: number;
  };
  guaranteedProfit: number;
  totalInvestment: number;
  roi: number;
}

export default function ManualArbitrage() {
  const [odds, setOdds] = useState({
    victory: 2.5,
    draw: 3.2,
    defeat: 2.8,
  });
  const [amounts, setAmounts] = useState({
    freebet: 100,
    cash: 100,
  });
  const [result, setResult] = useState<ArbitrageResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const calculateArbitrage = () => {
    const { victory: C1, draw: C2, defeat: C3 } = odds;
    const { freebet: F, cash: R } = amounts;

    if (C1 <= 1 || C2 <= 1 || C3 <= 1) {
      setError("Toutes les cotes doivent être supérieures à 1");
      setResult(null);
      return;
    }
    if (F < 0 || R < 0) {
      setError("Les montants ne peuvent pas être négatifs");
      setResult(null);
      return;
    }

    // Nouvelle logique : répartir cash ET freebet sur les 3 issues pour garantir le même gain final
    const a1 = C1 - 1;
    const a2 = C2 - 1;
    const a3 = C3 - 1;

    // Gain garanti par le cash seul
    const cashGain = R / (1 / C1 + 1 / C2 + 1 / C3);
    // Gain garanti par les freebets seuls
    const freebetGain = F / (1 / a1 + 1 / a2 + 1 / a3);
    // Gain garanti total
    const G = cashGain + freebetGain;

    // Répartition du cash
    const cashDistribution = {
      victory: cashGain / C1,
      draw: cashGain / C2,
      defeat: cashGain / C3,
    };
    // Répartition des freebets
    const freebetDistribution = {
      victory: freebetGain / a1,
      draw: freebetGain / a2,
      defeat: freebetGain / a3,
    };
    // Correction pour éviter NaN si a1, a2, a3 = 0 (cote = 1)
    for (const k of ["victory", "draw", "defeat"] as const) {
      if (!isFinite(freebetDistribution[k])) {
        freebetDistribution[k] = 0;
      }
      if (!isFinite(cashDistribution[k])) {
        cashDistribution[k] = 0;
      }
    }

    const totalInvestment = R;
    const roi = totalInvestment > 0 ? ((G - totalInvestment) / totalInvestment) * 100 : 0;

    setResult({
      freebetDistribution,
      cashDistribution,
      guaranteedProfit: G,
      totalInvestment,
      roi
    });
    setError(null);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(amount);
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div>
          <h2 className="text-2xl font-bold mb-4">Cotes</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Cote Victoire
              </label>
              <input
                type="number"
                value={odds.victory}
                onChange={(e) => setOdds({ ...odds, victory: parseFloat(e.target.value) || 0 })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                step="0.01"
                min="1.01"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Cote Match nul
              </label>
              <input
                type="number"
                value={odds.draw}
                onChange={(e) => setOdds({ ...odds, draw: parseFloat(e.target.value) || 0 })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                step="0.01"
                min="1.01"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Cote Défaite
              </label>
              <input
                type="number"
                value={odds.defeat}
                onChange={(e) => setOdds({ ...odds, defeat: parseFloat(e.target.value) || 0 })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                step="0.01"
                min="1.01"
              />
            </div>
          </div>
        </div>

        <div>
          <h2 className="text-2xl font-bold mb-4">Montants</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Montant Freebet (€)
              </label>
              <input
                type="number"
                value={amounts.freebet}
                onChange={(e) => setAmounts({ ...amounts, freebet: parseFloat(e.target.value) || 0 })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                step="0.01"
                min="0"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Montant Cash (€)
              </label>
              <input
                type="number"
                value={amounts.cash}
                onChange={(e) => setAmounts({ ...amounts, cash: parseFloat(e.target.value) || 0 })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                step="0.01"
                min="0"
              />
            </div>
          </div>
        </div>
      </div>

      <button
        onClick={calculateArbitrage}
        className="w-full bg-blue-600 text-white py-3 px-6 rounded-md hover:bg-blue-700 transition-colors"
      >
        🧮 Calculer l'arbitrage
      </button>

      {error && (
        <div className="mt-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700">
          <h3 className="font-bold">❌ Erreur</h3>
          <p>{error}</p>
        </div>
      )}

      {result && (
        <div className="mt-6 p-4 bg-green-50 border-l-4 border-green-500">
          <h3 className="text-xl font-bold text-green-800 mb-4">🎯 Résultats de l'arbitrage</h3>
          
          <div className="space-y-2 text-green-800">
            <p><strong>Gain garanti :</strong> {formatCurrency(result.guaranteedProfit)}</p>
            <p><strong>Investissement cash :</strong> {formatCurrency(result.totalInvestment)}</p>
            <p><strong>Profit net :</strong> {formatCurrency(result.guaranteedProfit - result.totalInvestment)}</p>
            <p><strong>ROI :</strong> {result.roi.toFixed(2)}%</p>
          </div>

          <div className="mt-4">
            <h4 className="font-bold text-green-800">🎁 Répartition des freebets :</h4>
            <ul className="list-disc list-inside space-y-1 text-green-800">
              <li>Victoire : {formatCurrency(result.freebetDistribution.victory)}</li>
              <li>Match nul : {formatCurrency(result.freebetDistribution.draw)}</li>
              <li>Défaite : {formatCurrency(result.freebetDistribution.defeat)}</li>
            </ul>
          </div>

          <div className="mt-4">
            <h4 className="font-bold text-green-800">💶 Répartition du cash :</h4>
            <ul className="list-disc list-inside space-y-1 text-green-800">
              <li>Victoire : {formatCurrency(result.cashDistribution.victory)}</li>
              <li>Match nul : {formatCurrency(result.cashDistribution.draw)}</li>
              <li>Défaite : {formatCurrency(result.cashDistribution.defeat)}</li>
            </ul>
          </div>

          <p className="mt-4 text-sm italic text-green-700">
            Avec cette répartition, vous gagnez la même somme quoi qu'il arrive, en profitant au maximum des freebets (gratuits) pour booster le gain garanti.
          </p>
        </div>
      )}
    </div>
  );
}

