# Shared-serving Svelte fixture

This branch contains a root SvelteKit app and `apps/site` npm workspace. Select
`.` or `apps/site` as the Arvumi project root. Install from the committed root
npm-v3 lockfile. The adapter is bundled in the Svelte build image; it is not a
public npm dependency.

Set harmless `FIXTURE_MARKER`, a synthetic `FIXTURE_SECRET`, and a synthetic
`CRON_SECRET` when provisioning test deployments. `/env` reports only the harmless
marker, secret presence, and captured `fixtures/runtime.txt`; it never returns
secret values. Both configs request the app's 512 MiB resource setting.

Routes: SSR/form `/`, `/prerendered`, `/env`, `/stream`, `/cache`, `/background`,
and authenticated GET `/jobs/check`. `/rewritten` rewrites to `/env`. Root and
workspace responses have distinct markers.

For cache checks, DELETE the fixed tag, GET a miss, POST the fixed value, GET the
value, then DELETE and GET a miss. For background checks, DELETE its fixed tag,
GET a miss, POST and retain the returned `expected` value, then poll GET at most
20 times one second apart for that exact value. A previous run's marker is not a
success. Cache operations require an actual supervised application-cache service.
Cron endpoint checks alone do not prove scheduler production selection/history.

No fault, crash, exhaustion or forced-termination fixtures are included. Local
packaged results and deployment acceptance are recorded separately in Arvumi.

The application packages declare `files: ["build"]`. Arvumi uses npm packlist
for installed workspace packages, so this keeps sibling application source and
build configuration out of the runtime archive. The selected application build
and explicit runtime file are captured separately. Kit 3 library imports use
the package `imports` mapping for `#lib/*`.

Additional serving coverage: `/navigation` is a normal Svelte client-navigation
page; `/cookies` sets two harmless secure fixture cookies; `/lazy` dynamically
loads the external workspace production package and its data file. Both apps
declare `/fixture.png` as the local source for `/_arvumi/image`. Reproduce the
24x12 raster with `python3 -B fixtures/make-raster.py`. Local packaged checks do
not establish browser navigation or deployed image optimization acceptance.

Browser fixtures expose document-instance and hydration data attributes. The
primary form uses Kit enhancement; the unchecked “Include unexpected field”
control exercises strict server validation. The separate plain form exercises
ordinary document POST. Browser and deployed acceptance are recorded separately.
