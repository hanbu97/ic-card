"use client";

// HomeTop.jsx
import React, { Key } from 'react';
import { Navbar, NavbarBrand, NavbarContent, NavbarItem, Link, Button, Dropdown, DropdownItem, DropdownMenu, DropdownTrigger, Tab, Tabs } from "@nextui-org/react";
import { UserIcon } from 'lucide-react';
import { authStore } from "service/auth"; // 根据实际路径调整
import { observer } from 'mobx-react';

const HomeTop = observer(() => {
    const { isAuthenticated, login, logout, setSelectedTab, getShops } = authStore;

    const handleSelectTab = async (key: Key) => {
        const tabKey = String(key);
        setSelectedTab(tabKey);
        if (tabKey === 'Merchant') {
            await getShops(); // 调用 getShops 方法获取商店数据
        }
    }

    return (
        <Navbar className='bg-black'>
            <NavbarBrand>
                <p className="font-bold text-inherit">ICpay</p>
            </NavbarBrand>
            <NavbarContent className="flex" justify="center">
                <Tabs
                    color='default'
                    aria-label="Tabs"
                    onSelectionChange={handleSelectTab}
                >
                    <Tab key="Customer" title="Customer" />
                    <Tab key="Merchant" title="Merchant" />
                </Tabs>
            </NavbarContent>
            <NavbarContent justify="end">
                <NavbarItem className="hidden lg:flex">
                    <Link href="#">Login</Link>
                </NavbarItem>
                <NavbarItem>
                    <>
                        {!isAuthenticated ? (
                            <Button
                                onClick={login}
                                className='font-bold text-md'
                                color="primary"
                                as={Link}
                                href="#"
                                variant="solid"
                            >
                                Login
                            </Button>
                        ) : (
                            <Dropdown className='bg-black' backdrop="blur">
                                <DropdownTrigger>
                                    <Button isIconOnly color="primary" aria-label="Profile">
                                        <UserIcon />
                                    </Button>
                                </DropdownTrigger>
                                <DropdownMenu
                                    aria-label="Dropdown Variants"
                                    color='primary'
                                >
                                    <DropdownItem key="new" onClick={logout}>Log Out</DropdownItem>
                                </DropdownMenu>
                            </Dropdown>
                        )}
                    </>
                </NavbarItem>
            </NavbarContent>
        </Navbar>
    );
});

export default HomeTop;
