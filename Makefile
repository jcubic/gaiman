PEG_JS=./node_modules/.bin/pegjs
JEST=./node_modules/.bin/jest
COVERALLS=./node_modules/coveralls/bin/coveralls.js
CAT=cat

.PHONY: test coveralls

all: parser.js

parser.js: ./src/grammar.pegjs
	$(PEG_JS) -o parser.js ./src/grammar.pegjs

test:
	$(JEST) --coverage --testMatch '**/__tests__/*.spec.js'

test-accept-snapshots:
	$(JEST) --coverage --updateSnapshot --testMatch '**/__tests__/*.spec.js'

coveralls:
	$(CAT) ./coverage/lcov.info | $(COVERALLS)
