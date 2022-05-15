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
        const room = await client.room.findUnique({
          where: { id: args.id, },
          select: { id: true }
        })
        if (!room) throw new Error("You shall not see this."); // 2. 거름.
        return withFilter(
          () => pubsub.asyncIterator(NEW_MESSAGE),
          (payload, { id }) => { return payload.roomUpdates.roomId === id } // 1. 거름.
        )(root, args, context, info);
      },
    },
  },
};