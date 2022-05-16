import { withFilter } from "graphql-subscriptions";
import client from "../../client";
import { NEW_MESSAGE } from "../../constants";
import pubsub from "../../pubsub";

// 리스닝 요건: 1. 해당하는 roomid의 메시지만 subscribe하도록. 2. roomid 실제 존재 여부 체크. 3. 해당 roomid 리스닝할 권한 여부 체크.

export default {
  Subscription: {
    roomUpdates: {
      // subscribe: withFilter(
      //   () => pubsub.asyncIterator(NEW_MESSAGE),
      //   (payload, { id }) => payload.roomUpdates.roomId === id
      // ), // payload는 message, 
      subscribe: async (root, args, context, info) => {
        const room = await client.room.findFirst({ // 이 부분은 리스닝 시작 전 작동함.
          where: {
            id: args.id,
            users: { some: { id: context.loggedInUser.id } } // 3. 거름. 인증. 
          },
          select: { id: true }
        }) // 이렇게 함으로써 room은 Object 또는 null
        if (!room) throw new Error("Unauthorized access."); // 2. 거름. 존재여부.
        return withFilter( // 이 부분은 리스닝 시작한 후 작동함.
          () => pubsub.asyncIterator(NEW_MESSAGE), // '이 첫번째 함수는 iterator야.'
          (payload, { id }) => { return payload.roomUpdates.roomId === id } // 1. 거름. 해당하는 roomId의 메시지만. '이 두번째 함수는 우리가 publish할 때만 실행돼.'
        )(root, args, context, info); // TODO: 리스닝 도중 room에서 쫓겨나거나, 나가거나, 했을 때, 더 이상 메시지 못 받게 해야 함.
      },
    },
  },
};