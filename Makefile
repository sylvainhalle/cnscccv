compile: cv.ts cv.scss
	tsc cv.ts
	sass cv.scss cv.css

.PHONY: compile build