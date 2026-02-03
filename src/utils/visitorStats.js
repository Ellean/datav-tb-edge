// 通用 visitor_count 解析与统计工具

/**
 * 解析 visitor_count 原始值为对象
 */
export function parseVisitorCount(visitorCountRaw) {
  if (!visitorCountRaw) return {};
  if (typeof visitorCountRaw === "string") {
    try {
      return JSON.parse(visitorCountRaw) || {};
    } catch {
      return {};
    }
  }
  if (typeof visitorCountRaw === "object") {
    return visitorCountRaw || {};
  }
  return {};
}

/**
 * 获取当前日期字符串
 */
export function getCurrentDateParts() {
  const now = new Date();
  return {
    year: String(now.getFullYear()),
    month: String(now.getMonth() + 1).padStart(2, "0"),
    date: String(now.getDate()).padStart(2, "0"),
  };
}

/**
 * 统计某天所有类型累加和
 */
export function countDay(visitorCount, year, month, date) {
  const dayData = visitorCount[year]?.[month]?.[date];
  if (!dayData) return 0;
  return Object.values(dayData).reduce(
    (sum, v) => sum + (Number.isFinite(Number(v)) ? Number(v) : 0),
    0
  );
}

/**
 * 统计某月所有类型累加和
 */
export function countMonth(visitorCount, year, month) {
  const monthData = visitorCount[year]?.[month];
  if (!monthData) return 0;
  return Object.values(monthData).reduce(
    (sum, day) =>
      sum +
      Object.values(day).reduce(
        (s, v) => s + (Number.isFinite(Number(v)) ? Number(v) : 0),
        0
      ),
    0
  );
}

/**
 * 统计某年所有类型累加和
 */
export function countYear(visitorCount, year) {
  const yearData = visitorCount[year];
  if (!yearData) return 0;
  return Object.values(yearData).reduce(
    (sum, month) =>
      sum +
      Object.values(month).reduce(
        (monthSum, day) =>
          monthSum +
          Object.values(day).reduce(
            (s, v) => s + (Number.isFinite(Number(v)) ? Number(v) : 0),
            0
          ),
        0
      ),
    0
  );
}

/**
 * 统计总计所有类型累加和
 */
export function countTotal(visitorCount) {
  let sum = 0;
  for (const year of Object.values(visitorCount)) {
    for (const month of Object.values(year)) {
      for (const day of Object.values(month)) {
        sum += Object.values(day).reduce(
          (s, v) => s + (Number.isFinite(Number(v)) ? Number(v) : 0),
          0
        );
      }
    }
  }
  return sum;
}

/**
 * 初始化 visitor_count 嵌套结构，确保 year/month/date/type 层级存在
 */
export function initVisitorCountStructure(
  visitorCount,
  year,
  month,
  date,
  type
) {
  visitorCount[year] = visitorCount[year] || {};
  visitorCount[year][month] = visitorCount[year][month] || {};
  visitorCount[year][month][date] = visitorCount[year][month][date] || {};
  visitorCount[year][month][date][type] =
    visitorCount[year][month][date][type] ?? 0;
}

/**
 * 统计某天指定类型的累加和
 */
export function countTypeDay(visitorCount, year, month, date, type) {
  const dayData = visitorCount[year]?.[month]?.[date];
  return Number.isFinite(Number(dayData?.[type])) ? Number(dayData[type]) : 0;
}

/**
 * 统计某月指定类型的累加和
 */
export function countTypeMonth(visitorCount, year, month, type) {
  const monthData = visitorCount[year]?.[month];
  if (!monthData) return 0;
  let total = 0;
  for (const day of Object.values(monthData)) {
    if (Number.isFinite(Number(day[type]))) {
      total += Number(day[type]);
    }
  }
  return total;
}
