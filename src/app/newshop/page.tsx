"use client";

import Link from "next/link";
import { Navbar, Button, Input } from '@nextui-org/react';
import { ArrowLeft } from 'lucide-react';
import { useState } from "react";

const NewShop: React.FC = () => {
    const [value, setValue] = useState("");

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

                <Button color="primary" className="mt-16 w-4/5">
                    Create
                </Button>
            </div>



            {/* 页面内容 */}
        </div>
    );
};

export default NewShop;