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
 * Unit tests for schema manipulations.
 */
import {
		SchemaRoot,
		SchemaElement,
		TypedElement,
		ObjectElement,
		ArrayElement,
		ReferenceElement,
		get_definition
} from "./schema.inc.ts";

const schema1 = {
	"$schema": "https://json-schema.org/draft/2020-12/schema",
  "$id": "https://sylvainhalle.github.io/cnscccv/schema/v0/cnscccv.schema.json",
  "title": "CNSCCCV CV file",
  "type": "object",
  "required" : [],
  "properties": {
  		"a": {"type": "string"}
  },
  "$defs" : {
  }
} as SchemaRoot;

Deno.test("Reading a simple schema", () => {
	const d = get_definition(schema1, "a") as SchemaElement;
	console.assert("type" in d);
	console.assert((<TypedElement>d).type == "string");
});
// :mode=javascript:tabSize=2:tabIndent=2: