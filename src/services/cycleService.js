function parseDate(value) {
  if (!value) return null;
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
}

function addDays(date, days) {
  const next = new Date(date);
  next.setDate(next.getDate() + days);
  return next;
}

export function getCycleStatus(profile, now = new Date()) {
  if (profile?.gender !== "female") {
    return { applicable: false, inWindow: false };
  }

  const last = parseDate(profile.lastPeriodDate);
  const cycleLength = Number(profile.cycleLength) || 28;
  const periodDuration = Number(profile.periodDuration) || 5;
  if (!last) {
    return { applicable: true, inWindow: false, unknown: true };
  }

  const daysSince = Math.floor((now - last) / 86400000);
  const dayInCycle = ((daysSince % cycleLength) + cycleLength) % cycleLength;
  const inWindow = dayInCycle <= periodDuration + 1 || dayInCycle >= cycleLength - 2;
  const startingSoon = dayInCycle >= cycleLength - 2;
  const estimatedStart = addDays(last, Math.floor(daysSince / cycleLength) * cycleLength + cycleLength);

  return {
    applicable: true,
    inWindow,
    startingSoon,
    dayInCycle: dayInCycle + 1,
    cycleLength,
    periodDuration,
    estimatedStart: estimatedStart.toISOString().slice(0, 10),
    message: startingSoon
      ? "Your period may be starting soon."
      : inWindow
        ? "You may be in your period window."
        : "Cycle Care is available anytime you want gentler options.",
    suggestions: [
      "Gentle movement or yoga",
      "Rest if energy is low",
      "Hydration",
      "Nourishing meals",
    ],
    disclaimer: "These are general wellbeing suggestions, not medical advice.",
  };
}
