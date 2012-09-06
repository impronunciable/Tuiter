ALL_TESTS = $(shell find test/ -name '*.test.js' ! -name '._*')

run-tests:
	@./node_modules/.bin/mocha \
		$(TESTFLAGS) \
		$(TESTS) -r should -t 10000

test:
	@$(MAKE) NODE_PATH=lib TESTS="$(ALL_TESTS)" run-tests

test-streaming:
	@$(MAKE) NODE_PATH=lib TESTS="test/streaming.test.js" run-tests


.PHONY: test
