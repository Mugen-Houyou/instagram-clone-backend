
import client from "../../client"
import { protectedResolver } from '../../users/users.utils'

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
            return { ok: true };
        })
    }
}