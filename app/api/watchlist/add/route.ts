import { addWatchlistItemByEmail } from '@/lib/actions/watchlist.actions'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
    try {
        const { email, symbol, company } = await req.json()

        if (!email || !symbol) {
            return NextResponse.json({ success: false, message: 'Missing email or symbol' }, { status: 400 })
        }

        const result = await addWatchlistItemByEmail(email, symbol, company || symbol)
        return NextResponse.json(result)
    } catch (error) {
        console.error('Watchlist add error:', error)
        return NextResponse.json({ success: false, message: 'Failed to add watchlist item' }, { status: 500 })
    }
}
