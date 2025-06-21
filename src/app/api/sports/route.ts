import { NextResponse } from 'next/server';

const ODDS_API_KEY = 'd3fb979e24b39fe4186876ad3225a2e4'; // Remplacez par process.env.ODDS_API_KEY en production
const API_URL = 'https://api.the-odds-api.com/v4/sports';

export async function GET() {
  try {
    const response = await fetch(`${API_URL}?apiKey=${ODDS_API_KEY}`);

    if (!response.ok) {
      const errorData = await response.json();
      console.error('API Error:', errorData);
      return NextResponse.json(
        { message: `Erreur de l'API externe: ${errorData.message}` },
        { status: response.status }
      );
    }

    const sportsData = await response.json();
    return NextResponse.json(sportsData);
  } catch (error) {
    console.error('Internal Server Error:', error);
    return NextResponse.json(
      { message: 'Erreur interne du serveur' },
      { status: 500 }
    );
  }
} 