export type RecurrenceFrequency = 'weekly' | 'biweekly' | 'semimonthly' | 'monthly' | 'onetime';

export type CategoryType = 'income' | 'fixed_expense' | 'subscription' | 'liability' | 'savings' | 'spend';

export interface ForecastItem {
  id: string;
  name: string;
  amount: number;
  category: CategoryType;
  frequency: RecurrenceFrequency;
  startDate: string; // YYYY-MM-DD
  dayOfMonth?: number; // 1-31 for monthly/semimonthly
  dayOfMonth2?: number; // Second date for semimonthly (e.g., 15 & 30)
  active: boolean;
  notes?: string;
}

export interface ItemOccurrence {
  itemId: string;
  itemName: string;
  amount: number;
  category: CategoryType;
  date: string; // YYYY-MM-DD
}

export interface DailyOccurrenceGroup {
  date: string; // YYYY-MM-DD
  dayName: string; // Mon, Tue, Wed...
  occurrences: ItemOccurrence[];
  totalIncome: number;
  totalOutgoings: number;
}

export interface WeeklyForecast {
  weekNumber: number; // 1 to 13
  startDate: string; // YYYY-MM-DD (Monday)
  endDate: string; // YYYY-MM-DD (Sunday)
  label: string; // e.g. "Week 1 (Nov 9)"
  
  // Category Breakdown
  incomeTotal: number;
  fixedExpensesTotal: number;
  subscriptionsTotal: number;
  liabilitiesTotal: number;
  savingsTotal: number;
  spendTotal: number;
  
  // Combined non-income outgoings
  outgoingsTotal: number;
  
  // Net cash change for the week (income - outgoings)
  netChange: number;
  
  // Cumulative projected balance up to end of this week
  projectedBalance: number;
  
  // Shortfall status (if projected balance drops below $0)
  isShortfall: boolean;
  shortfallAmount: number;
  
  // Detailed occurrences grouped by day (Monday to Sunday)
  dailyGroups: DailyOccurrenceGroup[];
  allOccurrences: ItemOccurrence[];
}

export interface ForecastSummary {
  ending13WeekBalance: number;
  lowestBalance: number;
  lowestBalanceWeek: number;
  shortfallCount: number;
  firstShortfallWeek: number | null;
  totalIncome13Weeks: number;
  totalOutgoings13Weeks: number;
  totalItemsCount: number;
}

export const CATEGORY_LABELS: Record<CategoryType, string> = {
  income: 'Income',
  fixed_expense: 'Fixed Expenses',
  subscription: 'Subscriptions',
  liability: 'Liabilities',
  savings: 'Savings',
  spend: 'Spend',
};

export const FREQUENCY_LABELS: Record<RecurrenceFrequency, string> = {
  weekly: 'Weekly',
  biweekly: 'Bi-weekly',
  semimonthly: 'Semi-monthly (2x/mo)',
  monthly: 'Monthly',
  onetime: 'One-time',
};

export function getMonday(d: Date): Date {
  const date = new Date(d);
  const day = date.getDay();
  const diff = date.getDate() - day + (day === 0 ? -6 : 1);
  const monday = new Date(date.setDate(diff));
  monday.setHours(0, 0, 0, 0);
  return monday;
}

