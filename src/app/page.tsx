import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Icons } from '@/components/ui/icons'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'

export default function HomePage() {
  return (
    <div className="container relative py-8 lg:py-12">
      <div className="mx-auto flex max-w-[980px] flex-col items-center gap-4 text-center">
        <h1 className="text-3xl font-bold leading-tight tracking-tighter sm:text-3xl md:text-5xl lg:text-6xl">
          Welcome to PetStore
        </h1>
        <p className="max-w-[700px] text-lg text-muted-foreground sm:text-xl">
          Browse, manage, and update pets in our store with ease.
        </p>

        <div className="flex gap-4 mt-6">
          <Button asChild>
            <Link href="/pets">
              Browse Pets
              <Icons.arrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>

          <Button variant="outline" asChild>
            <Link href="/pets?status=available">
              Available Pets
            </Link>
          </Button>
        </div>
      </div>

      <div className="grid gap-4 mt-16 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <Icons.paw className="h-8 w-8 mb-2" />
            <CardTitle>Browse Pets</CardTitle>
            <CardDescription>View all pets in our store</CardDescription>
          </CardHeader>
          <CardContent>
            <Button variant="link" className="px-0" asChild>
              <Link href="/pets">
                View all pets
                <Icons.arrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <Icons.search className="h-8 w-8 mb-2" />
            <CardTitle>Search & Filter</CardTitle>
            <CardDescription>Find pets by status or name</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              <Button variant="outline" size="sm" asChild>
                <Link href="/pets?status=available">Available</Link>
              </Button>
              <Button variant="outline" size="sm" asChild>
                <Link href="/pets?status=pending">Pending</Link>
              </Button>
              <Button variant="outline" size="sm" asChild>
                <Link href="/pets?status=sold">Sold</Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <Icons.edit className="h-8 w-8 mb-2" />
            <CardTitle>Manage Pets</CardTitle>
            <CardDescription>Update pet details and status</CardDescription>
          </CardHeader>
          <CardContent>
            <Button variant="link" className="px-0" asChild>
              <Link href="/pets">
                Get started
                <Icons.arrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>

      <div className="mt-16 text-center text-sm text-muted-foreground">
        <p>PetStore API powered by Swagger</p>
      </div>
    </div>
  )
}