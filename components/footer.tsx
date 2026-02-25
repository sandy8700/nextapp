export default function Footer() {
    return (
        <footer className="border-t py-6 mt-10">
            <div className="container mx-auto text-center text-sm text-muted-foreground">
                &copy; {new Date().getFullYear()} ShopKart. All rights reserved.
            </div>
        </footer>
    )
}
