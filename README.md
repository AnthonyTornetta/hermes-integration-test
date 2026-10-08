# Tenant cron acceptance

App root: `apps/web`. Set a random CRON_SECRET in preview and production before deploying.
The tick job runs every minute in UTC after production promotion. Other jobs
are scheduled for leap day and exercised through Run now: redirect, failure,
function timeout, middleware rejection, and oversized response. `/api/status`
reports bounded non-secret in-memory evidence; it resets when the worker stops.
No header or secret values are logged or returned. Unauthorized job calls return 401.
