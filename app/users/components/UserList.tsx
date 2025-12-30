"use client"
import {useEffect, useState} from "react";

const UserList = () => {
    const [data, setData] = useState<any>(null)

    useEffect(() => {
        fetch("/api/proxy/user", { cache: "no-store" })
            .then(r => {
                if (r.status === 401) window.location.href = "/api/auth/signin"
                return r.json()
            })
            .then(setData)
    }, [])

    return <pre>{JSON.stringify(data, null, 2)}</pre>
}

export default UserList;
