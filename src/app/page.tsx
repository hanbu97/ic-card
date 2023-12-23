"use client";

import Image from 'next/image'
import { Button, Card, Dropdown, DropdownItem, DropdownMenu, DropdownTrigger, NextUIProvider, Tab, Tabs } from "@nextui-org/react";
import Greeting from 'components/Greeting';
import AuthSection from 'components/AuthSelection';
import { Navbar, NavbarBrand, NavbarContent, NavbarItem, Link } from "@nextui-org/react";
import { HttpAgent, Identity } from "@dfinity/agent";
import React, { useState, useEffect } from 'react';
import { AuthClient } from "@dfinity/auth-client";
import { useActorMethod, initialize } from "../service/hello"; // 引入 initialize 函数
import { createActor, hello } from "../declarations/hello";
import { UserIcon } from 'lucide-react';
import { Principal } from '@dfinity/principal';
import { log } from 'console';


export default function Home() {
  const [authClient, setAuthClient] = useState<AuthClient | null>(null);
  // const { call: whoAmI, data: principal, loading, error } = useActorMethod("whoami");

  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [identity, setIdentity] = useState<Identity | undefined>(undefined);
  const [principal, setPrincipal] = useState<Principal | undefined>(undefined);
  const [whoamiActor, setWhoamiActor] = useState<any>(null);

  useEffect(() => {
    // Initialize AuthClient
    AuthClient.create().then(async (client) => {
      updateClient(client);
    });
  }, []);


  // useEffect(() => {
  //   const initAuthClient = async () => {
  //     const newAuthClient = await AuthClient.create();
  //     setAuthClient(newAuthClient);
  //   };

  //   initAuthClient();

  //   // whoAmI();
  // }, []);

  // const logout = async () => {
  //   await authClient?.logout();

  //   const tmpIdentity = authClient?.getIdentity();
  //   setIdentity(tmpIdentity);

  //   const identity = client.getIdentity();
  //   setIdentity(identity);

  //   const principal = identity.getPrincipal();
  //   setPrincipal(principal);

  //   setAuthClient(client);

  //   const actor = createActor(canisterId, {
  //     agentOptions: {
  //       identity,
  //     },
  //   });

  //   whoAmI();
  //   console.log(principal);
  // }

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
    authClient?.login({
      identityProvider: process.env.DFX_NETWORK === "ic"
        ? "https://identity.ic0.app"
        : `http://localhost:4943/?canisterId=br5f7-7uaaa-aaaaa-qaaca-cai`,
      onSuccess: () => {
        updateClient(authClient);
      },
    });
  };

  // const handleLogin = async () => {
  //   if (authClient) {
  //     await new Promise<void>((resolve) => {
  //       authClient.login({
  //         identityProvider: process.env.DFX_NETWORK === "ic"
  //           ? "https://identity.ic0.app"
  //           : `http://localhost:4943/?canisterId=br5f7-7uaaa-aaaaa-qaaca-cai`,
  //         onSuccess: () => resolve(),
  //       });
  //     });

  //     const identity = authClient.getIdentity();
  //     initialize(identity); // 使用新的身份初始化

  //     // 重新初始化全局 actor 实例
  //     const agent = new HttpAgent({ identity });
  //     const canisterId = process.env.CANISTER_ID_HELLO;

  //     if (!canisterId) {
  //       throw new Error("CANISTER_ID_HELLO environment variable is not defined.");
  //     }

  //     // const newActor = createActor(canisterId, { agent });
  //     // 这里可能不需要显式设置 actor，因为 initialize 应该已经更新了全局状态

  //     // whoAmI();
  //     console.log(principal);
  //   }
  // };

  const testfn = async () => {
    const identity = authClient?.getIdentity();
    const principal = identity?.getPrincipal();
    console.log(principal?.toString());

    console.log(isAuthenticated);
  }

  return (
    <main className="dark flex min-h-screen flex-col items-center justify-between ">
      <Navbar className='bg-black'>
        <NavbarBrand>
          {/* <AcmeLogo /> */}
          <p className="font-bold text-inherit">ICpay</p>
        </NavbarBrand>
        <NavbarContent className="hidden sm:flex" justify="center">
          <Tabs color='default' aria-label="Tabs">
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

      <Button onClick={testfn}
        className='flex flex-col' color="primary">
        Button
      </Button>


      {/* <div className="z-10 max-w-5xl w-full items-center justify-between font-mono text-sm lg:flex">
        <p className="fixed left-0 top-0 flex w-full justify-center border-b border-gray-300 bg-gradient-to-b from-zinc-200 pb-6 pt-8 backdrop-blur-2xl dark:border-neutral-800 dark:bg-zinc-800/30 dark:from-inherit lg:static lg:w-auto  lg:rounded-xl lg:border lg:bg-gray-200 lg:p-4 lg:dark:bg-zinc-800/30">
          Get started by editing&nbsp;
          <code className="font-mono font-bold">src/app/page.tsx</code>
        </p>
        <div className="fixed bottom-0 left-0 flex h-48 w-full items-end justify-center bg-gradient-to-t from-white via-white dark:from-black dark:via-black lg:static lg:h-auto lg:w-auto lg:bg-none">
          <a
            className="pointer-events-none flex place-items-center gap-2 p-8 lg:pointer-events-auto lg:p-0"
            href="https://vercel.com?utm_source=create-next-app&utm_medium=appdir-template&utm_campaign=create-next-app"
            target="_blank"
            rel="noopener noreferrer"
          >
            By{' '}
            <Image
              src="/vercel.svg"
              alt="Vercel Logo"
              className="dark:invert"
              width={100}
              height={24}
              priority
            />
          </a>
        </div>
      </div>
      <Greeting />
      <AuthSection />
      <NextUIProvider>
        <Button color="primary">
          Button
        </Button>
      </NextUIProvider>
      <div className="relative flex place-items-center before:absolute before:h-[300px] before:w-[480px] before:-translate-x-1/2 before:rounded-full before:bg-gradient-radial before:from-white before:to-transparent before:blur-2xl before:content-[''] after:absolute after:-z-20 after:h-[180px] after:w-[240px] after:translate-x-1/3 after:bg-gradient-conic after:from-sky-200 after:via-blue-200 after:blur-2xl after:content-[''] before:dark:bg-gradient-to-br before:dark:from-transparent before:dark:to-blue-700 before:dark:opacity-10 after:dark:from-sky-900 after:dark:via-[#0141ff] after:dark:opacity-40 before:lg:h-[360px] z-[-1]">
        <Image
          className="relative dark:drop-shadow-[0_0_0.3rem_#ffffff70] dark:invert"
          src="/next.svg"
          alt="Next.js Logo"
          width={180}
          height={37}
          priority
        />
      </div>

      <div className="mb-32 grid text-center lg:max-w-5xl lg:w-full lg:mb-0 lg:grid-cols-4 lg:text-left">
        <a
          href="https://nextjs.org/docs?utm_source=create-next-app&utm_medium=appdir-template&utm_campaign=create-next-app"
          className="group rounded-lg border border-transparent px-5 py-4 transition-colors hover:border-gray-300 hover:bg-gray-100 hover:dark:border-neutral-700 hover:dark:bg-neutral-800/30"
          target="_blank"
          rel="noopener noreferrer"
        >
          <h2 className={`mb-3 text-2xl font-semibold`}>
            Docs{' '}
            <span className="inline-block transition-transform group-hover:translate-x-1 motion-reduce:transform-none">
              -&gt;
            </span>
          </h2>
          <p className={`m-0 max-w-[30ch] text-sm opacity-50`}>
            Find in-depth information about Next.js features and API.
          </p>
        </a>

        <a
          href="https://nextjs.org/learn?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
          className="group rounded-lg border border-transparent px-5 py-4 transition-colors hover:border-gray-300 hover:bg-gray-100 hover:dark:border-neutral-700 hover:dark:bg-neutral-800/30"
          target="_blank"
          rel="noopener noreferrer"
        >
          <h2 className={`mb-3 text-2xl font-semibold`}>
            Learn{' '}
            <span className="inline-block transition-transform group-hover:translate-x-1 motion-reduce:transform-none">
              -&gt;
            </span>
          </h2>
          <p className={`m-0 max-w-[30ch] text-sm opacity-50`}>
            Learn about Next.js in an interactive course with&nbsp;quizzes!
          </p>
        </a>

        <a
          href="https://vercel.com/templates?framework=next.js&utm_source=create-next-app&utm_medium=appdir-template&utm_campaign=create-next-app"
          className="group rounded-lg border border-transparent px-5 py-4 transition-colors hover:border-gray-300 hover:bg-gray-100 hover:dark:border-neutral-700 hover:dark:bg-neutral-800/30"
          target="_blank"
          rel="noopener noreferrer"
        >
          <h2 className={`mb-3 text-2xl font-semibold`}>
            Templates{' '}
            <span className="inline-block transition-transform group-hover:translate-x-1 motion-reduce:transform-none">
              -&gt;
            </span>
          </h2>
          <p className={`m-0 max-w-[30ch] text-sm opacity-50`}>
            Explore the Next.js 13 playground.
          </p>
        </a>

        <a
          href="https://vercel.com/new?utm_source=create-next-app&utm_medium=appdir-template&utm_campaign=create-next-app"
          className="group rounded-lg border border-transparent px-5 py-4 transition-colors hover:border-gray-300 hover:bg-gray-100 hover:dark:border-neutral-700 hover:dark:bg-neutral-800/30"
          target="_blank"
          rel="noopener noreferrer"
        >
          <h2 className={`mb-3 text-2xl font-semibold`}>
            Deploy{' '}
            <span className="inline-block transition-transform group-hover:translate-x-1 motion-reduce:transform-none">
              -&gt;
            </span>
          </h2>
          <p className={`m-0 max-w-[30ch] text-sm opacity-50`}>
            Instantly deploy your Next.js site to a shareable URL with Vercel.
          </p>
        </a>
      </div> */}
    </main>
  )
}
