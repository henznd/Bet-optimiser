import { NextRequest, NextResponse } from 'next/server';

const ODDS_API_KEY = '7520d7b120c86a7865931f5388412947';
const API_URL = 'https://api.the-odds-api.com/v4/sports';

interface Sport { key: string; group: string; active: boolean; }
interface Outcome { name: string; price: number; }
interface Bookmaker { key: string; title: string; markets: { key: 'h2h'; outcomes: Outcome[]; }[]; }
interface Match { id: string; home_team: string; away_team: string; commence_time: string; bookmakers: Bookmaker[]; }
interface ArbitrageOpportunity { match: Match; outcomes: { name: string; price: number; bookmaker: string; }[]; freebetProfit: number; cashArbitrageROI: number | null; }

const BOOKMAKER_PRIORITY = 'parionsport_fr';

const findArbitrageOpportunities = (matches: Match[], bookmakerKey?: string | null): ArbitrageOpportunity[] => {
    const opportunities: ArbitrageOpportunity[] = [];

    matches.forEach(match => {
        const bookmakersToScan = bookmakerKey 
            ? match.bookmakers.filter(b => b.key === bookmakerKey)
            : match.bookmakers;

        bookmakersToScan.forEach(bookmaker => {
            const market = bookmaker.markets.find(m => m.key === 'h2h');
            if (market && (market.outcomes.length === 2 || market.outcomes.length === 3)) {
                
                let C1: number, C2: number, C3: number | undefined;
                let outcomes: { name: string; price: number; bookmaker: string; }[];

                if (market.outcomes.length === 3) {
                    const odds: { [key: string]: number } = {};
                     market.outcomes.forEach(o => {
                        const outcomeName = o.name === match.home_team ? '1' : o.name === match.away_team ? '2' : 'N';
                        odds[outcomeName] = o.price;
                    });
                    if (!odds['1'] || !odds['N'] || !odds['2']) return;
                    C1 = odds['1']; C2 = odds['N']; C3 = odds['2'];
                    outcomes = [
                        { name: match.home_team, price: C1, bookmaker: bookmaker.title },
                        { name: 'Match Nul', price: C2, bookmaker: bookmaker.title },
                        { name: match.away_team, price: C3, bookmaker: bookmaker.title },
                    ];
                } else { // 2 outcomes
                    C1 = market.outcomes[0].price;
                    C2 = market.outcomes[1].price;
                    C3 = undefined;
                    outcomes = [
                        { name: market.outcomes[0].name, price: C1, bookmaker: bookmaker.title },
                        { name: market.outcomes[1].name, price: C2, bookmaker: bookmaker.title },
                    ];
                }

                const a1 = C1 - 1, a2 = C2 - 1;
                if (a1 <= 0 || a2 <= 0) return;

                let freebetProfit, cashArbitrageROI;

                if (C3 !== undefined) { // 3 outcomes calculation
                    const a3 = C3 - 1;
                    if (a3 <= 0) return;
                    freebetProfit = 100 / (1 / a1 + 1 / a2 + 1 / a3);
                    const arbitrageValue = 1 / C1 + 1 / C2 + 1 / C3;
                    cashArbitrageROI = arbitrageValue < 1 ? (1 / arbitrageValue - 1) * 100 : null;
                } else { // 2 outcomes calculation
                    freebetProfit = 100 / (1 / a1 + 1 / a2);
                    const arbitrageValue = 1 / C1 + 1 / C2;
                    cashArbitrageROI = arbitrageValue < 1 ? (1 / arbitrageValue - 1) * 100 : null;
                }

                if (freebetProfit > 0) {
                    opportunities.push({ match, outcomes, freebetProfit, cashArbitrageROI });
                }
            }
        });
    });

    return opportunities.sort((a, b) => b.freebetProfit - a.freebetProfit);
};

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const sportGroup = searchParams.get('group');
  const bookmakerKey = searchParams.get('bookmaker');

  if (!sportGroup) {
    return NextResponse.json({ message: 'Le paramètre group est manquant' }, { status: 400 });
  }

  try {
    const sportsResponse = await fetch(`${API_URL}?apiKey=${ODDS_API_KEY}`);
    if (!sportsResponse.ok) throw new Error('Impossible de charger la liste des sports');
    const availableSports: Sport[] = await sportsResponse.json();

    const competitionKeys = availableSports
        .filter(s => s.group === sportGroup && s.active)
        .map(s => s.key);

    if (competitionKeys.length === 0) return NextResponse.json([]);

    const regions = 'eu';
    const markets = 'h2h';
    const oddsPromises = competitionKeys.map(key =>
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

    const opportunities = findArbitrageOpportunities(allMatches, bookmakerKey);
    return NextResponse.json(opportunities);
  } catch (error: any) {
    console.error('Erreur interne du serveur:', error);
    return NextResponse.json({ message: error.message || 'Erreur interne du serveur' }, { status: 500 });
  }
} 