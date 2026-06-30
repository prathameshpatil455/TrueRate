import type { ComparisonPriority, ComparisonRoute } from "@truerate/shared";

const BALANCED_COST_WEIGHT = 0.6;
const BALANCED_TIME_WEIGHT = 0.4;
const RAIL_PREFERENCE_WEIGHT = 0.5;

function normalize(values: number[]): number[] {
  const min = Math.min(...values);
  const max = Math.max(...values);
  if (max === min) return values.map(() => 0);
  return values.map((v) => (v - min) / (max - min));
}

function isDigitalRoute(route: Pick<ComparisonRoute, "providerType">): boolean {
  return route.providerType === "stablecoin" || route.providerType === "crypto";
}

function isTraditionalRoute(route: Pick<ComparisonRoute, "providerType">): boolean {
  return route.providerType === "swift" || route.providerType === "remittance";
}

function buildExplanation(
  route: ComparisonRoute,
  priority: ComparisonPriority,
): string {
  if (priority === "cheapest") {
    return `${route.providerName} has the lowest total fee (${route.totalFee.toFixed(2)}) for this transfer.`;
  }
  if (priority === "highest_received") {
    return `${route.providerName} delivers the highest amount received (${route.amountReceived.toFixed(2)}) in the destination currency.`;
  }
  if (priority === "fastest") {
    const hours =
      route.estimatedTimeHours < 1
        ? `~${Math.round(route.estimatedTimeHours * 60)} minutes`
        : `~${route.estimatedTimeHours} hours`;
    return `${route.providerName} offers the fastest estimated settlement (${hours}).`;
  }
  if (priority === "traditional") {
    return `${route.providerName} is the best bank or remittance option for this transfer.`;
  }
  if (priority === "digital") {
    return `${route.providerName} is the best crypto or stablecoin route for this transfer.`;
  }
  return `${route.providerName} offers the best balance of low cost and fast settlement for your priority.`;
}

export function rankRoutes(
  routes: Omit<ComparisonRoute, "rank" | "isRecommended" | "explanation">[],
  priority: ComparisonPriority,
): ComparisonRoute[] {
  if (routes.length === 0) return [];

  const costs = routes.map((r) => r.totalFee);
  const times = routes.map((r) => r.estimatedTimeHours);
  const received = routes.map((r) => r.amountReceived);
  const normCosts = normalize(costs);
  const normTimes = normalize(times);

  const scored = routes.map((route, index) => {
    let score: number;

    if (priority === "cheapest") {
      score = costs[index];
    } else if (priority === "highest_received") {
      score = -received[index];
    } else if (priority === "fastest") {
      score = times[index];
    } else if (priority === "traditional") {
      score =
        normCosts[index] * BALANCED_COST_WEIGHT +
        normTimes[index] * BALANCED_TIME_WEIGHT +
        (isDigitalRoute(route) ? RAIL_PREFERENCE_WEIGHT : 0);
    } else if (priority === "digital") {
      score =
        normCosts[index] * BALANCED_COST_WEIGHT +
        normTimes[index] * BALANCED_TIME_WEIGHT +
        (isTraditionalRoute(route) ? RAIL_PREFERENCE_WEIGHT : 0);
    } else {
      score =
        normCosts[index] * BALANCED_COST_WEIGHT +
        normTimes[index] * BALANCED_TIME_WEIGHT;
    }

    return { route, score };
  });

  scored.sort((a, b) => a.score - b.score);

  return scored.map(({ route }, index) => {
    const ranked: ComparisonRoute = {
      ...route,
      rank: index + 1,
      isRecommended: index === 0,
      explanation: null,
    };
    ranked.explanation = index === 0 ? buildExplanation(ranked, priority) : null;
    return ranked;
  });
}

export function getRecommendedRouteId(routes: ComparisonRoute[]): string {
  return routes.find((r) => r.isRecommended)?.routeId ?? routes[0]?.routeId ?? "";
}
