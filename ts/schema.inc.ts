interface SchemaRoot
{
		"$schema":    string,
		"$id":        string,
		"$defs":      DefElement,
		"title":      string,
		"properties": SchemaElement[],
		"required":   string[]
}

interface SchemaElement
{
		description?: string
}

interface AllOfElement extends SchemaElement
{
		"allOf":   SchemaElement[];
}

interface ReferenceElement extends SchemaElement
{
		"$ref": string
}

interface TypedElement extends SchemaElement
{
		"type":         string,
		"description"?: string
}

interface ObjectElement extends TypedElement
{
		"required":              string[],
		"properties":            SchemaElement[],
		"additionalProperties"?: boolean
}

interface ArrayElement extends SchemaElement
{
		"items": SchemaElement
}


// :mode=javascript:tabSize=2:tabIndent=2: