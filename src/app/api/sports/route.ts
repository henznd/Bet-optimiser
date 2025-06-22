import { NextResponse } from 'next/server';

const ODDS_API_KEY = '7520d7b120c86a7865931f5388412947'; // Remplacez par process.env.ODDS_API_KEY en production
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