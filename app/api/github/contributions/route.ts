import { NextRequest, NextResponse } from 'next/server';

interface ContributionDay {
  date: string;
  count: number;
  level: number;
}

interface GitHubResponse {
  data: {
    user: {
      contributionsCollection: {
        contributionCalendar: {
          totalContributions: number;
          weeks: Array<{
            contributionDays: Array<{
              date: string;
              contributionCount: number;
            }>;
          }>;
        };
      };
    };
  };
}

interface ContributionResponse {
  contributions: ContributionDay[];
  totalContributions: number;
  longestStreak: number;
  currentStreak: number;

  // Nuevos campos para mostrar el rango de fechas
  dateRange: {
    from: string;
    to: string;
    totalDays: number;
  };
  summary: {
    activeDays: number;
    inactiveDays: number;
    averageContributionsPerDay: number;
  };
}

// Función para obtener el rango de fechas de los datos
function getDateRange(contributions: ContributionDay[]) {
  if (contributions.length === 0) {
    return {
      from: '',
      to: '',
      totalDays: 0
    };
  }

  const dates = contributions.map(c => c.date).sort();
  return {
    from: dates[0],
    to: dates[dates.length - 1],
    totalDays: contributions.length
  };
}

// Función para generar resumen de contribuciones
function generateSummary(contributions: ContributionDay[]) {
  const activeDays = contributions.filter(c => c.count > 0).length;
  const inactiveDays = contributions.length - activeDays;
  const totalContributions = contributions.reduce((sum, c) => sum + c.count, 0);
  const averageContributionsPerDay = contributions.length > 0 
    ? parseFloat((totalContributions / contributions.length).toFixed(2))
    : 0;

  return {
    activeDays,
    inactiveDays,
    averageContributionsPerDay
  };
}

// Función para generar datos mock
function generateMockData(): ContributionResponse {
  const contributions: ContributionDay[] = [];
  const today = new Date();
  const oneYearAgo = new Date(today);
  oneYearAgo.setFullYear(today.getFullYear() - 1);

  console.log(`Generating mock data from ${oneYearAgo.toISOString().split('T')[0]} to ${today.toISOString().split('T')[0]}`);
  

  // Generar contribuciones para cada día del último año
  for (let d = new Date(oneYearAgo); d <= today; d.setDate(d.getDate() + 1)) {
    const date = d.toISOString().split('T')[0];
    const count = Math.floor(Math.random() * 15);
    const level = getContributionLevel(count);
    
    contributions.push({
      date,
      count,
      level
    });
  }
  
  const totalContributions = contributions.reduce((sum, day) => sum + day.count, 0);
  const { longestStreak, currentStreak } = calculateStreaks(contributions);

  const dateRange = getDateRange(contributions);
  const summary = generateSummary(contributions);

  
  return {
    contributions,
    totalContributions,
    longestStreak,
    currentStreak,
    dateRange,
    summary

  };
}

// Función para determinar el nivel de contribución
function getContributionLevel(count: number): number {
  if (count === 0) return 0;
  if (count <= 2) return 1;
  if (count <= 5) return 2;
  if (count <= 10) return 3;
  return 4;
}

// Función para calcular rachas
function calculateStreaks(contributions: ContributionDay[]): { longestStreak: number, currentStreak: number } {
  let longestStreak = 0;
  let currentStreak = 0;
  let tempStreak = 0;
  
  // Calcular racha más larga
  for (const day of contributions) {
    if (day.count > 0) {
      tempStreak++;
      longestStreak = Math.max(longestStreak, tempStreak);
    } else {
      tempStreak = 0;
    }
  }
  
  // Calcular racha actual (desde el final)
  for (let i = contributions.length - 1; i >= 0; i--) {
    if (contributions[i].count > 0) {
      currentStreak++;
    } else {
      break;
    }
  }
  
  return { longestStreak, currentStreak };
}

