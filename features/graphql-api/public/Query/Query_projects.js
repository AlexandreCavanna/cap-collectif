/* eslint-env jest */
/* eslint-disable flowtype/require-valid-file-annotation */
const ProjectsPublicQuery = /* GraphQL */ `
  query ProjectsPublicQuery($count: Int!, $cursor: String) {
    projects(first: $count, after: $cursor) {
      totalCount
      pageInfo {
        hasNextPage
        endCursor
      }
      edges {
        cursor
        node {
          id
          title
          cover {
            url
          }
          contributions {
            totalCount
          }
          contributionsCount
          votes {
            totalCount
          }
          contributors {
            totalCount
          }
        }
      }
    }
  }
`;

const ProjectsInternalQuery = /* GraphQL */ `
  query ProjectsInternalQuery(
    $count: Int!
    $cursor: String
    $orderBy: ProjectOrder
    $term: String
  ) {
    projects(first: $count, after: $cursor, term: $term, orderBy: $orderBy) {
      totalCount
      pageInfo {
        hasNextPage
        endCursor
      }
      edges {
        cursor
        node {
          id
          title
          publishedAt
          contributionsCount
          contributions {
            totalCount
          }
        }
      }
    }
  }
`;

const ProjectsThemeQuery = /* GraphQL */ `
  query ProjectsThemeQuery($count: Int!, $cursor: String, $theme: ID) {
    projects(first: $count, after: $cursor, theme: $theme) {
      totalCount
      edges {
        node {
          id
          themes {
            id
          }
        }
      }
    }
  }
`;

const ProjectsTypeQuery = /* GraphQL */ `
  query ProjectsTypeQuery($count: Int!, $cursor: String, $type: ID) {
    projects(first: $count, after: $cursor, type: $type) {
      totalCount
      edges {
        node {
          id
          type {
            id
          }
        }
      }
    }
  }
`;

const ProjectsAuthorsQuery = /* GraphQL */ `
  query ProjectsAuthorsQuery($count: Int!, $cursor: String, $authorId: ID!) {
    projects(first: $count, after: $cursor, author: $authorId) {
      totalCount
      edges {
        node {
          id
          authors {
            id
          }
        }
      }
    }
  }
`;

const ProjectsDistrictsQuery = /* GraphQL */ `
  query ProjectsDistrictsQuery($count: Int!, $cursor: String, $districtId: ID!) {
    projects(first: $count, after: $cursor, district: $districtId) {
      totalCount
      edges {
        node {
          id
          districts {
            totalCount
            edges {
              node {
                name
                id
              }
            }
          }
        }
      }
    }
  }
`;

describe('Preview|Query.projects connection', () => {
  it('fetches the public projects with a cursor', async () => {
    await expect(
      graphql(ProjectsPublicQuery, {
        count: 5,
        cursor: 'YXJyYXljb25uZWN0aW9uOjE=',
      }),
    ).resolves.toMatchSnapshot();
  });

  it('fetches the public and private projects with a cursor', async () => {
    await expect(
      graphql(
        ProjectsPublicQuery,
        {
          count: 5,
          cursor: 'YXJyYXljb25uZWN0aW9uOjI=',
        },
        'admin',
      ),
    ).resolves.toMatchSnapshot();
  });

  it('fetches the public projects ordered by latest', async () => {
    await expect(
      graphql(
        ProjectsInternalQuery,
        {
          orderBy: { field: 'PUBLISHED_AT', direction: 'ASC' },
          count: 5,
        },
        'internal',
      ),
    ).resolves.toMatchSnapshot();
  });

  it('fetches the public projects with a specific theme', async () => {
    await expect(
      graphql(
        ProjectsThemeQuery,
        {
          theme: 'theme1',
          count: 5,
        },
        'internal',
      ),
    ).resolves.toMatchSnapshot();
  });

  it('fetches the public projects with a specific author', async () => {
    await expect(
      graphql(
        ProjectsAuthorsQuery,
        {
          authorId: 'VXNlcjp1c2VyQWRtaW4=',
          count: 5,
        },
        'internal',
      ),
    ).resolves.toMatchSnapshot();
  });

  it('fetches the public projects with a specific district', async () => {
    await expect(
      graphql(
        ProjectsDistrictsQuery,
        {
          districtId: toGlobalId('District', 'globalDistrict6'),
          count: 5,
        },
        'internal',
      ),
    ).resolves.toMatchSnapshot();
  });

  it('fetches the public projects with a specific type', async () => {
    await expect(
      graphql(
        ProjectsTypeQuery,
        {
          type: '3',
          count: 5,
        },
        'internal',
      ),
    ).resolves.toMatchSnapshot();
  });

  it('fetches the public projects containing a specific term', async () => {
    await expect(
      graphql(
        ProjectsInternalQuery,
        {
          term: 'Croissance',
          count: 5,
        },
        'internal',
      ),
    ).resolves.toMatchSnapshot();
  });
});
