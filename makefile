# Build the code, pretty trivial for a Node.js project.
build:
	cd aac-cli && npm install

# Test the code. First lints, then runs the unit tests, checking coverage.
test: build
	cd aac-cli && npm run lint
	cd aac-cli && npm run test

# Run the CircleCI build locally.
circleci:
	curl -fLSs https://circle.ci/cli | bash
	circleci config validate -c .circleci/config.yml
	circleci build --job test

# Let make know that these commands are not folder or file names, but command
# names (otherwise a folder called 'test' could stop the test recipe working).
.PHONY: build test circleci
