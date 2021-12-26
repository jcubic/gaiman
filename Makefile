PEG=./node_modules/.bin/peggy
JEST=./node_modules/.bin/jest
COVERALLS=./node_modules/coveralls/bin/coveralls.js
CAT=cat
CURL=curl
GREP=grep
GAIMAN=./bin/compile.js
ROLLUP=./node_modules/.bin/rollup
README_TMP=readme.html

.PHONY: test coveralls demo

all: umd.js

parser.js: Makefile ./src/grammar.peg
	$(PEG) -o parser.js ./src/grammar.peg

umd.js: parser.js index.js rollup.config.js ./src/banner.js
	$(ROLLUP) -c

demo:
	$(GAIMAN) -o docs/demo/ examples/demo.gs

test: parser.js
	$(JEST) --coverage --testMatch '**/__tests__/*.spec.js'

test-accept-snapshots: parser.js
	$(JEST) --coverage --updateSnapshot --testMatch '**/__tests__/*.spec.js'

coveralls:
	$(CAT) ./coverage/lcov.info | $(COVERALLS)

purge:
	$(CURL) -s https://github.com/jcubic/gaiman/blob/master/README.md > $(README_TMP)
	$(GREP) -Eo '<img src="[^"]+"' $(README_TMP) | $(GREP) camo | $(GREP) -Eo 'https[^"]+' | xargs -I {} $(CURL) -w "\n" -s -X PURGE {}