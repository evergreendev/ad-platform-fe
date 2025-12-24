import NextAuth from 'next-auth'

const handler = NextAuth({
    providers: [
        {
            id: 'openiddict',
            name: "OpenIddict",
            type: "oauth",
            wellKnown: process.env.OPENID_DICT_WELL_KNOWN,
            clientId: process.env.OPENID_DICT_CLIENT_ID!,
            clientSecret: process.env.OPENID_DICT_CLIENT_SECRET!,
            authorization: {params: {scope: 'openid profile email'}},
            idToken: true,
            checks: ['pkce', 'state'],
            profile(profile) {
                return {
                    id: profile.sub,
                    name: profile.name ?? null,
                    email: profile.email ?? null,
                }
            },
        }
    ],

    session: {strategy: 'jwt'},
})

export {handler as GET, handler as POST}
