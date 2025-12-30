import UserList from "@/app/users/components/UserList";
import RegisterForm from "@/app/users/components/RegisterForm";

export default async function Home() {


    return (
        <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans ">
            <main
                className="flex min-h-screen w-full max-w-3xl flex-col items-center justify-between py-32 px-16 bg-white sm:items-start">
                <div className="flex flex-col items-center gap-6 text-center sm:items-start sm:text-left">
                    <div className="flex flex-col rounded-md bg-gray-100">
                        <RegisterForm />
                        <div className="rounded-t-md bg-gray-200 p-4 font-bold">
                            <UserList />
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
