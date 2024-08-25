import {
  IAvailableEarnings,
  IDailyHitStatistic,
  IEarningsByPeriod,
  IHitsOverview,
} from "./mturk";

export interface IDashboardData {
  available_earnings: IAvailableEarnings;
  hits_overview: IHitsOverview;
  daily_hit_statistics_overview: IDailyHitStatistic[];
  earnings_to_date: {
    approved: number;
    bonuses: number;
    total_earnings: number;
  };
  earnings_by_period: IEarningsByPeriod;
}
