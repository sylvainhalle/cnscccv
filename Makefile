compile: ts/cv.ts css/cv.scss
	mkdir -p js
	tsc --outFile js/cv.js ts/*.ts --removeComments
	sass css/cv.scss css/cv.css

.PHONY: compile build