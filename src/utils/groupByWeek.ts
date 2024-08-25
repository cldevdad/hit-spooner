import { startOfWeek, endOfWeek, format } from "date-fns";
import { IDailyHitStatistic } from "@hit-spooner/api";

export const groupByWeek = (dailyStats: IDailyHitStatistic[]) => {
  const weeks: Record<string, IDailyHitStatistic[]> = {};
  dailyStats.forEach((stat) => {
    const start = startOfWeek(new Date(stat.date), { weekStartsOn: 0 });
    const end = endOfWeek(new Date(stat.date), { weekStartsOn: 0 });
    const weekLabel = `${format(start, "MM/dd")} - ${format(end, "MM/dd")}`;

    if (!weeks[weekLabel]) {
      weeks[weekLabel] = [];
    }
    weeks[weekLabel].push(stat);
  });
  return weeks;
};
