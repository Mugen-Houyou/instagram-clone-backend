import client from "../../client"
import { protectedResolver } from '../../users/users.utils'

export default {
    Mutation: {
        // 여기서 {id}는 message의 id
        readMessage: protectedResolver(async (_, { id }, { loggedInUser }) => {
            const message = await client.message.findFirst({
                where: {
                    id,
                    userId: { not: loggedInUser.id },
                    room: {
                        users: { some: { id: loggedInUser.id } }
                    }
                },
                select: {
                    id: true
                }
            });
            if (!message) return { ok: false, error: "Message doesn't exist!" };
            await client.message.update({
                where: { id },
                data: { read: true }
            })
            return { ok: true, };
        })
    }
}