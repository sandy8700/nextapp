"use client";

import { setUser } from "@/app/store/authSlice";
import { AppSidebar } from "@/components/app-sidebar";
import { DataTable } from "@/components/data-table";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Field, FieldGroup } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { User } from "@/types/auth";
import { ColumnDef } from "@tanstack/react-table";
import { PencilIcon, TrashIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";


export default function UsersPage() {
    const router = useRouter();
    const [role, setRole] = useState("CUSTOMER");
    const [users, setUsers] = useState<User[]>([]);
    const [open, setOpen] = useState(false);
    const [deletingId, setDeletingId] = useState<number | null>(null);

    async function handleCreate(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();

        console.log("Creating user with role:", role);

        const form = new FormData(e.currentTarget);
        const res = await fetch("/api/users", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                name: form.get("name"),
                email: form.get("email"),
                password: form.get("password"),
                role: role,
            }),
        });

        const data = await res.json();
        if (res.ok) {
            toast.success("User created successfully!", {
            });

            setOpen(false);
        } else {
            toast.error("Failed to create user!", {
                description: data.message,
            })
        }


        loadUsers();
    };

    async function handleDelete(id: number) {
        const confirmed = window.confirm("Are you sure you want to delete this user?")
        if (!confirmed) return

        try {
            setDeletingId(id)

            const res = await fetch(`/api/users/${id}`, {
                method: "DELETE",
            })

            if (!res.ok) {
                const data = await res.json().catch(() => ({}))
                throw new Error(data.message || "Delete failed")
            }

            toast.success("User deleted successfully")

            setUsers(prev => prev.filter(user => Number(user.id) !== id))


        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : "Failed to delete user"
            toast.error(errorMessage)
        } finally {
            setDeletingId(null)
        }
    }
    const columns: ColumnDef<User>[] = [

        {
            accessorKey: "id",
            header: "ID",
            cell: ({ row }) => row.original.id,
        },
        // {
        //     accessorKey: "image",
        //     header: "Image",
        //     cell: ({ row }) => {
        //         const image = row.original.image
        //         return image ? (
        //             <div className="w-16 h-16">
        //                 <Image src={image} alt={row.original.name} className="w-full h-full object-cover rounded" width={50} height={50} />
        //             </div>
        //         ) : (
        //             <div className="w-14 h-14 bg-muted rounded flex items-center justify-center text-xs text-muted-foreground">
        //                 No Image
        //             </div>
        //         )
        //     },
        // },
        {
            accessorKey: "name",
            header: "Name",
        },


        {
            accessorKey: "email",
            header: "Email",
        },
        {
            accessorKey: "role",
            header: "Role",

        },
        {
            id: "actions",
            header: "Actions",
            cell: ({ row }) => {
                const user = row.original

                return (
                    <div className="flex gap-2">
                        <Button size="sm" className="cursor-pointer primary hover:text-green-500 hover:bg-green-200" variant="ghost" onClick={() => router.push(`/admin/users/${user.id}/edit`)}>
                            <PencilIcon />
                        </Button>

                        <Button size="sm" className="cursor-pointer text-destructive hover:bg-red-300 hover:text-destructive" variant="ghost" onClick={() => handleDelete(Number(user.id))}
                            disabled={deletingId === Number(user.id)}>
                            <TrashIcon />
                        </Button>
                    </div>
                )
            }
        }
    ]
    const loadUsers = async () => {
        try {
            const res = await fetch("/api/users");
            const data = await res.json();
            setUsers(data);
        } catch (error) {
            console.error("Load users error:", error);
        }
    };
    useEffect(() => {
        const timer = setTimeout(() => {
            loadUsers();
        }, 0);

        return () => clearTimeout(timer);
    }, []);

    // const handleRoleChange = async (userId: string, role: string) => {
    //     await fetch("/api/users", {
    //         method: "PUT",
    //         headers: {
    //             "Content-Type": "application/json",
    //         },
    //         body: JSON.stringify({
    //             userId,
    //             role,
    //         }),
    //     });

    //     loadUsers();
    // };

    return (
        <SidebarProvider>
            <AppSidebar />
            <SidebarInset>
                <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
                    <div className="flex items-center gap-2 px-4">
                        <SidebarTrigger className="-ml-1" />
                        <Separator
                            orientation="vertical"
                            className="mr-2 data-[orientation=vertical]:h-4"
                        />
                        <Breadcrumb>
                            <BreadcrumbList>
                                <BreadcrumbItem className="hidden md:block">
                                    <BreadcrumbLink href="#">
                                        Dashboard
                                    </BreadcrumbLink>
                                </BreadcrumbItem>
                                <BreadcrumbSeparator className="hidden md:block" />
                                <BreadcrumbItem>
                                    <BreadcrumbPage>Users</BreadcrumbPage>
                                </BreadcrumbItem>
                            </BreadcrumbList>
                        </Breadcrumb>
                    </div>
                </header>
                <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
                    <div className="flex justify-between items-center">
                        <h1 className="text-2xl font-bold tracking-tight">
                            Users
                        </h1>

                        <Dialog open={open} onOpenChange={setOpen}>
                            <DialogTrigger asChild>
                                <Button size="sm" className="px-4 cursor-pointer" onClick={() => setOpen(true)}>
                                    Add User
                                </Button>
                            </DialogTrigger>
                            <DialogContent className="sm:max-w-sm">
                                <form onSubmit={handleCreate}>
                                    <DialogHeader className="mb-3">
                                        <DialogTitle>Add User</DialogTitle>
                                        <DialogDescription>
                                            Enter the details for the new user.
                                        </DialogDescription>
                                    </DialogHeader>
                                    <FieldGroup>
                                        <Field>
                                            <Label htmlFor="name">Name</Label>
                                            <Input placeholder="Name"
                                                className="border p-2 w-full"
                                                id="name"
                                                type="text"
                                                name="name"
                                            />
                                        </Field>
                                        <Field>
                                            <Label htmlFor="email">Email</Label>
                                            <Input placeholder="Email"
                                                className="border p-2 w-full"
                                                id="email"
                                                type="email"
                                                name="email"
                                            />

                                        </Field>
                                        <Field>
                                            <Label htmlFor="password-1">Password</Label>
                                            <Input placeholder="Password"
                                                className="border p-2 w-full"
                                                type="password"
                                                id="password"
                                                name="password"
                                            />
                                            {/* <InputGroup>
                                                    <InputGroupInput id="password" type={show ? "text" : "password"} name="password" placeholder="******" required />
                                                    <InputGroupAddon align="inline-end">
                                                        <button
                                                            type="button"
                                                            onClick={() => setShow(!show)}
                                                            className="cursor-pointer text-muted-foreground hover:text-foreground"
                                                        >
                                                            {show ? <EyeIcon size={18} /> : <EyeOffIcon size={18} />}
                                                        </button>
                                                    </InputGroupAddon>
                                                </InputGroup> */}
                                        </Field>
                                        <Field>
                                            <Label htmlFor="role">Role</Label>
                                            <Select onValueChange={(value) => setRole(value)}>
                                                <SelectTrigger className="w-full ">
                                                    <SelectValue placeholder="Select a role" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectGroup>
                                                        <SelectItem key="CUSTOMER" value="CUSTOMER">
                                                            Customer
                                                        </SelectItem>
                                                        <SelectItem key="ADMIN" value="ADMIN">
                                                            Admin
                                                        </SelectItem>
                                                    </SelectGroup>
                                                </SelectContent>
                                            </Select>

                                        </Field>

                                    </FieldGroup>
                                    <DialogFooter className="mt-5">
                                        <DialogClose asChild>
                                            <Button variant="outline">Cancel</Button>
                                        </DialogClose>
                                        <Button type="submit">Save changes</Button>
                                    </DialogFooter>
                                </form>
                            </DialogContent>
                        </Dialog>
                    </div>
                    <DataTable columns={columns} data={users} />
                </div>
            </SidebarInset>
        </SidebarProvider>

    );
}