import client from "../../client";

export default {
    Query: {
    seeFollowers: async (_, { username, page }) => {
            const ok = await client.user.findUnique({ where: { username }, select:{id:true} });
            if (!ok) {
                return {
                    ok: false,
                    error: "ERROR: Unable to list the follower page of the selected user.",
                };
            }
            // const aFollowers = await client.user
            //     .findUnique({ where: { username } })
            //     .followers(); ==> 하나만 뜸.
            // const bFollowers = await client.user
            //     .findMany({ where: { 
            //         following: {some: {username, }} // 모든 유저들 중에서 해당 username가 following에 들어있는 목록.
            //      } })
            //     .followers(); ==> 전체 목록이 뜨므로 매우 오래 걸릴 수 있음.
            const followers = await client.user
                .findUnique({ where: { username } })
                .followers({
                    skip: (page - 1) * 5,
                    take: 5,
            });
            const totalFollowers = await client.user.count({
                where: { following: { some: { username } } },
            });
            return {
                ok: true,
                followers,
                totalPages: Math.ceil(totalFollowers / 5),
            };
        },  
    },
};