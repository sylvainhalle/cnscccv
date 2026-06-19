/*****************************************************************************
 * The Canadian not-so-common-CV
 * (C) 2026  Sylvain Hallé
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 * 
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 * 
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <https://www.gnu.org/licenses/>.
 *****************************************************************************/

/**
 * This program reads the CV's schema, and generates the
 * TypeScript code of the interfaces corresponding to that schema.
 */

// Read schema
var fs = require('fs');
const SCHEMA = JSON.parse(read_file(process.argv[2]));

var cv_out = "interface CVData\n{\n";
var out = "";
var empty_code = "";


for (var p in SCHEMA.properties)
{
	if (p == "$schema") continue;
	if ("type" in SCHEMA.properties[p] && SCHEMA.properties[p].type == "array")
	{
		const elem = <SchemaArrayElement>SCHEMA.properties[p];
		cv_out += "  " + p + ":" + pad(20, p.length) + capitalize(getEntityFor(<string>elem.items["$ref"])) + "[],\n";
	}
	else if ("$ref" in SCHEMA.properties[p])
	{
		const ref = getEntityFor(<string>SCHEMA.properties[p]["$ref"]);
		cv_out += "  " + p + ":" + pad(20, p.length) + capitalize(ref) + ",\n";
	}
	else
	{
		const pair = process_element(<SchemaElement>SCHEMA.properties[p]);
		cv_out += "  " + p + ":" + pad(20, p.length) + capitalize(p) + ",\n";
		out += "interface " + capitalize(p) + (pair[1] != "" ? " extends " + capitalize(pair[1]) : "") + "\n{\n" + pair[0] + "}\n\n";
	}
}
for (var p in SCHEMA["$defs"])
{
	const pair = process_element(<SchemaElement>SCHEMA["$defs"][p]);
	out += "interface " + capitalize(p) + (pair[1] != "" ? " extends " + capitalize(pair[1]) : "") + "\n{\n" + pair[0] + "}\n\n";
}
cv_out += "\n}\n";

empty_code = cv_out + out;
empty_code = empty_code.replace(/\s*\/\/.*?\n/g, "\n");
empty_code = empty_code.replace(/,\n/g, ", ");
empty_code = empty_code.replace(/\{\n/g, "{ ");
empty_code = empty_code.replace(/\n\}/g, "} ");
empty_code = empty_code.replace(/\s*[\w\d]+\?:.*,/g, "");
empty_code = empty_code.replace(/(.*?):\s*([\w\d]+)\[\]/g, "$1: <$2[]>[]");
empty_code = empty_code.replace(/(.*?):\s*string/g, "$1: \"\"");
empty_code = empty_code.replace(/(.*?):\s*(number|integer)/g, "$1: 0");
empty_code = empty_code.replace(/(.*?):\s*boolean/g, "$1: false");
empty_code = empty_code.replace(/\s([^\s]*?):\s*([A-Z][\w\d]+),/g, "$1: empty_$2(),");
empty_code = empty_code.replace(/[ ]+/g, " ");
empty_code = empty_code.replace(/interface (.*?) extends (.*?)\n\{\s*\}/g, "function empty_$1() { return empty_$2(); }");
empty_code = empty_code.replace(/interface (.*?) extends (.*?)\n\{(.*?)\}/g, "function empty_$1() { return { ...empty_$2(), ...$3 }; }");
empty_code = empty_code.replace(/interface (.*?)\n\{(.*?)\}/g, "function empty_$1() { return { $2 }; }");

console.log(cv_out + out + empty_code);
console.log("\n//:mode=javascript:wrap=none:");

function empty_instance(s: string)
{
	if (s == "string")
		return '""';
	if (s == "boolean")
		return "false";
	if (s == "integer" || s == "number")
		return 0;
	if (s == "null")
		return null;
	return "empty_" + s + "()";
}

interface SchemaElement
{
	type?:        string,
	"$ref"?:      string,
	allOf?:       SchemaElement[],
	description?: string
}

interface SchemaObjectElement extends SchemaElement
{
	required?: string[],
	properties: SchemaPropertiesElement,
	additionalProperties? : boolean
}

interface SchemaArrayElement extends SchemaElement
{
	items: SchemaElement
}

interface SchemaPropertiesElement
{
	[key: string]: SchemaPropertyElement
}

interface SchemaPropertyElement
{
	type: string,
	description?: string
}

function process_element(e: SchemaElement): [string, string]
{
	var out = "";
	var parent = "";
	if ("$ref" in e)
	{
		const ref = getEntityFor(<string>e["$ref"]);
		return process_element(<SchemaElement>SCHEMA["$defs"][ref]);
	}
	if ("allOf" in e)
	{
		const elem = <SchemaElement[]>e.allOf;
		for (var i = 0; i < elem.length; i++)
		{
			if ("$ref" in elem[i])
			{
				parent = getEntityFor(<string>elem[i]["$ref"]);
			}
			else
			{
				out += process_element(elem[i])[0];
			}
		}
	}
	else if ("type" in e && e.type == "object")
	{
		const elem = <SchemaObjectElement>e;
		for (var a in elem.properties)
		{
			if ("required" in elem && (<string[]>elem.required).includes(a))
			{
				out += "  " + a + ":" + pad(20, a.length);
			}
			else
			{
				out += "  " + a + "?:" + pad(20, a.length + 1);
			}
			if (elem.properties[a].type == "array")
			{
				const pair = process_element(elem.properties[a]);
				out += pair[0] + "[],";
			}
			else
			{
				out += capitalize(elem.properties[a].type) + ",";
			}
			if ("description" in elem.properties[a])
			{
				out += " // " + <string>elem.properties[a].description;
			}
			out += "\n";
		}
	}
	else if ("type" in e && e.type == "array")
	{
		const elem = <SchemaArrayElement>e;
		var items = elem.items;
		out += process_element(items)[0];
		if ("$ref" in items)
		{
			out = capitalize(getEntityFor(<string>items["$ref"]));
		}
		else if ("type" in items)
		{
			out = capitalize(getEntityFor(<string>items.type));
		}
	}
	return [out, parent];
}

function getEntityFor(s: string): string
{
	if (["string", "number", "boolean", "null", "integer"].includes(s))
	{
		if (s == "integer")
			return "number";
		return s;
	}
	return s.substring("#/$defs/".length);
}

function read_file(filename: string): string
{
	var out = fs.readFileSync(filename, 'utf8', function(err: any, data: any) {
		if (err)
		{
			console.log("ERROR: " + err);
			return null;
		}
		return data;
    });
    return out;
}

function capitalize(str: string): string
{
	if (!["string", "number", "boolean", "null", "integer"].includes(str))
	{
		return str[0].toUpperCase() + str.slice(1);
	}
	if (str == "integer")
		return "number";
	return str;
}

function pad(len: number, current: number): string
{
	var out = "";
	for (var i = current; i < len; i++)
		out += " ";
	return out;
}


/* :mode=javascript:wrap=none:folding=explicit: */