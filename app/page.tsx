import { Poppins } from "next/font/google";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button"
import Link from "next/link";
import { auth } from "@/auth";

const popinFont = Poppins({
  subsets: ["latin"],
  weight: ["600"]
})


export default async function Home() {
  const data = await auth();
  return (
    <main className="h-full flex flex-col items-center justify-center bg-gradient-to-r from-blue-950 via-purple-950 to-pink-950 w-full">
      <div className="space-y-6 text-center">
        <h1 className={cn("text-white text-6xl font-semibold", popinFont.className)}>🔐Auth</h1>
        <p className="text-white text-lg">A simple authentication service</p>
        <div>
          <Link href={'/auth/login'}>
            <Button size={"lg"} variant={"secondary"}>Sign in</Button>
          </Link>
        </div>
      </div>
    </main>
  );
}
