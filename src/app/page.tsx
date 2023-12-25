"use client";

// import Image from 'next/image'
import { Button, Card, CardBody, CardFooter, Dropdown, DropdownItem, DropdownMenu, DropdownTrigger, NextUIProvider, Tab, Tabs, Image } from "@nextui-org/react";
import Greeting from 'components/Greeting';
import AuthSection from 'components/AuthSelection';
import { Navbar, NavbarBrand, NavbarContent, NavbarItem, Link } from "@nextui-org/react";
import { HttpAgent, Identity } from "@dfinity/agent";
import React, { useState, useEffect, Key } from 'react';
import { AuthClient } from "@dfinity/auth-client";
// import { useActorMethod, initialize } from "../service/hello"; // 引入 initialize 函数
import { createActor, hello } from "declarations/hello";
import { UserIcon } from 'lucide-react';
import { Principal } from '@dfinity/principal';
import { log } from 'console';
// import { useAuthStore } from "service/auth";
import useStore from "service/store";
// import { Grid, Text } from '@nextui-org/react';

// import useStore from "service/store";
// import { useGetShops } from "service/hello";

export default function Home() {
  const testfn = async () => {
    console.log(principal?.toString());
    console.log(isAuthenticated);
  }

  const { isAuthenticated, login, logout, principal, getShops, shops } = useAuthStore();
  const selectedTab = useStore((state) => state.selectedTab);
  const setSelectedTab = useStore((state) => state.setSelectedTab);

  // 使用一个固定的图片路径
  const imgPath = "/images/test1.jpeg";

  useEffect(() => {
    if (selectedTab === 'Merchant') {
      getShops(); // 当选中 'Merchant' 时，获取商店数据
    }
  }, [selectedTab, getShops]);

  const handleSelectTab = async (key: Key) => {
    const tabKey = String(key);
    setSelectedTab(tabKey);
    if (tabKey === 'Merchant') {
      await getShops(); // 调用 getShops 方法获取商店数据
    }
  }

  return (
    // <main className="dark bg-black flex flex-col items-center justify-between ">
    <main className="dark bg-black flex flex-col items-center justify-start min-h-screen">
      <Navbar className='bg-black'>
        <NavbarBrand>
          {/* <AcmeLogo /> */}
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
              {/* {principal == undefined || principal!.toString() === "2vxsx-fae" ? ( */}
              {!isAuthenticated ? (
                <Button
                  // onClick={handleLogin}
                  onClick={login}
                  // disabled={loading}
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
          {shops.map((title, index) => (
            <Card shadow="sm" key={index} isPressable onPress={() => console.log("item pressed")}>
              <CardBody className="overflow-visible p-0">
                <Image
                  shadow="sm"
                  radius="lg"
                  width="100%"
                  alt={title.name}
                  className="object-cover h-[140px] w-[200px]"
                  src={imgPath}
                />
              </CardBody>
              <CardFooter className="flex justify-center">
                <b>{title.name}</b>
              </CardFooter>
            </Card>
          ))}
          {/* new shop */}
          <a
            href="/newshop">
            <Card shadow="sm" isPressable>
              <CardBody className="flex justify-center items-center h-[190px] w-[200px]">
                <h2 className="text-3xl font-semibold">+</h2>
              </CardBody>
            </Card>
          </a>

        </div>
      )}
    </main>
  )
}
