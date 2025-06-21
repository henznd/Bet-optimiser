import { NextResponse } from 'next/server';
import { NextRequest } from 'next/server';

const ODDS_API_KEY = 'd3fb979e24b39fe4186876ad3225a2e4';
const API_URL = 'https://api.the-odds-api.com/v4/sports';

interface Sport { key: string; group: string; active: boolean; }
interface Outcome { name: string; price: number; }
interface Bookmaker { key: string; title: string; markets: { key: 'h2h'; outcomes: Outcome[]; }[]; }
interface Match { id: string; sport_key: string; sport_title: string; home_team: string; away_team: string; commence_time: string; bookmakers: Bookmaker[]; }
interface ArbitrageOpportunity { match: Match; outcomes: { name: string; price: number; bookmaker: string; }[]; freebetProfit: number; cashArbitrageROI: number | null; }

// Cette fonction est une copie de celle dans arbitrage-by-sport/route.ts
const findArbitrageOpportunities = (matches: Match[], bookmakerKey?: string | null): ArbitrageOpportunity[] => {
    const opportunities: ArbitrageOpportunity[] = [];
    matches.forEach(match => {
        const bookmakersToScan = bookmakerKey
            ? match.bookmakers.filter(b => b.key === bookmakerKey)
            : match.bookmakers;
            
        bookmakersToScan.forEach(bookmaker => {
            const market = bookmaker.markets.find(m => m.key === 'h2h');
            if (market && (market.outcomes.length === 2 || market.outcomes.length === 3)) {
                let C: number[] = market.outcomes.map(o => o.price);
                let outcomes: { name: string; price: number; bookmaker: string; }[];
                
                if (market.outcomes.length === 3) {
                    outcomes = [
                        { name: match.home_team, price: C[0], bookmaker: bookmaker.title },
                        { name: 'Match Nul', price: C[1], bookmaker: bookmaker.title },
                        { name: match.away_team, price: C[2], bookmaker: bookmaker.title },
                    ];
                } else {
                    outcomes = market.outcomes.map(o => ({ name: o.name, price: o.price, bookmaker: bookmaker.title }));
                }

                const A = C.map(c => c - 1);
                if (A.some(a => a <= 0)) return;

                const sumInvA = A.reduce((sum, a) => sum + 1 / a, 0);
                const freebetProfit = 100 / sumInvA;

                const sumInvC = C.reduce((sum, c) => sum + 1 / c, 0);
                const cashArbitrageROI = sumInvC < 1 ? (1 / sumInvC - 1) * 100 : null;

                if (freebetProfit > 0) {
                    opportunities.push({ match, outcomes, freebetProfit, cashArbitrageROI });
                }
            }
        });
    });
    return opportunities;
};

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const bookmakerKey = searchParams.get('bookmaker');

  try {
    const sportsResponse = await fetch(`${API_URL}?apiKey=${ODDS_API_KEY}`);
    if (!sportsResponse.ok) throw new Error('Impossible de charger la liste des sports');
    const availableSports: Sport[] = await sportsResponse.json();

    const activeSportKeys = availableSports.filter(s => s.active).map(s => s.key);

    const regions = 'eu';
    const markets = 'h2h';
    const oddsPromises = activeSportKeys.map(key =>
        fetch(`${API_URL}/${key}/odds/?apiKey=${ODDS_API_KEY}&regions=${regions}&markets=${markets}`)
    );

    const oddsResponses = await Promise.all(oddsPromises);
    let allMatches: Match[] = [];
    for (const res of oddsResponses) {
        if (res.ok) {
            const matches: Match[] = await res.json();
            allMatches = allMatches.concat(matches);
        }
    }

    const allOpportunities = findArbitrageOpportunities(allMatches, bookmakerKey);

    if (allOpportunities.length === 0) {
      return NextResponse.json(null); // Pas d'opportunité trouvée
    }

    // On retourne la meilleure opportunité (le plus grand profit freebet)
    const bestOpportunity = allOpportunities.sort((a, b) => b.freebetProfit - a.freebetProfit)[0];
    
    return NextResponse.json(bestOpportunity);
  } catch (error: any) {
    console.error('Erreur interne du serveur:', error);
    return NextResponse.json({ message: error.message || 'Erreur interne du serveur' }, { status: 500 });
  }
} 