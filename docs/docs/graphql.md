
  Usage: graphql-markdown [options] <schema>

  Output a Markdown document with rendered descriptions and links between types.
  The schema may be specified as:

    - a URL to the GraphQL endpoint (the introspection query will be run)
    - a GraphQL document containing the schema (.graphql or .gql)
    - a JSON document containing the schema (as returned by the introspection query)
    - an importable module with the schema as its default export (either an instance
      of GraphQLSchema or a JSON object)

  Options:

    --title <string>       Change the top heading title (default: 'Schema Types')
    --no-title             Do not print a default title
    --no-toc               Do not print table of contents
    --prologue <string>    Include custom Markdown after the title
    --epilogue <string>    Include custom Markdown after everything else
    --heading-level <num>  Heading level to begin at, useful if you are embedding the
                           output in a document with other sections (default: 1)
    --update-file <file>   Markdown document to update (between comment markers) or
                           create (if the file does not exist)
    --require <module>     If importing the schema from a module, require the specified
                           module first (useful for e.g. babel-register)
    --header <name=value>  Additional header(s) to use in GraphQL request
                           e.g. --header "Authorization=Bearer ey..."
    --version              Print version and exit

