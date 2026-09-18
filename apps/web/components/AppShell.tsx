"use client";

import {usePathname} from "next/navigation";
import {ListenerShell} from "@/components/ListenerShell";

export function AppShell({children}:{children:React.ReactNode}){const pathname=usePathname();const isStandalone=["/admin","/narrator","/login","/signup"].some(prefix=>pathname===prefix||pathname.startsWith(`${prefix}/`));return isStandalone?<>{children}</>:<ListenerShell>{children}</ListenerShell>;}
