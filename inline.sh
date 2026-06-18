#! /usr/bin/env bash

tmpdir=$(mktemp -d)
cp html/template.html $tmpdir/cv.html

# Add script element around the JS code
echo '<script type="text/javascript>' > $tmpdir/cv.js
echo '//<![CDATA[' >> $tmpdir/cv.js
minify js/cv.js >> $tmpdir/cv.js
echo '//]]>' >> $tmpdir/cv.js
echo '</script>' >> $tmpdir/cv.js

# Replace placeholder by script
pushd $tmpdir
sed -i \
'/<!-- %%SCRIPT%% -->/ {
  r cv.js
  d
}' cv.html
popd

# Add style element around the CSS code
echo '<style type="text/css">' > $tmpdir/cv.css
minify css/cv.css >> $tmpdir/cv.css
echo '</style>' >> $tmpdir/cv.css

# Replace image links with base-64 encoding
for f in img/icn*.png; do
	outf=$(basename $f)
	base64 --wrap 0 $f > $tmpdir/$outf
done
for f in img/*.jpg; do
	outf=$(basename $f)
	base64 --wrap 0 $f > $tmpdir/$outf
done
for f in img/icn*.svg; do
	outf=$(basename $f)
	base64 --wrap 0 $f > $tmpdir/$outf
done
pushd $tmpdir
for f in icn*.png; do
	content=$(cat $f)
	sed -i "s_\.\./img/${f}_data:image/png;base64,${content}_" cv.css
done
for f in *.jpg; do
	content=$(cat $f)
	sed -i "s_\.\./img/${f}_data:image/jpeg;base64,${content}_" cv.css
done
for f in icn*.svg; do
	content=$(cat $f)
	sed -i "s_\.\./img/${f}_data:image/svg+xml;base64,${content}_" cv.css
done

# Replace placeholder by CSS
sed -i \
'/<!-- %%CSS%% -->.*$/ {
  r cv.css
  d
}' cv.html
minify -i --html-keep-whitespace cv.html
popd

# Copy resulting file
cp $tmpdir/cv.html cv.html