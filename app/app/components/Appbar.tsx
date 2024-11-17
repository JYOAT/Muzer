"use client";
import { useSession, signIn, signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Users, Radio, Headphones, Music } from "lucide-react";
import Link from "next/link";

export function Appbar() {
    const { data: session } = useSession();

    return (
        
        
            <div className="flex justify-between px-20 pt-4 pb-4">
                <div className="text-lg font-bold flex flex-col justify-center text-white">Muzer</div>
                <div>
                    {session?.user ? (
                        <Button
                            className="bg-purple-600 text-white hover:bg-purple-700"
                            onClick={() => signOut()}
                        >
                            Logout
                        </Button>
                    ) : (
                        <Button
                           className="bg-purple-600 text-white hover:bg-purple-700"
                            onClick={() => signIn()}
                        >
                            SignIn
                        </Button>
                    )}
                </div>
            </div>
        
    )
}
