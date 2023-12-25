"use client";

import React from 'react';
import { Card, CardBody, CardFooter, Image, Button } from "@nextui-org/react";
import { authStore } from 'service/auth';
import { observer } from 'mobx-react';

const HomeContent = observer(() => {
    const imgPath = "/images/test1.jpeg";
    const { whoami, shops, selectedTab, principal, isAuthenticated } = authStore;

    const testfn = async () => {
        whoami();
        console.log(principal?.toString());
        console.log(isAuthenticated);
    }

    return (
        <>
            {selectedTab === 'Customer' && (
                <div className="flex flex-1 items-center justify-center">
                    <p>Customers Content</p>
                    <Button color="primary" onClick={testfn}>
                        TEST
                    </Button>
                </div>
            )}

            {selectedTab === 'Merchant' && (
                <div className="gap-2 grid grid-cols-2 items-start">
                    {shops.map((shop, index) => (
                        <Card shadow="sm" key={index} isPressable onPress={() => console.log("item pressed")}>
                            <CardBody className="overflow-visible p-0">
                                <Image
                                    shadow="sm"
                                    radius="lg"
                                    width="100%"
                                    alt={shop.name}
                                    className="object-cover h-[140px] w-[200px]"
                                    src={imgPath}
                                />
                            </CardBody>
                            <CardFooter className="flex justify-center">
                                <b>{shop.name}</b>
                            </CardFooter>
                        </Card>
                    ))}

                    {/* new shop */}
                    <a href="/newshop">
                        <Card shadow="sm" isPressable>
                            <CardBody className="flex justify-center items-center h-[190px] w-[200px]">
                                <h2 className="text-3xl font-semibold">+</h2>
                            </CardBody>
                        </Card>
                    </a>
                </div>
            )}
        </>
    );
});

export default HomeContent;
