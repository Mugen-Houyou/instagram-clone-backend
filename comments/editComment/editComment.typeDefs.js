import { gql } from "apollo-server";

export default gql`
  type MutationResponse{
    ok:Boolean!
    error: String
  }
  type Mutation {
    editComment(id: Int!, payload:String!  ):MutationResponse!
  }
`;