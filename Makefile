PEG=./node_modules/.bin/peggy
JEST=./node_modules/.bin/jest
COVERALLS=./node_modules/coveralls/bin/coveralls.js
CAT=cat
GAIMAN=./bin/compile.js
ROLLUP=./node_modules/.bin/rollup

.PHONY: test coveralls demo

all: umd.js

parser.js: Makefile ./src/grammar.pegjs
	$(PEG) -o parser.js ./src/grammar.pegjs

umd.js: parser.js index.js rollup.config.js ./src/banner.js
	$(ROLLUP) -c

demo:
	$(GAIMAN) -o docs/demo/ examples/demo.gs

test:
	$(JEST) --coverage --testMatch '**/__tests__/*.spec.js'

test-accept-snapshots:
	$(JEST) --coverage --updateSnapshot --testMatch '**/__tests__/*.spec.js'

coveralls:
	$(CAT) ./coverage/lcov.info | $(COVERALLS)
