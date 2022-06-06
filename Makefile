PEG=./node_modules/.bin/peggy
JEST=./node_modules/.bin/jest
COVERALLS=./node_modules/coveralls/bin/coveralls.js
GAIMAN=./bin/compile.js
ROLLUP=./node_modules/.bin/rollup
CAT=cat
CURL=curl
GREP=grep
GIT=git
CD=cd
RM=rm
NPM=npm
URL=`git config --get remote.origin.url`

README_TMP=readme.html
USER=jcubic
REPO=gaiman



.PHONY: test coveralls demo

all: umd.js

parser.js: Makefile ./src/grammar.peg
	$(PEG) -o parser.js ./src/grammar.peg

umd.js: parser.js index.js rollup.config.js ./src/banner.js package.json
	$(ROLLUP) -c

demo:
	$(GAIMAN) -o docs/demo/ examples/demo.gs

test: parser.js
	$(JEST) --coverage --testMatch '**/__tests__/*.spec.js'

test-accept-snapshots: parser.js
	$(JEST) --coverage --updateSnapshot --testMatch '**/__tests__/*.spec.js'

coveralls:
	$(CAT) ./coverage/lcov.info | $(COVERALLS)

publish-beta:
	$(GIT) clone $(URL) --depth 1 npm
	$(CD) npm && $(NPM) publish --tag beta
	$(RM) -rf npm

publish:
	$(GIT) clone $(URL) --depth 1 npm
	$(CD) npm && $(NPM) publish
	$(RM) -rf npm

purge:
	$(CURL) -s https://github.com/$(USER)/$(REPO)/blob/master/README.md > $(README_TMP)
	$(GREP) -Eo '<img src="[^"]+"' $(README_TMP) | $(GREP) camo | $(GREP) -Eo 'https[^"]+' | xargs -I {} $(CURL) -w "\n" -s -X PURGE {}
