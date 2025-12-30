'use server'
import { auth } from '@/auth'
import { redirect } from 'next/navigation'

export async function registerUser(formData: FormData){
    const session = await auth()
    const accessToken = session?.accessToken;
    const email = formData.get('email') as string;

    if (!accessToken) {
        redirect('/api/auth/signin');
    }

    const res = await fetch(`${process.env.API_BASE_URL}/user`,{
        method: 'POST',
        body: JSON.stringify({
            "Email": email as string,
            "UserName": email as string,
        }),
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${accessToken}`
        }
    });


    if (!res.ok) {
        throw new Error('Registration failed');
    }

    redirect('/');
}
