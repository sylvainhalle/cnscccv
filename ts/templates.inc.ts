function text_field(path: string, caption: string, value: unknown): string {
  return `<label>${caption}</label>
<input type="text" class="field" data-path="${path}" value="${value ?? ""}"
       onchange="handle_field_change(event)">`;
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
	<summary id="education_entry"><span>${title} (${entry.degree})</span></summary>
	<ul>
	<li>${text_field("education_" + index + "__school", "Institution", entry.school)}</li>
	<li>${text_field("education_" + index + "__degree", "Degree", entry.degree)}</li>
	<li>
	  ${text_field("education_" + index + "__start", "Start", entry.start)}
	  ${text_field("education_" + index + "__end", "End", entry.end)}
	</li>
	</ul>
	</details>
	`.trim();
}

function conference_template(entry: ConferenceData, index: Number, title = entry.title)
{
	return `<details>
	<summary>${title}</summary>
	<ul>
	<li>${text_field("publications_conferences_" + index + "__title", "Title", entry.title)}</li>
	<li>${text_field("publications_conferences_" + index + "__author", "Author(s)", entry.title)}</li>
	<li>${text_field("publications_conferences_" + index + "__proceedings", "Proceedings", entry.proceedings)}</li>
	<li>${text_field("publications_conferences_" + index + "__editor", "Editor(s)", entry.editor)}</li>
	<li>${text_field("publications_conferences_" + index + "__pages", "Pages", entry.pages)}</li>
	<li>${text_field("publications_conferences_" + index + "__year", "Year", entry.year)}</li>
	<li>${text_field("publications_conferences_" + index + "__publisher", "Author(s)", entry.publisher)}</li>
	<li>${text_field("publications_conferences_" + index + "__doi", "Author(s)", entry.doi)}</li>
	<li>${text_field("publications_conferences_" + index + "__rate", "Acceptance rate", entry.rate)}</li>
	</ul>
	</details>
	`.trim();
}

function journal_template(entry: JournalData, index: Number, title = entry.title)
{
	return `<details>
	<summary>${title}</summary>
	<ul>
	<li>${text_field("publications_journals_" + index + "__title", "Title", entry.title)}</li>
	<li>${text_field("publications_journals_" + index + "__author", "Author(s)", entry.author)}</li>
	<li>${text_field("publications_journals_" + index + "__journal", "Journal", entry.journal)}</li>
	<li>${text_field("publications_journals_" + index + "__editor", "Editor(s)", entry.editor)}</li>
	<li>${text_field("publications_journals_" + index + "__pages", "Pages", entry.pages)}</li>
	<li>${text_field("publications_journals_" + index + "__number", "Number", entry.number)}</li>
	<li>${text_field("publications_journals_" + index + "__volume", "Volume", entry.volume)}</li>
	<li>${text_field("publications_journals_" + index + "__year", "Year", entry.year)}</li>
	<li>${text_field("publications_journals_" + index + "__publisher", "Author(s)", entry.publisher)}</li>
	<li>${text_field("publications_journals_" + index + "__doi", "Author(s)", entry.doi)}</li>
	<li>${text_field("publications_journals_" + index + "__impact", "Impact Factor", entry.impact)}</li>
	</ul>
	</details>
	`.trim();
}
// :mode=javascript:tabSize=2:tabIndent=2: