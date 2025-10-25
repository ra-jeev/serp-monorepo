import type { H3Event } from 'h3';

export function getDbConnectionString(event: H3Event) {
  const hyperdrive = event.context.cloudflare?.env?.HYPERDRIVE;
  if (hyperdrive?.connectionString) {
    return hyperdrive.connectionString;
  }

  throw createError({
    statusCode: 500,
    statusMessage: 'Database connection url not set',
  });
}