export function formatDateISO(d: Date): string {
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function formatDateShort(isoString: string): string {
  const [year, month, day] = isoString.split('-').map(Number);
  const date = new Date(year, month - 1, day);
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

export function getDayName(isoString: string): string {
  const [year, month, day] = isoString.split('-').map(Number);
  const date = new Date(year, month - 1, day);
  return date.toLocaleDateString('en-US', { weekday: 'short' });
}

function getItemOccurrencesInWindow(
  item: ForecastItem,
  windowStartMonday: Date,
  windowEndSunday: Date
): ItemOccurrence[] {
  if (!item.active || item.amount <= 0) return [];

  const occurrences: ItemOccurrence[] = [];
  const startObj = new Date(item.startDate + 'T00:00:00');
  
  if (isNaN(startObj.getTime())) return [];

  const windowStartTime = windowStartMonday.getTime();
  const windowEndTime = windowEndSunday.getTime();

  if (item.frequency === 'onetime') {
    if (startObj.getTime() >= windowStartTime && startObj.getTime() <= windowEndTime) {
      occurrences.push({
        itemId: item.id,
        itemName: item.name,
        amount: item.amount,
        category: item.category,
        date: item.startDate,
      });
    }
    return occurrences;
  }

  if (item.frequency === 'weekly' || item.frequency === 'biweekly') {
    const stepDays = item.frequency === 'weekly' ? 7 : 14;
    let curr = new Date(startObj);

    if (curr.getTime() < windowStartTime) {
      const msDiff = windowStartTime - curr.getTime();
      const stepMs = stepDays * 24 * 60 * 60 * 1000;
      const stepsToSkip = Math.floor(msDiff / stepMs);
      curr.setDate(curr.getDate() + stepsToSkip * stepDays);
    }

    while (curr.getTime() <= windowEndTime) {
      if (curr.getTime() >= windowStartTime && curr.getTime() >= startObj.getTime()) {
        occurrences.push({
          itemId: item.id,
          itemName: item.name,
          amount: item.amount,
          category: item.category,
          date: formatDateISO(curr),
        });
      }
      curr.setDate(curr.getDate() + stepDays);
    }
    return occurrences;
  }

  if (item.frequency === 'monthly') {
    const targetDay = item.dayOfMonth || startObj.getDate();
    const currMonth = new Date(windowStartMonday.getFullYear(), windowStartMonday.getMonth(), 1);
    const lastMonth = new Date(windowEndSunday.getFullYear(), windowEndSunday.getMonth() + 1, 0);

    while (currMonth <= lastMonth) {
      const year = currMonth.getFullYear();
      const month = currMonth.getMonth();
      const maxDays = new Date(year, month + 1, 0).getDate();
      const actualDay = Math.min(targetDay, maxDays);
      const targetDate = new Date(year, month, actualDay);

      if (
        targetDate.getTime() >= startObj.getTime() &&
        targetDate.getTime() >= windowStartTime &&
        targetDate.getTime() <= windowEndTime
      ) {
        occurrences.push({
          itemId: item.id,
          itemName: item.name,
          amount: item.amount,
          category: item.category,
          date: formatDateISO(targetDate),
        });
      }
      currMonth.setMonth(currMonth.getMonth() + 1);
    }
    return occurrences;
  }

  if (item.frequency === 'semimonthly') {
    const d1 = item.dayOfMonth || 1;
    const d2 = item.dayOfMonth2 || 15;
    
    const currMonth = new Date(windowStartMonday.getFullYear(), windowStartMonday.getMonth(), 1);
    const lastMonth = new Date(windowEndSunday.getFullYear(), windowEndSunday.getMonth() + 1, 0);

    while (currMonth <= lastMonth) {
      const year = currMonth.getFullYear();
      const month = currMonth.getMonth();
      const maxDays = new Date(year, month + 1, 0).getDate();

      [d1, d2].forEach((d) => {
        const actualDay = Math.min(d, maxDays);
        const targetDate = new Date(year, month, actualDay);
        if (
          targetDate.getTime() >= startObj.getTime() &&
          targetDate.getTime() >= windowStartTime &&
          targetDate.getTime() <= windowEndTime
        ) {
          occurrences.push({
            itemId: item.id,
            itemName: item.name,
            amount: item.amount,
            category: item.category,
            date: formatDateISO(targetDate),
          });
        }
      });

      currMonth.setMonth(currMonth.getMonth() + 1);
    }
    return occurrences;
  }

  return occurrences;
}

export function calculate13WeekForecast(
  items: ForecastItem[],
  anchorMondayDate: Date
): { weeks: WeeklyForecast[]; summary: ForecastSummary } {
  const startMonday = new Date(anchorMondayDate);
  startMonday.setHours(0, 0, 0, 0);

  const windowEndSunday = new Date(startMonday);
  windowEndSunday.setDate(windowEndSunday.getDate() + (13 * 7 - 1));
  windowEndSunday.setHours(23, 59, 59, 999);

  const allOccurrences: ItemOccurrence[] = [];
  items.forEach((item) => {
    const occs = getItemOccurrencesInWindow(item, startMonday, windowEndSunday);
    allOccurrences.push(...occs);
  });

  const weeks: WeeklyForecast[] = [];
  let runningBalance = 0;

  let lowestBalance = 0;
  let lowestBalanceWeek = 1;
  let firstShortfallWeek: number | null = null;
  let totalIncome13Weeks = 0;
  let totalOutgoings13Weeks = 0;

  for (let w = 1; w <= 13; w++) {
    const weekMon = new Date(startMonday);
    weekMon.setDate(weekMon.getDate() + (w - 1) * 7);

    const weekSun = new Date(weekMon);
    weekSun.setDate(weekSun.getDate() + 6);

    const monISO = formatDateISO(weekMon);
    const sunISO = formatDateISO(weekSun);

    // Filter occurrences for this week
    const weekOccurrences = allOccurrences.filter((occ) => occ.date >= monISO && occ.date <= sunISO);

    // Group by exact day of week (Mon, Tue, Wed, Thu, Fri, Sat, Sun)
    const dailyGroups: DailyOccurrenceGroup[] = [];
    for (let d = 0; d < 7; d++) {
      const dayDate = new Date(weekMon);
      dayDate.setDate(dayDate.getDate() + d);
      const dayISO = formatDateISO(dayDate);
      const dayOccs = weekOccurrences.filter((occ) => occ.date === dayISO);

      let dayIncome = 0;
      let dayOutgoings = 0;
      dayOccs.forEach((occ) => {
        if (occ.category === 'income') dayIncome += occ.amount;
        else dayOutgoings += occ.amount;
      });

      dailyGroups.push({
        date: dayISO,
        dayName: getDayName(dayISO),
        occurrences: dayOccs,
        totalIncome: dayIncome,
        totalOutgoings: dayOutgoings,
      });
    }

    let incomeTotal = 0;
    let fixedExpensesTotal = 0;
    let subscriptionsTotal = 0;
    let liabilitiesTotal = 0;
    let savingsTotal = 0;
    let spendTotal = 0;

    weekOccurrences.forEach((occ) => {
      switch (occ.category) {
        case 'income':
          incomeTotal += occ.amount;
          break;
        case 'fixed_expense':
          fixedExpensesTotal += occ.amount;
          break;
        case 'subscription':
          subscriptionsTotal += occ.amount;
          break;
        case 'liability':
          liabilitiesTotal += occ.amount;
          break;
        case 'savings':
          savingsTotal += occ.amount;
          break;
        case 'spend':
          spendTotal += occ.amount;
          break;
      }
    });

    const outgoingsTotal = fixedExpensesTotal + subscriptionsTotal + liabilitiesTotal + savingsTotal + spendTotal;
    const netChange = incomeTotal - outgoingsTotal;
    runningBalance += netChange;

    totalIncome13Weeks += incomeTotal;
    totalOutgoings13Weeks += outgoingsTotal;

    const isShortfall = runningBalance < 0;
    const shortfallAmount = isShortfall ? Math.abs(runningBalance) : 0;

    if (w === 1 || runningBalance < lowestBalance) {
      lowestBalance = runningBalance;
      lowestBalanceWeek = w;
    }

    if (isShortfall && firstShortfallWeek === null) {
      firstShortfallWeek = w;
    }

    weeks.push({
      weekNumber: w,
      startDate: monISO,
      endDate: sunISO,
      label: `Week ${w} (${formatDateShort(monISO)})`,
      incomeTotal,
      fixedExpensesTotal,
      subscriptionsTotal,
      liabilitiesTotal,
      savingsTotal,
      spendTotal,
      outgoingsTotal,
      netChange,
      projectedBalance: runningBalance,
      isShortfall,
      shortfallAmount,
      dailyGroups,
      allOccurrences: weekOccurrences,
    });
  }

  const shortfallCount = weeks.filter((w) => w.isShortfall).length;

  const summary: ForecastSummary = {
    ending13WeekBalance: runningBalance,
    lowestBalance,
    lowestBalanceWeek,
    shortfallCount,
    firstShortfallWeek,
    totalIncome13Weeks,
    totalOutgoings13Weeks,
    totalItemsCount: items.length,
  };

  return { weeks, summary };
}

// Initial empty items array (no dummy data)
export const DEFAULT_SAMPLE_ITEMS: ForecastItem[] = [];
