# Application cache live fixture

Use project root `fixtures/cache`, output `site`, install/build commands `true`.
Set `FIXTURE_SECRET` and group markers `GROUP_A=a`, `GROUP_B=b` for preview and
production. Distinct environment allowlists create two independent workloads.
All cache operations require POST and `x-fixture-token` equal to the secret;
responses never include the secret. This fixture contains no cron schedules.

Send JSON with `op`, `key`, optional `tags`, `payload` (base64) and `ttl` seconds.
Operations: `read`, `write` (read then conditional write), `invalidate`, `cas`
(two writes from one observation), `stale` (invalidate between read and write),
`fence-stream` (emit a read marker, wait 1.5 seconds, then conditionally write),
`caught-failure` and `stream-failure` (explicit SDK error handling probes).
Responses identify language, group, PID and unexpected platform/other-group env
visibility. No API accepts deployment IDs, namespace selection or capabilities.
The harness must record actual saved workload and image identities separately.

Create another immutable deployment/project to test namespace separation. Run
language families serially on the capped pilot worker, recording observed zero
replicas and fresh activation before claiming persistence across scale-to-zero.
