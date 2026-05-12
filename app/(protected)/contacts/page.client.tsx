"use client"
import EmailButton from "./components/EmailButton";
import {useState} from "react";
import type {components} from "@/app/api/types";


const ClientPage = ({data}:{data:components["schemas"]["ContactResponsePagedResponse"]}) => {
    type ContactModal = | { type: "edit"; contactId: string }
        | { type: "delete"; contactId: string }
        | { type: "email"; contactId: string }
        | null;

    const [openModal, setOpenModal] = useState<ContactModal>(null);

    return <div className="flex flex-col items-center gap-6 text-center sm:items-start sm:text-left">
        {data.items?.map((contact) => (
            <div key={contact.id}>
                <h2>{contact.firstName}</h2>
                <p>
                    {contact?.companies?.map((company) => (
                        <span key={company.id}>{company.companyName}, </span>
                    ))}
                </p>
                {contact.id && <EmailButton
                    onClose={() => setOpenModal(null)}
                    isOpen={openModal?.type === "email" && openModal.contactId === contact.id}
                                            onClick={() => setOpenModal({type: "email", contactId: contact.id||""})}
                                            contact={contact}/>}
            </div>
        ))}
    </div>
}

export default ClientPage;