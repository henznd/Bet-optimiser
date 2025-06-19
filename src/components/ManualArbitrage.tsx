'use client';

import React, { useState } from 'react';

type Bet = {
  bookmaker: string;
  odds: number;
  cashStake: number;
  freebetStake: number;
};

type ArbitrageResult = {
  totalCashInvestment: number;
  totalFreebetAmount: number;
  guaranteedProfit: number;
  profitPercentage: number;
  bets: Bet[];
};

export default function ManualArbitrage() {
  const [odds1, setOdds1] = useState<string>('');
  const [odds2, setOdds2] = useState<string>('');
  const [odds3, setOdds3] = useState<string>('');
  const [cashAmount, setCashAmount] = useState<string>('100');
  const [freebetAmount, setFreebetAmount] = useState<string>('100');
  const [result, setResult] = useState<ArbitrageResult | null>(null);

  const calculateArbitrage = () => {
    const o1 = parseFloat(odds1);
    const o2 = parseFloat(odds2);
    const o3 = parseFloat(odds3);
    const cash = parseFloat(cashAmount);
    const freebet = parseFloat(freebetAmount);

    if (isNaN(o1) || isNaN(o2) || isNaN(o3) || isNaN(cash) || isNaN(freebet) || 
        o1 <= 1 || o2 <= 1 || o3 <= 1 || cash < 0 || freebet < 0) {
      alert('Veuillez entrer des cotes valides (>1) et des montants positifs');
      return;
    }

    if (cash === 0 && freebet === 0) {
      alert('Vous devez entrer au moins un montant cash ou freebet');
      return;
    }

    // Calcul des probabilités implicites
    const p1 = 1 / o1;
    const p2 = 1 / o2;
    const p3 = 1 / o3;
    const totalProb = p1 + p2 + p3;

    // Logique : répartir cash ET freebet sur les 3 issues
    // Le cash peut être utilisé même sans opportunité d'arbitrage
    // Les freebets compensent les pertes potentielles du cash
    const a1 = o1 - 1; // Gain net pour freebet
    const a2 = o2 - 1;
    const a3 = o3 - 1;

    let cashGain = 0;
    let freebetGain = 0;

    // Gain garanti par le cash seul
    if (cash > 0) {
      if (totalProb < 1) {
        // Opportunité d'arbitrage classique
        cashGain = cash / totalProb;
      } else {
        // Pas d'opportunité d'arbitrage, mais on peut quand même utiliser le cash
        // Le gain sera inférieur à la mise, mais compensé par les freebets
        cashGain = cash / totalProb;
      }
    }
    
    // Gain garanti par les freebets seuls (toujours possible car gratuits)
    if (freebet > 0) {
      const freebetTotalProb = 1 / a1 + 1 / a2 + 1 / a3;
      freebetGain = freebet / freebetTotalProb;
    }
    
    // Gain garanti total
    const guaranteedProfit = cashGain + freebetGain;

    // Répartition du cash
    const cashDistribution = {
      result1: cash > 0 ? cashGain / o1 : 0,
      result2: cash > 0 ? cashGain / o2 : 0,
      result3: cash > 0 ? cashGain / o3 : 0,
    };

    // Répartition des freebets
    const freebetDistribution = {
      result1: freebet > 0 ? freebetGain / a1 : 0,
      result2: freebet > 0 ? freebetGain / a2 : 0,
      result3: freebet > 0 ? freebetGain / a3 : 0,
    };

    // Correction pour éviter NaN
    if (!isFinite(freebetDistribution.result1)) freebetDistribution.result1 = 0;
    if (!isFinite(freebetDistribution.result2)) freebetDistribution.result2 = 0;
    if (!isFinite(freebetDistribution.result3)) freebetDistribution.result3 = 0;
    if (!isFinite(cashDistribution.result1)) cashDistribution.result1 = 0;
    if (!isFinite(cashDistribution.result2)) cashDistribution.result2 = 0;
    if (!isFinite(cashDistribution.result3)) cashDistribution.result3 = 0;

    const profitPercentage = cash > 0 ? ((guaranteedProfit - cash) / cash) * 100 : 0;

    setResult({
      totalCashInvestment: cash,
      totalFreebetAmount: freebet,
      guaranteedProfit,
      profitPercentage,
      bets: [
        { 
          bookmaker: 'Résultat 1', 
          odds: o1, 
          cashStake: cashDistribution.result1,
          freebetStake: freebetDistribution.result1
        },
        { 
          bookmaker: 'Résultat 2', 
          odds: o2, 
          cashStake: cashDistribution.result2,
          freebetStake: freebetDistribution.result2
        },
        { 
          bookmaker: 'Résultat 3', 
          odds: o3, 
          cashStake: cashDistribution.result3,
          freebetStake: freebetDistribution.result3
        },
      ],
    });
  };

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6">
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-4">
          <h2 className="text-xl sm:text-2xl font-bold text-white text-center">
            🎯 Calculateur d'Arbitrage
          </h2>
          <p className="text-blue-100 text-sm text-center mt-1">
            Optimisez vos gains avec cash et freebets
          </p>
        </div>

        <div className="p-4 sm:p-6">
          {/* Formulaire */}
          <div className="space-y-4 mb-6">
            {/* Cotes */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center">
                📊 Cotes
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Cote 1
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    min="1.01"
                    value={odds1}
                    onChange={(e) => setOdds1(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-lg"
                    placeholder="2.50"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Cote 2
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    min="1.01"
                    value={odds2}
                    onChange={(e) => setOdds2(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-lg"
                    placeholder="3.20"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Cote 3
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    min="1.01"
                    value={odds3}
                    onChange={(e) => setOdds3(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-lg"
                    placeholder="3.80"
                  />
                </div>
              </div>
            </div>

            {/* Montants */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center">
                💰 Montants
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    💵 Cash (€)
                  </label>
                  <input
                    type="number"
                    step="1"
                    min="0"
                    value={cashAmount}
                    onChange={(e) => setCashAmount(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-lg"
                    placeholder="100"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    🎁 Freebet (€)
                  </label>
                  <input
                    type="number"
                    step="1"
                    min="0"
                    value={freebetAmount}
                    onChange={(e) => setFreebetAmount(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-lg"
                    placeholder="100"
                  />
                </div>
              </div>
            </div>

            {/* Bouton Calculer */}
            <button
              onClick={calculateArbitrage}
              className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-3 px-6 rounded-lg hover:from-blue-700 hover:to-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 font-semibold text-lg transition-all duration-200 shadow-lg"
            >
              🧮 Calculer l'Arbitrage
            </button>
          </div>

          {/* Résultats */}
          {result && (
            <div className="bg-gradient-to-br from-green-50 to-blue-50 rounded-xl p-4 sm:p-6 border border-green-200">
              <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                📈 Résultats
              </h3>
              
              {/* Résumé principal */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                <div className="bg-white rounded-lg p-4 shadow-sm border">
                  <p className="text-sm text-gray-600 mb-1">💵 Investissement</p>
                  <p className="text-lg font-bold text-gray-800">{result.totalCashInvestment.toFixed(2)}€</p>
                </div>
                <div className="bg-white rounded-lg p-4 shadow-sm border">
                  <p className="text-sm text-gray-600 mb-1">🎁 Freebet</p>
                  <p className="text-lg font-bold text-blue-600">{result.totalFreebetAmount.toFixed(2)}€</p>
                </div>
                <div className="bg-white rounded-lg p-4 shadow-sm border">
                  <p className="text-sm text-gray-600 mb-1">💰 Gain Garanti</p>
                  <p className="text-lg font-bold text-green-600">{result.guaranteedProfit.toFixed(2)}€</p>
                </div>
                <div className="bg-white rounded-lg p-4 shadow-sm border">
                  <p className="text-sm text-gray-600 mb-1">📊 ROI</p>
                  <p className={`text-lg font-bold ${result.profitPercentage >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {result.profitPercentage.toFixed(2)}%
                  </p>
                </div>
              </div>

              {/* Répartition des mises */}
              <div className="bg-white rounded-lg p-4 shadow-sm border">
                <h4 className="text-lg font-semibold text-gray-800 mb-3">🎯 Répartition des Mises</h4>
                <div className="space-y-3">
                  {result.bets.map((bet, index) => (
                    <div key={index} className="bg-gray-50 rounded-lg p-3">
                      <div className="flex justify-between items-center mb-2">
                        <span className="font-medium text-gray-800">{bet.bookmaker}</span>
                        <span className="text-sm text-gray-600">Cote: {bet.odds}</span>
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div className="bg-white rounded p-2 text-center">
                          <p className="text-xs text-gray-600">Cash</p>
                          <p className="font-semibold text-gray-800">{bet.cashStake.toFixed(2)}€</p>
                        </div>
                        <div className="bg-blue-50 rounded p-2 text-center">
                          <p className="text-xs text-blue-600">Freebet</p>
                          <p className="font-semibold text-blue-700">{bet.freebetStake.toFixed(2)}€</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Note explicative */}
              <div className="mt-4 p-3 bg-blue-100 rounded-lg border border-blue-200">
                <p className="text-sm text-blue-800">
                  <strong>💡 Note :</strong> Avec cette répartition, vous gagnez la même somme quoi qu'il arrive, 
                  en profitant au maximum des freebets (gratuits) pour booster le gain garanti.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

