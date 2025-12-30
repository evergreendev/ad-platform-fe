import {auth} from "@/auth"


export default async function Home() {
    const session = await auth();

    return (
        <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans ">
            <main
                className="flex min-h-screen w-full max-w-3xl flex-col items-center justify-between py-32 px-16 bg-white sm:items-start">
                <div className="flex flex-col items-center gap-6 text-center sm:items-start sm:text-left">
                    <div className="flex flex-col rounded-md bg-gray-100">
                        <div className="rounded-t-md bg-gray-200 p-4 font-bold">
                            Current Session
                            <pre>{JSON.stringify(session, null, 2)}</pre>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
