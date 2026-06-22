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
 * Generic methods to read and query a JSON schema.
 * @author Sylvain Hallé
 */

export interface SchemaRoot
{
		"$schema":    string,
		"$id":        string,
		"$defs":      Properties,
		"title":      string,
		"properties": Properties,
		"required":   string[]
}

export interface Properties
{
		[key: string]: SchemaElement;
}

export interface SchemaElement
{
		description?: string
}

export interface AllOfElement extends SchemaElement
{
		"allOf":   SchemaElement[];
}

export interface ReferenceElement extends SchemaElement
{
		"$ref": string
}

export interface TypedElement extends SchemaElement
{
		"type":         string,
		"description"?: string
}

export interface ObjectElement extends TypedElement
{
		"required":              string[],
		"properties":            Properties,
		"additionalProperties"?: boolean
}

export interface ArrayElement extends TypedElement
{
		"items": SchemaElement
}

export interface LooseObject
{
		[key: string]: any;
}

export function new_empty(s: SchemaRoot, name: string): any
{
		for (var p in s.properties)
		{
				if (p != name)
						continue;
				const e = s.properties[p];
				if ("$ref" in e)
						continue; // Look in defs instead
				return instantiate(s, e);
		}
		for (var p in s["$defs"])
		{
				if (p != name)
						continue;
				const e = s["$defs"][p];
				return instantiate(s, e);
		}
		return null;
}

export function instantiate(s: SchemaRoot, e: SchemaElement): any
{
		if ("type" in e)
		{
				const te = <TypedElement>e;
				if (te.type == "object")
				{
						return instantiate_object(s, <ObjectElement>te);
				}
				if (te.type == "array")
				{
						return instantiate_array(s, <ArrayElement>te);
				}
				return instantiate_primitive(s, te);
		}
		if ("allOf" in e)
		{
				return instantiate_allof(s, <AllOfElement>e);
		}
		if ("$ref" in e)
		{
			const ref = get_entity_for((e as ReferenceElement)["$ref"]);
			const d = get_definition(s, ref);
			return d == null ? null : instantiate(s, d);
  	}
		return null;
}

export function instantiate_object(s: SchemaRoot, e: ObjectElement): Object
{
		var obj = <LooseObject>{ };
		for (var p in e.properties)
		{
				if (!e.required.includes(p))
						continue;
				var pe = e.properties[p];
				obj[p] = instantiate(s, pe);
		}
		return obj;
}

export function instantiate_array(s: SchemaRoot, e: ArrayElement): Array<any>
{
		return [ ];
}

export function instantiate_allof(s: SchemaRoot, e: AllOfElement): Object
{
		var obj = { };
		for (var i = 0; i < e.allOf.length; i++)
		{
				obj = { ...obj, ...instantiate(s, e.allOf[i]) };
		}
		return obj;
}

export function instantiate_primitive(s: SchemaRoot, e: TypedElement): any
{
		if (e.type == "string")
				return "";
		if (e.type == "boolean")
				return false;
		if (e.type == "number" || e.type == "integer")
				return 0;
		return null;
}

export function get_definition(s: SchemaRoot, name: string): SchemaElement | null
{
		for (var p in s.properties)
		{
				if (p != name)
						continue;
				const e = s.properties[p];
				if ("$ref" in e)
						continue; // Look in defs instead
				return expand(s, e);
		}
		for (var p in s["$defs"])
		{
				if (p != name)
						continue;
				const e = s["$defs"][p];
				return expand(s, e);
		}
		return null;
}

export function expand(s: SchemaRoot, e: SchemaElement): SchemaElement
{
		if ("type" in e)
		{
				const te = <TypedElement>e;
				if (te.type == "object")
				{
						let oe = { ... <ObjectElement>te } as ObjectElement;
						for (var p in oe.properties)
						{
								if ("$ref" in oe.properties[p])
								{
										const re = <ReferenceElement>oe.properties[p];
										const d = get_definition(s, get_entity_for(re["$ref"]));
										if (d != null)
										{
												oe.properties[p] = d;
										}
								}
						}
						return oe;
				}
				if (te.type == "array")
				{
						let ae = { ... <ArrayElement>te} as ArrayElement;
						if ("$ref" in ae.items)
						{
								const d = get_definition(s, get_entity_for((<ReferenceElement>ae.items)["$ref"]));
								if (d != null)
								{
										ae.items = d;
								}
						}
						return ae;
				}
		}
		if ("allOf" in e)
		{
				const ae = <AllOfElement>e;
				let ae_out = {
						"type":       "object",
						"required":   <string[]>[],
						"properties": <Properties>{}
				} as ObjectElement;
				for (var i = 0; i < ae.allOf.length; i++)
				{
						const aein = ae.allOf[i];
						let aein_o = aein;
						if ("$ref" in aein)
						{
								const d = get_definition(s, get_entity_for((<ReferenceElement>aein)["$ref"]));
								if (d != null)
								{
										aein_o = d;
								}
						}
						if ("type" in aein_o && (<TypedElement>aein_o).type == "object") // should normally be the case
						{
								const aein_obj = <ObjectElement>aein_o;
								ae_out.required = [ ...ae_out.required, ...aein_obj.required ];
								ae_out.properties = { ...ae_out.properties, ...aein_obj.properties };
						}
				}
				return ae_out;
		}
		return { ... e} as SchemaElement;
}

export function get_entity_for(s: string): string
{
		if (["string", "number", "boolean", "null", "integer"].includes(s))
		{
				if (s == "integer")
						return "number";
				return s;
		}
		return s.substring("#/$defs/".length);
}
// :mode=javascript:tabSize=2:tabIndent=1: