import { gql } from "apollo-server";


export default gql`
  type MutationResponse{
    ok: Boolean!
    error: String
  }
  type Mutation {
    createComment(photoId: Int!, payload: String!): MutationResponse!
  }
`;
