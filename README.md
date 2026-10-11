# CP102 build accounting smoke

Dependency-free static output and one standalone Node handler. `node build.cjs`
writes the marker and waits 70 seconds on an idle timer so the ordinary allocation
collector can observe the build. No network, secrets, crash or failure routes.
