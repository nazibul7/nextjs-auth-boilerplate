import { db } from "@/lib/db";

export const getUserByEmail = async (email: string) => {
    return await db.user.findUnique({
        where: { email }
    })
}

export const getUserById=async(id:string)=>{
    try {
        const user=await db.user.findUnique({
            where:{id}
        })
        return user;
    } catch (error) {
        return null;
    }
}