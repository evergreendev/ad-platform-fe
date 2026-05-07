import client from "@/app/api/client";

export default async function Page() {

    const {data: contacts, response} = await client.GET("/api/Contacts");

    if (!contacts) {
        return null;
    }


    return (
        <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans ">
            <main
                className="flex min-h-screen w-full max-w-3xl flex-col items-center justify-between py-32 px-16 bg-white sm:items-start">
                <div className="flex flex-col items-center gap-6 text-center sm:items-start sm:text-left">
                    {
                        contacts.map((contact) => (
                            <div key={contact.id}>
                                <h2>{contact.firstName}</h2>
                                <p>{
                                    contact?.companies?.map((company) => (
                                        <span key={company.id}>{company.companyName}, </span>
                                    ))
                                }</p>
                            </div>
                        ))
                    }
                </div>
            </main>
        </div>
    );
}
