#!/bin/bash
# Generate code coverage and post it to Coveralls.
set -x

# Generate LCOV data for the bundled tests
grunt coverage


# dump it out temporarily for debugging
./scripts/transform-coverage.js \
  build/tests.map \
  build/bundled.lcov

# Convert code coverage data on the bundled test file back to the originals.
./scripts/transform-coverage.js \
  build/tests.map \
  build/bundled.lcov \
  | ./node_modules/.bin/coveralls

echo ''  # reset last exit code
