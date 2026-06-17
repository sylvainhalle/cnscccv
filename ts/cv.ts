

/* Empty CV to start with */
var CV:    CVData  = null;
var DIRTY: boolean = false;

/**
 * Loads a JSON file from the local file system.
 * @param name The name of the file
 */
function load_file(content: string)
{
		var obj = JSON.parse(content) as CVData;
		globalThis.CV = obj;
		globalThis.DIRTY = false;
		populate();
}

/**
 * Fills the interface with CV data.
 */
function populate()
{
		populate_personal();
		populate_education();
}

function populate_personal()
{
	var ed = globalThis.CV.personal as PersonalData;
	var sec = document.getElementById("sec_personal");
	if (ed != null && sec != null)
	{
			var html = personal_template(ed);
			sec.innerHTML = sec.innerHTML + html;
	}
}

function populate_education()
{
	var ed = globalThis.CV.education as EducationData[];
	var sec = document.getElementById("sec_education");
	if (sec != null)
	{
		for (var i = 0; i < ed.length; i++)
		{
				var e = ed[i];
				var html = education_template(e, i);
		}
		sec.innerHTML = sec.innerHTML + html;
	}
}

function handle_field_change(e: Event)
{
		var el = e.target as HTMLInputElement;
		if (!has_class(el, "dirty"))
		{
				add_class(el, "dirty");
		}
		globalThis.DIRTY = true;
}

/**
 * Executed when the page is loaded.
 */
function on_page_load()
{
		var elems = document.querySelectorAll("input.field");
		for (var i = 0; i < elems.length; i++)
		{
				var el = elems[i] as HTMLInputElement;
				el.addEventListener("change", e => handle_field_change(e));
		}
}
// :mode=javascript:tabSize=2:tabIndent=2: