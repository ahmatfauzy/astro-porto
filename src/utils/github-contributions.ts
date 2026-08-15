export interface GithubContributionDay {
  date: string;
  count: number;
  level: 0 | 1 | 2 | 3 | 4;
}

export interface GithubLatestActivity {
  repo: string;
  href: string;
  date: Date;
}

export interface GithubContributions {
  total: number;
  activeDays: number;
  currentStreak: number;
  days: GithubContributionDay[];
  latest: GithubLatestActivity | null;
}

const CONTRIBUTIONS_URL = 'https://github.com/users/{username}/contributions';
const EVENTS_URL = 'https://api.github.com/users/{username}/events/public?per_page=30';
const CONTRIBUTIONS_YEAR_RANGE_START = 2016;

const DAY_CELL_RE =
  /data-date="(\d{4}-\d{2}-\d{2})"[^>]*?id="(contribution-day-component-[^"]+)"[^>]*?data-level="(\d)"/g;
const DAY_TOOLTIP_RE = /<tool-tip[^>]*for="(contribution-day-component-[^"]+)"[^>]*>([\s\S]*?)<\/tool-tip>/g;
const TOOLTIP_COUNT_RE = /(\d+)\s+contributions?/;

function fetchWithTimeout(url: string) {
  return fetch(url, {
    headers: {
      'User-Agent': 'astro-navfolio',
    },
    signal: AbortSignal.timeout(15_000),
  });
}

export async function getGithubContributions(username: string): Promise<GithubContributions | null> {
  try {
    const response = await fetchWithTimeout(CONTRIBUTIONS_URL.replace('{username}', username));

    if (!response.ok) return null;

    const html = await response.text();
    const days = parseContributionDays(html);

    if (days.length === 0) return null;

    const latest = await getLatestActivity(username);
    const today = getDateKey(new Date());
    let currentStreak = 0;

    for (let index = days.length - 1; index >= 0; index -= 1) {
      const day = days[index];
      if (day.date > today) continue;
      if (day.count === 0) break;

      currentStreak += 1;
    }

    const total = await getAllTimeContributions(username);

    return {
      total,
      activeDays: days.filter((day) => day.count > 0).length,
      currentStreak,
      days,
      latest,
    };
  } catch {
    return null;
  }
}

async function getAllTimeContributions(username: string): Promise<number> {
  const currentYear = new Date().getFullYear();
  let total = 0;

  for (let year = currentYear; year >= CONTRIBUTIONS_YEAR_RANGE_START; year -= 1) {
    try {
      const yearTotal = await fetchYearTotal(username, year);
      if (yearTotal === 0) break;
      total += yearTotal;
    } catch {
      break;
    }
  }

  return total;
}

async function fetchYearTotal(username: string, year: number): Promise<number> {
  const url = `${CONTRIBUTIONS_URL.replace('{username}', username)}?from=${year}-01-01&to=${year}-12-31`;
  const response = await fetchWithTimeout(url);

  if (!response.ok) throw new Error(`Failed to fetch contributions for ${year}`);

  const html = await response.text();
  const days = parseContributionDays(html);

  return days.reduce((sum, day) => sum + day.count, 0);
}

function parseContributionDays(html: string): GithubContributionDay[] {
  const cells = new Map<string, { date: string; level: GithubContributionDay['level'] }>();

  for (const match of html.matchAll(DAY_CELL_RE)) {
    const id = match[2];
    const level = Number(match[3]);

    if (level < 0 || level > 4) continue;

    cells.set(id, { date: match[1], level: level as GithubContributionDay['level'] });
  }

  const days: GithubContributionDay[] = [];

  for (const match of html.matchAll(DAY_TOOLTIP_RE)) {
    const cell = cells.get(match[1]);
    if (!cell) continue;

    const countMatch = match[2].match(TOOLTIP_COUNT_RE);
    const count = countMatch ? Number(countMatch[1]) : 0;

    days.push({ date: cell.date, count, level: cell.level });
  }

  return days.sort((a, b) => a.date.localeCompare(b.date));
}

async function getLatestActivity(username: string): Promise<GithubLatestActivity | null> {
  try {
    const response = await fetchWithTimeout(EVENTS_URL.replace('{username}', username));

    if (!response.ok) return null;

    const events = (await response.json()) as Array<{
      type?: string;
      repo?: { name?: string };
      payload?: { head?: string | null; commits?: Array<{ message?: string }> };
      created_at?: string;
    }>;

    const pushEvent = events.find((event) => event.type === 'PushEvent' && event.repo?.name);

    if (!pushEvent?.repo?.name) return null;

    const repo = pushEvent.repo.name;
    const commitSha = pushEvent.payload?.head;

    return {
      repo,
      href: commitSha
        ? `https://github.com/${repo}/commit/${commitSha}`
        : `https://github.com/${repo}`,
      date: new Date(pushEvent.created_at ?? Date.now()),
    };
  } catch {
    return null;
  }
}

export function getDateKey(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
}