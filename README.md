# Ordinary near-limit build transfer

This dependency-free fixture generates four 60 MiB files (240 MiB total) for a
successful build-output transfer through Arvumi's existing Kubernetes path.
Generated files are ignored and are not part of the source checkout.

Configure a dedicated project with repository root `.`, install
command `true` (explicit no-op, preventing the default npm install), build command `node build.mjs`, and output directory `dist`.
`arvumi.json` disables compiler caching. No secrets or environment values are
needed. The build refuses existing `dist` or `arvumi` paths; use a fresh checkout.

Two files go into `dist` and two into `arvumi/functions`, keeping static output
at 120 MiB under the existing 128 MiB publication limit. The complete 240 MiB
payload still crosses the build exchange. The generated Node function manifest
exposes `GET /api/transfer`, which streams its two fixed asset files through
SHA-256 and returns their sizes and hashes. It takes no file path or other
configuration from the request. Other methods return 405. Use concurrency 1,
timeout 30 seconds, CPU 100m and memory 512 MiB for the function.

Each `part-N.bin` repeats a 1 MiB block sixty times. Byte J of that block is
`(N * 53 + J * 17) % 256`. Successful completion prints one JSON record containing
file names, output roots, sizes, SHA-256 hashes, and the total size. ARV1 is uncompressed, so the
predictable bytes still traverse the full paced transfer path.

Local generation and packing are preparation only. Kubernetes acceptance must
also verify immutable images, terminal Job/Pod identity, actual transfer pacing,
writer teardown, exact archive/unpack, and ordinary cleanup. Do not use this
fixture to induce timeouts, crashes, or resource exhaustion. A successful build
of this fixture does not replace framework-specific serving tests.
