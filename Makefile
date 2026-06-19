define optional_filter
$(if $(shell command -v $(1) 2>/dev/null),$(2),cat)
endef

TS_SOURCES   := $(wildcard ts/*.inc.ts)
SCSS_SOURCES := $(wildcard css/*.scss)
SVG_ICONS    := $(wildcard img/icn*.svg)
PNG_ICONS    := $(SVG_ICONS:.svg=.png)

.PHONY: all build compile icons clean inline print-icons

all: build

build: compile

compile: js/cv.js css/cv.css icons

js/cv.js: $(TS_SOURCES) ts/data.gen.ts
	mkdir -p js
	tsc --outFile $@ $^ --removeComments

ts/data.gen.ts: schema/cnsccv.schema.json schema/tocode.ts
	ts-node schema/tocode.ts schema/cnsccv.schema.json > ts/data.gen.ts

css/cv.css: $(SCSS_SOURCES)
	sass css/cv.scss $@

icons: $(PNG_ICONS)

print-icons:
	@echo "SVG_ICONS = [$(SVG_ICONS)]"
	@echo "PNG_ICONS = [$(PNG_ICONS)]"

img/%.png: img/%.svg
	convert -background none $< $@

inline:
	./inline.sh

clean:
	rm -f js/cv.js css/cv.css $(PNG_ICONS)
	rm -f ~/Downloads/cv*.json