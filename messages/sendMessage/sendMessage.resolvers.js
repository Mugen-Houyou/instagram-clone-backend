import client from "../../client";
import { NEW_MESSAGE } from "../../constants";
import pubsub from "../../pubsub";
import { protectedResolver } from "../../users/users.utils";


export default {
    Mutation: {
        sendMessage: protectedResolver(async (_, { payload, roomId, userId }, { loggedInUser }) => {
            let room = null;
            if (userId) {
                const user = await client.user.findUnique({
                    where: { id: userId },
                    select: { id: true }
                });
                if (!user) { // 대상 유저가 없다면 에러를 내뱉음.
                    return { ok: false, error: "This user doesn't exist!" };
                }
                room = await client.room.create({
                    data: {
                        users: {
                            connect: [
                                { id: userId },
                                { id: loggedInUser.id },
                            ]
                        }
                    }
                });
            } else if (roomId) { // 톡방이 이미 존재함.
                room = await client.room.findUnique({
                    where: { id: roomId },
                    select: { id: true }
                });
                if (!room) {
                    return { ok: false, error: "This room doesn't exist!" }
                }
            }
            const newMeessage = await client.message.create({
                data: {
                    payload,
                    room: { connect: { id: room.id, } },
                    user: { connect: { id: loggedInUser.id } }
                }
            });
            // pubsub.publish(이벤트명, 페이로드)
            // pubsub.publish(NEW_MESSAGE,{message}) // 근데 "이 경우에 페이로드는 roomUpdates의 Message일 뿐만 아니라 subscription의 이름이기도 해야 함. 또한 subscription의 return 값이기도 해야 함. 이 줄대로 하면 message:null이 뜸."
            pubsub.publish(NEW_MESSAGE, { roomUpdates: { ...newMeessage } }) // "메시지를 열 거야, 왜냐하면 메시지 내의 내용이 필요하기 때문."

            return { ok: true };
        })
    }
}