import WatchlistTable from '@/components/WatchlistTable'
import { auth } from '@/lib/better-auth/auth'
import { getWatchlistSymbolsByEmail } from '@/lib/actions/watchlist.actions'
import { getQuote, getCompanyProfile, getMetrics } from '@/lib/actions/finnhub.actions'
import { headers } from 'next/headers'

function formatPrice(price: number): string {
    return price > 0 ? `$${price.toFixed(2)}` : '-'
}

function formatChange(change: number, changePercent: number): string {
    if (changePercent === 0 && change === 0) return '-'
    const sign = change >= 0 ? '+' : ''
    return `${sign}${changePercent.toFixed(2)}%`
}

function formatMarketCap(marketCap: number): string {
    if (!marketCap || marketCap === 0) return '-'
    if (marketCap >= 1e12) return `$${(marketCap / 1e12).toFixed(2)}T`
    if (marketCap >= 1e9) return `$${(marketCap / 1e9).toFixed(2)}B`
    if (marketCap >= 1e6) return `$${(marketCap / 1e6).toFixed(2)}M`
    return `$${marketCap.toFixed(2)}`
}

function formatPeRatio(peRatio: number): string {
    return peRatio > 0 ? peRatio.toFixed(2) : '-'
}

export default async function WatchlistPage() {
    const session = await auth.api.getSession({
        headers: await headers(),
    })

    const userEmail = session?.user?.email || ''

    // Get real watchlist symbols from database
    const symbols = await getWatchlistSymbolsByEmail(userEmail)

    // Get detailed data for each symbol
    const watchlistData = await Promise.all(
        symbols.map(async (symbol) => {
            const [quote, profile, metrics] = await Promise.all([
                getQuote(symbol),
                getCompanyProfile(symbol),
                getMetrics(symbol),
            ])

            const peRatio = profile.peRatio ?? metrics.peRatio ?? 0

            return {
                Company: profile.name || symbol.toUpperCase(),
                Symbol: symbol.toUpperCase(),
                Price: formatPrice(quote.price || 0),
                Change: formatChange(quote.change || 0, quote.changePercent || 0),
                'Market Cap': formatMarketCap(profile.marketCap || 0),
                'P/E Ratio': formatPeRatio(peRatio),
                Alert: '-',
                Action: 'Remove',
            }
        })
    )

    return (
        <div className="px-6 py-8">
            <h1 className="text-2xl font-bold mb-6 text-white">My Watchlist</h1>

            {watchlistData.length === 0 ? (
                <div className="text-center py-12 text-gray-400">
                    <p className="text-lg">Your watchlist is empty</p>
                    <p className="text-sm mt-2">Add stocks from the stocks page to get started</p>
                </div>
            ) : (
                <WatchlistTable 
                    initialData={watchlistData} 
                    userEmail={userEmail} 
                />
            )}
        </div>
    )
}
