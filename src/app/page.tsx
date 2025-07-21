import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Icons } from '@/components/ui/icons'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

export default function HomePage() {
  return (
    <div className="container relative flex flex-col items-center px-8 lg:px-12 mx-auto">
      <div className="flex max-w-[980px] flex-col items-center gap-4 text-center">
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

      <div className="grid gap-8 mt-16 md:grid-cols-2 lg:grid-cols-2 justify-center">
        <Link href="/pets" className="block w-full max-w-md">
          <Card className="h-full hover:shadow-lg transition-shadow cursor-pointer">
            <CardHeader>
              <Icons.paw className="h-8 w-8 mb-2" />
              <CardTitle>Browse Pets</CardTitle>
              <CardDescription>View all pets in our store</CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="ghost" size="lg" className="px-0 pointer-events-none font-semibold">
                View all pets
                <Icons.arrowRight className="ml-2 h-5 w-5" />
              </Button>
            </CardContent>
          </Card>
        </Link>

        <div className="w-full max-w-md">
          <Card className="h-full">
            <CardHeader>
              <Icons.search className="h-8 w-8 mb-2" />
              <CardTitle>Search & Filter</CardTitle>
              <CardDescription>Find pets by status or name</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-3">
                <Link href="/pets?status=available">
                  <Badge className="px-4 py-2 text-sm bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 hover:bg-green-200 dark:hover:bg-green-800 transition-colors cursor-pointer">
                    Available
                  </Badge>
                </Link>
                <Link href="/pets?status=pending">
                  <Badge className="px-4 py-2 text-sm bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200 hover:bg-yellow-200 dark:hover:bg-yellow-800 transition-colors cursor-pointer">
                    Pending
                  </Badge>
                </Link>
                <Link href="/pets?status=sold">
                  <Badge className="px-4 py-2 text-sm bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200 hover:bg-red-200 dark:hover:bg-red-800 transition-colors cursor-pointer">
                    Sold
                  </Badge>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="mt-16 text-center text-sm text-muted-foreground">
        <p>PetStore API powered by Swagger</p>
      </div>
    </div>
  )
}