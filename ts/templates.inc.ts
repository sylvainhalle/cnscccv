function text_field(label: string, caption: string, field: string, index: Number)
{
	return `<label for="${label}_${index}">${caption}</label><input type="text" class="field" id="${label}_${index}" value="${field}"/></li>\n`;
}

function personal_template(entry: PersonalData)
{
	return `<ul>
	<li>${text_field("first", "First name", entry.first, 0)}</li>
	<li>${text_field("last", "Last name", entry.last, 0)}</li>
	<li>${text_field("email", "E-mail", entry.email, 0)}</li>
	</li>
	</ul>
	`.trim();
}

function education_template(entry: EducationData, index: Number)
{
	return `<details>
	<summary>${entry.school}</summary>
	<ul>
	<li>${text_field("school", "Institution", entry.school, index)}</li>
	<li>${text_field("degree", "Degree", entry.degree, index)}</li>
	<li>
	  ${text_field("start", "Start", entry.start, index)}
	  ${text_field("end", "End", entry.end, index)}
	</li>
	</ul>
	</details>
	`.trim();
}
// :mode=javascript:tabSize=2:tabIndent=2: