"use client"

import * as React from "react"
import {
  Bot,
  Settings2,
  Settings2Icon,
  User2,
} from "lucide-react"

import { NavMain } from "@/components/nav-main-menu"
import { NavUser } from "@/components/nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar"
import Image from "next/image"
import Link from "next/link"
import { set } from "zod"

const data = {

  menu: [
    {
      name: "Dashboard",
      url: "/admin/dashboard",
      icon: Bot,
    },
    {
      name: "Products ",
      url: "/admin/products",
      icon: Settings2,
     
    },
    {
      name: "Categories",
      url: "/admin/products/categories",
      icon: Settings2Icon,
     
    },
    {
      name: "Users",
      url: "/admin/users",
      icon: User2,
     
    }
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:p-1.5!"
            >
              <Link href="/admin/dashboard">
                <Image src="/images/logo-3.svg" alt="Logo" width={132} height={40} className="inline" />
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>

      </SidebarHeader>
      <SidebarContent>
        <NavMain menu={data.menu} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
