export default interface Schema {
    name: string,
    slug: string,
    date: string,
    schema: {
        $schema: string,
        $id: string,
        type: string,
        properties: object,
        required: string[],
        additionalProperties: any
    }
}
