function text_field(path: string, caption: string, field: string)
{
	return `<label for="${path}">${caption}</label><input type="text" class="field" id="${path}" value="${field}"/>\n`;
}

function personal_template(entry: PersonalData)
{
	return `<ul>
	<li>${text_field("personal_first", "First name", entry.first)}</li>
	<li>${text_field("personal_last", "Last name", entry.last)}</li>
	<li>${text_field("personal_email", "E-mail", entry.email)}</li>
	</li>
	</ul>
	`.trim();
}

function education_template(entry: EducationData, index: Number, title = entry.school)
{
	return `<details>
	<summary>${title}</summary>
	<ul>
	<li>${text_field("education_" + index + "_school", "Institution", entry.school)}</li>
	<li>${text_field("education_" + index + "_degree", "Degree", entry.degree)}</li>
	<li>
	  ${text_field("education_" + index + "_start", "Start", entry.start)}
	  ${text_field("education_" + index + "_end", "End", entry.end)}
	</li>
	</ul>
	</details>
	`.trim();
}
// :mode=javascript:tabSize=2:tabIndent=2: