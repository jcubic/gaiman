PEG_JS=./node_modules/.bin/pegjs
JEST=./node_modules/.bin/jest

.PHONY: test

all: parser.js

parser.js: ./src/gaiman.pegjs
	$(PEG_JS) -o parser.js ./src/gaiman.pegjs

test:
	$(JEST) --coverage --testMatch '**/__tests__/*.spec.js'
