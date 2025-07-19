import { UserRole} from "@prisma/client";

declare module "next-auth"{
    interface User{
        role:UserRole
    }
}
