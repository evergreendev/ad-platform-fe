import type {
    GetServerSidePropsContext,
    NextApiRequest,
    NextApiResponse,
} from "next"
import type { NextAuthOptions } from "next-auth"
import { getServerSession } from "next-auth"

export const config = {
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
    callbacks: {
        async jwt({ token, account }) {
            // Only on sign-in
            if (account?.access_token) {
                token.accessToken = account.access_token
            }
            return token
        }
    },
    session: {strategy: 'jwt'},
} satisfies NextAuthOptions

// Use it in server contexts
export function auth(
    ...args:
        | [GetServerSidePropsContext["req"], GetServerSidePropsContext["res"]]
        | [NextApiRequest, NextApiResponse]
        | []
) {
    return getServerSession(...args, config)
}
