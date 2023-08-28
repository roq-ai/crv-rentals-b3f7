const mapping: Record<string, string> = {
  companies: 'company',
  outlets: 'outlet',
  rentals: 'rental',
  tools: 'tool',
  users: 'user',
};

export function convertRouteToEntityUtil(route: string) {
  return mapping[route] || route;
}
