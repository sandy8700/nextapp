"use client"
import { AppSidebar } from "@/components/app-sidebar"
import { DataTable } from "@/components/data-table"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { Product } from "@/types/products"
import { ColumnDef } from "@tanstack/react-table"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { toast } from "sonner"


export default function Products() {
  const router = useRouter();
 const [deletingId, setDeletingId] = useState<number | null>(null)

async function handleDelete(id: number) {
  const confirmed = window.confirm("Are you sure you want to delete this product?")
  if (!confirmed) return

  try {
    setDeletingId(id)

    const res = await fetch(`/api/products/${id}`, {
      method: "DELETE",
    })

    if (!res.ok) {
      const data = await res.json().catch(() => ({}))
      throw new Error(data.message || "Delete failed")
    }

    toast.success("Product deleted successfully")
    
     setProducts(prev => prev.filter(product => product.id !== id))


  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Failed to delete product"
    toast.error(errorMessage)
  } finally {
    setDeletingId(null)
  }
}
  const columns: ColumnDef<Product>[] = [

    {
      accessorKey: "id",
      header: "ID",
      cell: ({ row }) => row.index + 1,
    },
    {
      accessorKey: "name",
      header: "Name",
    },
    {
      accessorKey: "price",
      header: "Price",
      cell: ({ row }) => {
        const price = row.getValue("price") as number
        return `₹ ${price.toLocaleString("en-IN")}`
      },
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => {
        const product = row.original

        return (
          <div className="flex gap-2">
            <Button size="sm" className="cursor-pointer" variant="outline" onClick={() => router.push(`/admin/products/${product.id}/edit`)}>
              Edit
            </Button>

            <Button size="sm" className="cursor-pointer" variant="destructive" onClick={() => handleDelete(Number(product.id))}
              disabled={deletingId === Number(product.id)}>
              {deletingId === Number(product.id) ? "Deleting..." : "Delete"}
            </Button>
          </div>
        )
      }
    }
  ]
  const [products, setProducts] = useState<Product[]>([])

  useEffect(() => {
    const list = async () => {
      const res = await fetch("/api/products")
      const data = await res.json()
      setProducts(data)
    }
    void list()
  }, [])

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
                  <BreadcrumbPage>Products</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold tracking-tight">
              Products
            </h1>
            <Link href="/admin/products/add" className="cursor-pointer">
              <Button className="px-4 " size="sm">Add Product</Button>
            </Link>
          </div>
          <DataTable columns={columns} data={products} />
        </div>
      </SidebarInset>
    </SidebarProvider>


  )
}
