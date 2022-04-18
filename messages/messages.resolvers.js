import client from "../client";

export default {
    Room: {
        users: ({ id }) => client.room.findUnique({ where: { id }, }).users(),
        messages: ({ id }) => client.message.findMany({ where: { roomId: id }, }),
        unreadTotal: ({ id }, _, { loggedInUser }) => {
            if (!loggedInUser) return 0;
            else return client.message.count({
                where: {
                    read: false,
                    roomId: id,
                    user: { id: { not: loggedInUser.id } } // 해당 로그인한 유저가 보낸 게 아니어야 함.
                }
            })
        }
    }
}