// Query GraphQL para GitHub API con rango de fechas personalizado
const GITHUB_CONTRIBUTIONS_QUERY = `
  query($username: String!, $from: DateTime, $to: DateTime) {
    user(login: $username) {
      contributionsCollection(from: $from, to: $to) {

        contributionCalendar {
          totalContributions
          weeks {
            contributionDays {
              date
              contributionCount
            }
          }
        }
      }
    }
  }
`;

// Función para obtener datos reales de GitHub
async function fetchGitHubContributions(
  username: string, 
  token: string, 
  fromDate?: string, 
  toDate?: string
): Promise<ContributionResponse> {
  try {
    // Si no se especifican fechas, usar el último año
    const from = fromDate || new Date(new Date().setFullYear(new Date().getFullYear() - 1)).toISOString();
    const to = toDate || new Date().toISOString();
    
    console.log(`Fetching GitHub contributions for user: ${username}`);
    console.log(`Date range: ${from} to ${to}`);
    
    const response = await fetch('https://api.github.com/graphql', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query: GITHUB_CONTRIBUTIONS_QUERY,
        variables: { 
          username,
          from,
          to
        }
      })
    });

    if (!response.ok) {
      throw new Error(`GitHub API error: ${response.status} ${response.statusText}`);
    }

    const data: GitHubResponse = await response.json();
    
    if (!data.data?.user) {
      throw new Error('User not found');
    }

    const { contributionCalendar } = data.data.user.contributionsCollection;
    const contributions: ContributionDay[] = [];

    // Procesar las semanas de contribuciones
    contributionCalendar.weeks.forEach(week => {
      week.contributionDays.forEach(day => {
        contributions.push({
          date: day.date,
          count: day.contributionCount,
          level: getContributionLevel(day.contributionCount)
        });
      });
    });

    const { longestStreak, currentStreak } = calculateStreaks(contributions);
    const dateRange = getDateRange(contributions);
    const summary = generateSummary(contributions);

    console.log(`GitHub data fetched: ${contributions.length} days from ${dateRange.from} to ${dateRange.to}`);

    return {
      contributions,
      totalContributions: contributionCalendar.totalContributions,
      longestStreak,
      currentStreak,
      dateRange,
      summary
    };

  } catch (error) {
    console.error('Error fetching GitHub contributions:', error);
    throw error;
  }
}

