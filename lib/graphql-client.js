import { GraphQLClient } from "graphql-request";

const endpoint = "https://graphql.fauna.com/graphql";

export const graphQLClient = new GraphQLClient(endpoint, {
  headers: {
    authorization: `Bearer fnAEGkJWwtACA27bZSDz16uh1nUkL8oCTJPTdgHZ`,
    "X-Schema-Preview": "partial-update-mutation",
  },
});
