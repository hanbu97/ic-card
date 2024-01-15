'use client';

import { Button, Card, CardBody } from "@nextui-org/react"
import React, { use, useEffect, useState } from "react"
import { Shop, _SERVICE } from "declarations/hello/hello.did";
import { AuthClient } from "@dfinity/auth-client";
import { createActor, hello } from "declarations/hello";

interface HomeCustomerProps { }

const HomeCustomer: React.FC<HomeCustomerProps> = ({ }) => {
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

        const shopsData = await actor.get_cards();
        const formattedShops = shopsData.map(shopStr => {
            const [name, owner] = shopStr.split(":");
            return { name, owner };
        });

        // setShops(shops);
        // setShops(formattedShops);
    }

    return (
        <div className="gap-4 grid grid-cols-1 items-start px-2 w-full">
            <Button />
            {shops.map((shop, index) => (
                <Card shadow="sm" key={index} isPressable onPress={() => console.log("item pressed")} className="min-w-[300px]">
                    <CardBody className="flex flex-col justify-start px-4 py-8">
                        <div className="text-left text-2xl font-bold text-white pb-2">{shop.name}</div>
                        <div className="text-xs text-cyan-700">{shop.owner}</div>
                    </CardBody>
                </Card>
            ))}
        </div>
    )
}

export default HomeCustomer