// Handler para GET requests
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const username = searchParams.get('username');
    const useMock = searchParams.get('mock') === 'true';
    const debug = searchParams.get('debug') === 'true';
    
    // Nuevos parámetros para fechas
    const year = searchParams.get('year');
    const fromDate = searchParams.get('from');
    const toDate = searchParams.get('to');
    
    // Validar username
    if (!username) {
      return NextResponse.json(
        { error: 'Username is required' },
        { status: 400 }
      );
    }

    // Si se solicita mock data, devolver datos simulados
    if (useMock) {
      const mockData = generateMockData();
      
      if (debug) {
        console.log('Mock data summary:');
        console.log(`Date range: ${mockData.dateRange.from} to ${mockData.dateRange.to}`);
        console.log(`Total days: ${mockData.dateRange.totalDays}`);
        console.log(`Total contributions: ${mockData.totalContributions}`);
        console.log(`Active days: ${mockData.summary.activeDays}`);
      }
      
      return NextResponse.json(mockData);
    }

    const token = process.env.GITHUB_TOKEN;

    if (!token) {
      return NextResponse.json(
        { error: 'GitHub token is not set on the server' },
        { status: 500 }
      );
    }


    // Determinar el rango de fechas
    let finalFromDate: string | undefined;
    let finalToDate: string | undefined;

    if (year) {
      // Si se especifica un año, usar todo ese año
      finalFromDate = `${year}-01-01T00:00:00Z`;
      finalToDate = `${year}-12-31T23:59:59Z`;
    } else if (fromDate && toDate) {
      // Si se especifican fechas específicas
      finalFromDate = new Date(fromDate).toISOString();
      finalToDate = new Date(toDate).toISOString();
    } else if (fromDate) {
      // Solo fecha de inicio, hasta hoy
      finalFromDate = new Date(fromDate).toISOString();
      finalToDate = new Date().toISOString();
    }
    // Si no se especifica nada, fetchGitHubContributions usará el último año por defecto

    if (debug) {
      console.log('Request parameters:');
      console.log(`Year: ${year}`);
      console.log(`From: ${fromDate}`);
      console.log(`To: ${toDate}`);
      console.log(`Final range: ${finalFromDate} to ${finalToDate}`);
    }

    // Obtener datos reales de GitHub
    const contributionData = await fetchGitHubContributions(username, token, finalFromDate, finalToDate);
    
    if (debug) {
      console.log('GitHub data summary:');
      console.log(`Date range: ${contributionData.dateRange.from} to ${contributionData.dateRange.to}`);
      console.log(`Total days: ${contributionData.dateRange.totalDays}`);
      console.log(`Total contributions: ${contributionData.totalContributions}`);
      console.log(`Active days: ${contributionData.summary.activeDays}`);
    }
    
    return NextResponse.json(contributionData);

  } catch (error) {
    console.error('API Error:', error);
    
    if (error instanceof Error) {
      // Errores específicos de GitHub API
      if (error.message.includes('GitHub API error')) {
        return NextResponse.json(
          { error: 'Failed to fetch data from GitHub API' },
          { status: 502 }
        );
      }
      
      if (error.message.includes('User not found')) {
        return NextResponse.json(
          { error: 'GitHub user not found' },
          { status: 404 }
        );
      }

      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Handler para POST requests (opcional, para futuros endpoints)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { username, token, year, from, to } = body;

    if (!username || !token) {
      return NextResponse.json(
        { error: 'Username and token are required' },
        { status: 400 }
      );
    }

    // Determinar el rango de fechas desde el body
    let finalFromDate: string | undefined;
    let finalToDate: string | undefined;

    if (year) {
      finalFromDate = `${year}-01-01T00:00:00Z`;
      finalToDate = `${year}-12-31T23:59:59Z`;
    } else if (from && to) {
      finalFromDate = new Date(from).toISOString();
      finalToDate = new Date(to).toISOString();
    } else if (from) {
      finalFromDate = new Date(from).toISOString();
      finalToDate = new Date().toISOString();
    }

    const contributionData = await fetchGitHubContributions(username, token, finalFromDate, finalToDate);
    
    return NextResponse.json(contributionData);

  } catch (error) {
    console.error('POST API Error:', error);
    
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Nuevo endpoint para obtener solo información de fechas (útil para testing)
export async function HEAD(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const username = searchParams.get('username');
    const useMock = searchParams.get('mock') === 'true';
    
    if (!username) {
      return new NextResponse(null, { status: 400 });
    }

    let dateInfo;
    
    if (useMock) {
      const mockData = generateMockData();
      dateInfo = mockData.dateRange;
    } else {
      const token = process.env.GITHUB_TOKEN;

      if (!token) {
        return NextResponse.json(
          { error: 'GitHub token is not set on the server' },
          { status: 500 }
        );
      }
      
      if (!token) {
        return new NextResponse(null, { status: 401 });
      }
      
      const contributionData = await fetchGitHubContributions(username, token);
      dateInfo = contributionData.dateRange;
    }
    
    return new NextResponse(null, {
      status: 200,
      headers: {
        'X-Date-From': dateInfo.from,
        'X-Date-To': dateInfo.to,
        'X-Total-Days': dateInfo.totalDays.toString()
      }
    });
    
  } catch (error) {
    return new NextResponse(null, { status: 500 });
  }
}

// Configuración para el runtime
export const runtime = 'nodejs';

// Configuración de CORS (opcional)
export async function OPTIONS(request: NextRequest) {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, HEAD, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
}