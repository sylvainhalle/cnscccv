

/* Empty CV to start with */
var CV:    CVData  = get_empty_cv();
var DIRTY: boolean = false;

/**
 * Loads a JSON file from the local file system.
 * @param name The name of the file
 */
function load_file(content: string)
{
		var obj = JSON.parse(content) as CVData;
		globalThis.CV = obj;
		set_dirty(false);
		populate();
		on_page_load();
}

/**
 * Saves the content of the CV to a file.
 */
function update_url()
{
		globalThis.CV.header.timestamp = Date.now();
		var e = document.querySelector('#btnsave>a') as HTMLLinkElement;
		var serialized = btoa(JSON.stringify(globalThis.CV));
		e.href = "data:application/json;charset=utf-8;base64," + serialized;
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
	var personal = globalThis.CV.personal as PersonalData;
	var sec = document.querySelector("#sec_personal>details");
	if (personal != null && sec != null)
	{
			var html = personal_template(personal);
			sec.innerHTML = sec.innerHTML + html;
	}
}

function populate_education()
{
	var ed = globalThis.CV.education as EducationData[];
	var sec = document.getElementById("sec_education_contents");
	if (ed && sec != null)
	{
		var html = "";
		for (var i = 0; i < ed.length; i++)
		{
				var e = ed[i];
				html += education_template(e, i);
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
		var path_att = get_path(el.id);
		var branch = eval(path_att[0]);
		branch[path_att[1]] = el.value;
		set_dirty(true);
}

function get_path(id: string): string[]
{
		var out = id.replace(/_(\d+)_/g, "[$1]");
		out = out.replace("_", ".");
		var path = out.replace(/^(.*)\.([^\.]+)$/, "$1");
		var att = out.replace(/^(.*)\.([^\.]+)$/, "$2");
		return ["globalThis.CV." + path, att];
}

function set_dirty(b: boolean)
{
		if (b)
		{
				globalThis.DIRTY = true;
				remove_class(document.getElementById("btnsave"), "greyedout");
		}
		else
		{
				globalThis.DIRTY = false;
				add_class(document.getElementById("btnsave"), "greyedout");
		}
}

function add_education()
{
		var e = get_empty_education() as EducationData;
		globalThis.CV.education.push(e);
		var sec = document.getElementById("sec_education_contents");
		var html = education_template(e, globalThis.CV.education.length - 1, "New Entry") as string;
		console.log(html);
		sec.innerHTML = sec.innerHTML + html;
		set_dirty(true);
}

/**
 * Executed when the page is loaded.
 */
function on_page_load()
{
		populate();
		var el_a = document.querySelector("#btnsave") as HTMLElement;
		el_a.addEventListener("click", e => update_url(), {capture:true});
		var elems = document.querySelectorAll("input.field");
		for (var i = 0; i < elems.length; i++)
		{
				var el = elems[i] as HTMLInputElement;
				el.addEventListener("change", e => handle_field_change(e));
		}
		window.addEventListener('beforeunload', function (e) {
				if (globalThis.DIRTY)
				{
						e.preventDefault();
						e.returnValue = '';
				}
		});
}
// :mode=javascript:tabSize=2:tabIndent=2: