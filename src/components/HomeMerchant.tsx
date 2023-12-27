'use client';

import { Button, Card, CardBody, CardFooter, Image } from "@nextui-org/react"
import React, { use, useEffect, useState } from "react"
import { Store } from 'lucide-react';
import { ActorSubclass } from "@dfinity/agent";
import { _SERVICE } from "declarations/hello/hello.did";
import { Principal } from "@dfinity/principal";
import { AuthClient } from "@dfinity/auth-client";
import { createActor, hello } from "declarations/hello";

interface HomeMerchantProps { }

interface Shop {
    name: string;
}

const HomeMerchant: React.FC<HomeMerchantProps> = ({ }) => {
    // shops
    const [shops, setShops] = useState<Shop[]>([]);

    useEffect(() => {
        AuthClient.create().then(async (client) => {
            await updateClient(client);
        });
    }, []);

    const updateClient = async (client: AuthClient) => {
        const identity = client.getIdentity();
        const canisterId = process.env.CANISTER_ID_HELLO;
        if (!canisterId) {
            throw new Error("CANISTER_ID_HELLO environment variable is not defined.");
        }
        const actor = createActor(canisterId, {
            agentOptions: {
                host: "http://localhost:4943",
                identity,
            },
        });

        const shops = await actor.get_shops();
        setShops(shops);
    }

    return (
        <>
            {shops.map((shop, index) => (
                <Card shadow="sm" key={index} isPressable onPress={() => console.log("item pressed")}>
                    <CardBody className="overflow-visible px-4 pt-8 flex justify-center items-center">
                        <Store size={110} className="text-center" />
                    </CardBody>
                    <CardFooter className="flex justify-center text-2xl">
                        <b>{shop.name}</b>
                    </CardFooter>
                </Card>
            ))}
        </>
    )
}

export default HomeMerchant
