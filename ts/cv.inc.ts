

/* Empty CV to start with */
var CV:    CVData  = empty_CVData();
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
		populate_section("personal");
		populate_section("education");
		populate_section("publications");
}

function handle_field_change(event: Event): void {
  const el = event.target as HTMLInputElement;
  set_value(globalThis.CV, el.dataset.path!, el.value);
  el.classList.add("dirty");
  set_dirty(true);
}

function get_value(obj: any, path: string): any {
  return path.split(".").reduce((o, k) => o[k], obj);
}

function set_value(obj: any, path: string, value: any): void {
  const parts = path.split(".");
  const key = parts.pop()!;
  const parent = parts.reduce((o, k) => o[k], obj);
  parent[key] = value;
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

/**
 * Executed when the page is loaded.
 */
function on_page_load()
{
		populate();
		var el_a = document.querySelector("#btnsave") as HTMLElement;
		el_a.addEventListener("click", e => update_url(), {capture:true});
		var elems = document.querySelectorAll("details");
		for (var i = 0; i < elems.length; i++)
		{
				var el = elems[i] as HTMLElement;
				el.addEventListener("toggle", e => update_breadcrumbs(e));
		}
		window.addEventListener('beforeunload', function (e) {
				if (globalThis.DIRTY)
				{
						e.preventDefault();
						e.returnValue = '';
				}
		});
}

function populate_section(name: keyof typeof SECTIONS, reset = false): void {
  const spec = SECTIONS[name];
  const entries = get_value(globalThis.CV, spec.path);
  const sec = document.getElementById(spec.container)!;

  let html = "";
  for (let i = 0; i < entries.length; i++) {
    html += entry_template(spec, entries[i], `${spec.path}.${i}`);
  }

  sec.innerHTML = (reset ? "" : sec.innerHTML) + html;
}

function add_entry(name: keyof typeof SECTIONS): void {
  const spec = SECTIONS[name];
  const entries = get_value(globalThis.CV, spec.path);
  entries.push(spec.empty());
  populate_section(name, true);
  set_dirty(true);
}

function entry_template(spec: any, entry: any, path: string): string {
  const title = spec.title(entry) || "New entry";

  const fields = spec.fields.map(([key, label]: [string, string]) =>
    `<li>${text_field(`${path}.${key}`, label, entry[key])}</li>`
  ).join("");

  return `<details>
    <summary>${title}</summary>
    <ul>${fields}</ul>
  </details>`;
}

function update_breadcrumbs(event: Event)
{
		/*var el = event.target as HTMLElement;
		var id = el.querySelector("div").id;
		var html = '<li><a href="#">Home</a></li>';
		var pathel = get_path(id);
		var parts = pathel[0].split(".");
		console.log(pathel);
		for (var i = 2; i < parts.length; i++)
		{
				html += '<li><a href="#">' + parts[i] + "</a></li>";
		}
		if (pathel[1] != parts[parts.length - 1])
		{
				html += '<li><a href="#">' + pathel[1] + "</a></li>";
		}
		document.getElementById("breadcrumbs").innerHTML = html;
		*/
}

function add_field_listener(el : HTMLElement)
{
		el.addEventListener("change", e => handle_field_change(e));
}
// :mode=javascript:tabSize=2:tabIndent=2: