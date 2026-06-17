function text_field(label: string, field: string, index: Number)
{
	return `<label for="${label}_${index}"><input type="text" class="field" id="${label}_${index}" value="${field}"/></li>\n`;
}

function personal_template(entry: PersonalData)
{
	return `<ul>
	<li>${text_field("first", entry.first, 0)}</li>
	<li>${text_field("last", entry.last, 0)}</li>
	<li>${text_field("email", entry.email, 0)}</li>
	</li>
	</ul>
	`.trim();
}

function education_template(entry: EducationData, index: Number)
{
	return `<details>
	<summary>${entry.school}</summary>
	<ul>
	<li>${text_field("school", entry.school, index)}</li>
	<li>${text_field("degree", entry.degree, index)}</li>
	<li>
	  ${text_field("start", entry.start, index)}
	  ${text_field("end", entry.end, index)}
	</li>
	</ul>
	`.trim();
}
// :mode=javascript:tabSize=2:tabIndent=2: