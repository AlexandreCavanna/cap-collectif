module.exports = {
  // To Enable persisted queries:
  // persistOutput: "./queryMap.json",
  src: './frontend/js',
  noFutureProofEnums: true,
  language: 'typescript',
  schema: './schema.internal.graphql',
  artifactDirectory: './frontend/js/__generated__/~relay',
  exclude: ['**/node_modules/**', '**/__mocks__/**', '**/__generated__/**'],
  customScalars: {
    DateTime: 'String',
    Email: 'String',
    URI: 'String',
    IP: 'String',
    Address: 'String',
    JSON: 'String',
    HTML: 'String',
    Color: 'String',
    CssJSON: 'String',
    GeoJSON: 'String',
  },
};
