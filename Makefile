.PHONY: all build compile icons clean

all: build

TS_SOURCES   := $(wildcard ts/*.ts)
SCSS_SOURCES := $(wildcard css/*.scss)
SVG_ICONS    := $(wildcard img/icn*.svg)
PNG_ICONS    := $(SVG_ICONS:.svg=.png)

build: compile

compile: js/cv.js css/cv.css icons

js/cv.js: $(TS_SOURCES)
	mkdir -p js
	tsc --outFile $@ $^ --removeComments

css/cv.css: $(SCSS_SOURCES)
	sass css/cv.scss $@

icons: $(PNG_ICONS)

print-icons:
	@echo "SVG_ICONS = [$(SVG_ICONS)]"
	@echo "PNG_ICONS = [$(PNG_ICONS)]"

img/%.png: img/%.svg
	convert -background none $< $@

inline:
	@tmpdir=$$(mktemp -d); \
	@cp html/template.html $$tmpdir/0.html; \
	@echo $$tmpdir \
	@sed 's|<!-- %%SCRIPT%% -->|<script type="text/javascript">$(<css/cv.css)</script>|g' < $(tmpdir)/0.html > $(tmpdir)/1.html \
	@cp $(tmpdir)/1.html cv.html \
	@rm -rf $(tmpdir)

clean:
	rm -f js/cv.js css/cv.css $(PNG_ICONS)