"use client";

import Link from "next/link";
import { Navbar, Button, Input } from '@nextui-org/react';
import { ArrowLeft } from 'lucide-react';

import { useEffect, useState } from "react";
import { AuthClient } from "@dfinity/auth-client";
import { createActor, hello } from "declarations/hello";
import { Principal } from "@dfinity/principal";
import { ActorSubclass } from "@dfinity/agent";
import { _SERVICE } from "declarations/hello/hello.did";
import { useRouter } from "next/navigation";


const NewShop: React.FC = () => {
    const router = useRouter();
    const [value, setValue] = useState("");
    const [whoamiActor, setWhoamiActor] = useState<ActorSubclass<_SERVICE> | null>(null);
    const [principal, setPrincipal] = useState<Principal | undefined>(undefined);

    const router = useRouter();

    useEffect(() => {
        AuthClient.create().then(async (client) => {
            updateClient(client);
        });
    }, []);

    const canisterId = process.env.CANISTER_ID_HELLO;
    if (!canisterId) {
        throw new Error("CANISTER_ID_HELLO environment variable is not defined.");
    }
    const updateClient = async (client: AuthClient) => {
        const identity = client.getIdentity();
        const principal = identity.getPrincipal();
        setPrincipal(principal);

        const actor = createActor(canisterId, {
            agentOptions: {
                host: "http://localhost:4943",
                identity,
            },
        });

        setWhoamiActor(actor);
    }

    const testfn = async () => {
        console.log(principal?.toString());
    }

    const createShop = async () => {
        if (whoamiActor) {
            const result = await whoamiActor.create_shop(value);
            console.log(result);
            router.back();
        }
    }


    const { principal, whoami, initAuthClient } = authStore;

    const handleCreate = async () => {
        if (value != "") {
            // createShop(value);
            initAuthClient();
            whoami();
            console.log(principal);
        }
    };

    return (
        <div className="bg-black min-h-screen">
            <Navbar className='bg-black'>
                <Link href="/" passHref>
                    <Button isIconOnly className="bg-transparent text-white" aria-label="Profile">
                        <ArrowLeft />
                    </Button>
                </Link>
            </Navbar>
            <div className="dark px-10 pt-5 flex flex-col items-center justify-center">
                <Input
                    label="Name"
                    variant="bordered"
                    size="lg"
                    placeholder="Enter your shop name"
                    value={value}
                    labelPlacement="outside"
                    onValueChange={setValue}
                />

                <Button
                    onClick={createShop}
                    color="primary"
                    className="mt-16 w-4/5"
                >
                    Create
                </Button>
            </div>



            {/* 页面内容 */}
        </div>
    );
};

export default NewShop;