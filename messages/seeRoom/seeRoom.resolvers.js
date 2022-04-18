
import client from "../../client"
import { protectedResolver } from '../../users/users.utils'

export default {
    Query: {
        // 여기서 {id}는 방 id.
        seeRoom: protectedResolver(async (_, { id }, { loggedInUser }) => client.room.findFirst({
            where: {
                id,
                users: { some: { id: loggedInUser.id } }
            }
        })
        )
    }
}