import { NextResponse } from 'next/server';

const ODDS_API_KEY = 'c0f2ded49a368cdeb377bfee20fb549e'; // Remplacez par process.env.ODDS_API_KEY en production
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