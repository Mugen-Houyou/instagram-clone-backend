import { gql } from "apollo-server";

export default gql`
    type Mutation {
        readMessage(id:Int!,) : MutationResponse! 
    }
`
// roomId와 userId가 필수가 아닌 이유: 
// 나는 단톡방에 메시지를 보낼 수도 있고, 개인에게 보낼 수도 있어야 하므로. 
//톡방이 아직 없는데 유저가 있다면, 그 유저랑 새로이 대화를 시작하고 싶을 것이지.