"use client";

import { Button, Card, CardBody, CardFooter, Dropdown, DropdownItem, DropdownMenu, DropdownTrigger, NextUIProvider, Tab, Tabs, Image } from "@nextui-org/react";
import Greeting from 'components/Greeting';
import AuthSection from 'components/AuthSelection';
import { Navbar, NavbarBrand, NavbarContent, NavbarItem, Link } from "@nextui-org/react";
import { HttpAgent, Identity } from "@dfinity/agent";
import React, { useState, useEffect } from 'react';
import { AuthClient } from "@dfinity/auth-client";
import { useActorMethod, initialize } from "../service/hello"; // 引入 initialize 函数
import { createActor, hello } from "declarations/hello";
import { UserIcon } from 'lucide-react';
import { Principal } from '@dfinity/principal';
import { log } from 'console';
import HomeMerchant from "components/HomeMerchant";
import HomeCustomer from "components/HomeCustomer";

export default function Home() {
  const [authClient, setAuthClient] = useState<AuthClient | null>(null);
  // const { call: whoAmI, data: principal, loading, error } = useActorMethod("whoami");

  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [identity, setIdentity] = useState<Identity | undefined>(undefined);
  const [principal, setPrincipal] = useState<Principal | undefined>(undefined);
  const [whoamiActor, setWhoamiActor] = useState<any>(null);

  // app mode 
  const [selectedTab, setSelectedTab] = useState<String>('Customer');



  // 使用一个固定的图片路径
  const imgPath = "/images/fruit-1.jpeg";

  useEffect(() => {
    // Initialize AuthClient
    AuthClient.create().then(async (client) => {
      updateClient(client);
    });
  }, []);


  const logout = () => {
    authClient?.logout().then(() => {
      updateClient(authClient!);
    });

    testfn();
  }


  const updateClient = async (client: AuthClient) => {
    const isAuthenticated = await client.isAuthenticated();
    setIsAuthenticated(isAuthenticated);

    const identity = client.getIdentity();
    setIdentity(identity);

    const principal = identity.getPrincipal();
    setPrincipal(principal);

    setAuthClient(client);

    const canisterId = process.env.CANISTER_ID_HELLO;
    if (!canisterId) {
      throw new Error("CANISTER_ID_HELLO environment variable is not defined.");
    }
    const actor = createActor(canisterId, {
      agentOptions: {
        identity,
      },
    });

    setWhoamiActor(actor);
  }

  const login = () => {
    const canisterId = process.env.CANISTER_ID_INTERNET_IDENTITY;
    authClient?.login({
      identityProvider: process.env.DFX_NETWORK === "ic"
        ? "https://identity.ic0.app"
        : `http://localhost:4943/?canisterId=${canisterId}`,
      onSuccess: () => {
        updateClient(authClient);
      },
    });
  };

  const testfn = async () => {
    const identity = authClient?.getIdentity();
    const principal = identity?.getPrincipal();
    console.log(principal?.toString());

    console.log(isAuthenticated);
  }

  return (
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
            onSelectionChange={(key) => setSelectedTab(key as string)}
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
        <HomeCustomer />
      )}

      {selectedTab === 'Merchant' && (
        <div className="gap-2 grid grid-cols-2 items-start">
          <HomeMerchant />
          {/* new shop */}
          <a
            href="/newshop">
            <Card shadow="sm" isPressable>
              <CardBody className="flex justify-center items-center h-[210px] w-[200px]">
                <h2 className="text-3xl font-semibold">+</h2>
              </CardBody>
            </Card>
          </a>
        </div>
      )}
    </main>
  )
}
