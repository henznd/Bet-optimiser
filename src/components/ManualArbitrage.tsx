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
    <div className="bg-card rounded-xl shadow-lg p-6 md:p-8 border">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
        <div>
          <h2 className="text-2xl font-bold mb-4 text-foreground">Cotes</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-1">
                Cote Victoire
              </label>
              <input
                type="number"
                value={odds.victory}
                onChange={(e) => setOdds({ ...odds, victory: parseFloat(e.target.value) || 0 })}
                className="w-full px-3 py-2 bg-input border-transparent rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary"
                step="0.01"
                min="1.01"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-1">
                Cote Match nul
              </label>
              <input
                type="number"
                value={odds.draw}
                onChange={(e) => setOdds({ ...odds, draw: parseFloat(e.target.value) || 0 })}
                className="w-full px-3 py-2 bg-input border-transparent rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary"
                step="0.01"
                min="1.01"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-1">
                Cote Défaite
              </label>
              <input
                type="number"
                value={odds.defeat}
                onChange={(e) => setOdds({ ...odds, defeat: parseFloat(e.target.value) || 0 })}
                className="w-full px-3 py-2 bg-input border-transparent rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary"
                step="0.01"
                min="1.01"
              />
            </div>
          </div>
        </div>

        <div>
          <h2 className="text-2xl font-bold mb-4 text-foreground">Montants</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-1">
                Montant Freebet (€)
              </label>
              <input
                type="number"
                value={amounts.freebet}
                onChange={(e) => setAmounts({ ...amounts, freebet: parseFloat(e.target.value) || 0 })}
                className="w-full px-3 py-2 bg-input border-transparent rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary"
                step="0.01"
                min="0"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-1">
                Montant Cash (€)
              </label>
              <input
                type="number"
                value={amounts.cash}
                onChange={(e) => setAmounts({ ...amounts, cash: parseFloat(e.target.value) || 0 })}
                className="w-full px-3 py-2 bg-input border-transparent rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary"
                step="0.01"
                min="0"
              />
            </div>
          </div>
        </div>
      </div>

      <button
        onClick={calculateArbitrage}
        className="w-full bg-primary text-primary-foreground font-bold py-3 px-6 rounded-md hover:bg-primary/90 transition-all text-lg shadow-lg"
      >
        🧮 Calculer l'arbitrage
      </button>

      {error && (
        <div className="mt-6 p-4 bg-destructive/10 border-l-4 border-destructive text-destructive-foreground">
          <h3 className="font-bold">❌ Erreur</h3>
          <p>{error}</p>
        </div>
      )}

      {result && (
        <div className="mt-6 p-6 bg-secondary rounded-lg">
          <h3 className="text-xl font-bold text-foreground mb-4">🎯 Résultats de l'arbitrage</h3>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center mb-6">
            <div className="bg-background/50 p-3 rounded-lg">
              <p className="text-sm text-muted-foreground">Gain garanti</p>
              <p className="text-lg font-bold text-primary">{formatCurrency(result.guaranteedProfit)}</p>
            </div>
            <div className="bg-background/50 p-3 rounded-lg">
              <p className="text-sm text-muted-foreground">Investissement</p>
              <p className="text-lg font-bold">{formatCurrency(result.totalInvestment)}</p>
            </div>
            <div className="bg-background/50 p-3 rounded-lg">
              <p className="text-sm text-muted-foreground">Profit Net</p>
              <p className="text-lg font-bold text-green-500">{formatCurrency(result.guaranteedProfit - result.totalInvestment)}</p>
            </div>
            <div className="bg-background/50 p-3 rounded-lg">
              <p className="text-sm text-muted-foreground">ROI</p>
              <p className="text-lg font-bold text-green-500">{result.roi.toFixed(2)}%</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-background/50 p-4 rounded-lg">
              <h4 className="font-bold text-foreground mb-2">🎁 Répartition des freebets :</h4>
              <ul className="space-y-1 text-muted-foreground">
                <li className="flex justify-between"><span>Victoire:</span> <span className="font-mono">{formatCurrency(result.freebetDistribution.victory)}</span></li>
                <li className="flex justify-between"><span>Match nul:</span> <span className="font-mono">{formatCurrency(result.freebetDistribution.draw)}</span></li>
                <li className="flex justify-between"><span>Défaite:</span> <span className="font-mono">{formatCurrency(result.freebetDistribution.defeat)}</span></li>
              </ul>
            </div>

            <div className="bg-background/50 p-4 rounded-lg">
              <h4 className="font-bold text-foreground mb-2">💶 Répartition du cash :</h4>
              <ul className="space-y-1 text-muted-foreground">
                <li className="flex justify-between"><span>Victoire:</span> <span className="font-mono">{formatCurrency(result.cashDistribution.victory)}</span></li>
                <li className="flex justify-between"><span>Match nul:</span> <span className="font-mono">{formatCurrency(result.cashDistribution.draw)}</span></li>
                <li className="flex justify-between"><span>Défaite:</span> <span className="font-mono">{formatCurrency(result.cashDistribution.defeat)}</span></li>
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

