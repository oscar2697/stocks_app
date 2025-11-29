import StockDetailsClient from "@/components/StockDetailsClient"
import { auth } from "@/lib/better-auth/auth"
import { headers } from "next/headers"

export default async function StockDetails({ params }: StockDetailsPageProps) {
    const { symbol } = await params
    
    const session = await auth.api.getSession({
        headers: await headers(),
    })

    const userEmail = session?.user?.email || ""

    return <StockDetailsClient symbol={symbol} userEmail={userEmail} />
}