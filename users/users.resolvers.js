import client from "../client"

export default {
    User: {
        //totalFollowing: (_) => {
        totalFollowing: ({ id }) =>
            client.user.count({ where: { followers: { some: { id } } } }), // 즉, 현재 _의 User의 id가 followers에 있는 모든 user를 count함.

        totalFollowers: ({ id }) =>
            client.user.count({ where: { following: { some: { id, }, }, }, }),

        isMe: ({ id }, _, { loggedInUser }) => { //root뿐만 아니라 context도 필요함. 순서대로 root, arg, context.
            if (!loggedInUser) {
                return false;
            }
            return id === loggedInUser.id;
        },
        isFollowing: async ({ id }, _, { loggedInUser }) => {
            if (!loggedInUser) return false;

            // const exists = client.user
            // .findUnique({where:{username:loggedInUser}})
            // .following({where:{id}})
            // return exists.length!==0

            const exists = await client.user.count({
                where: {
                    username: loggedInUser.username,
                    following: { some: { id, }, },
                },
            });
            return Boolean(exists);
        },
        photos: ({ id }) => client.user.findUnique({ where: { id } }).photos(),
    }
}
/*
    totalFollowing은 parent를 가지고, 그 parent가 User임. 즉, _는 해당 User를 가리킴.
    await는 필요 없음. 즉 await client.user.count(~~~~) 아니고 그냥 써도 됨.
*/