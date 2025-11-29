'use server'

import { connectToDatabase } from '@/database/mongoose'
import { Watchlist } from '@/database/models/watchlist.model'

export async function getWatchlistSymbolsByEmail(email: string): Promise<string[]> {
    if (!email) return []

    try {
        const mongoose = await connectToDatabase()
        const db = mongoose.connection.db
        if (!db) throw new Error('MongoDB connection not found')

        const user = await db.collection('user').findOne<{ _id?: unknown; id?: string; email?: string }>({ email })

        if (!user) return []

        const userId = (user.id as string) || String(user._id || '')
        if (!userId) return []

        const items = await Watchlist.find({ userId }, { symbol: 1 }).lean()
        return items.map((i) => String(i.symbol))
    } catch (err) {
        console.error('getWatchlistSymbolsByEmail error:', err)
        return []
    }
}

export async function addWatchlistItemByEmail(email: string, symbol: string, company: string) {
    if (!email || !symbol) {
        return { success: false, message: 'Email and symbol are required' }
    }

    try {
        const mongoose = await connectToDatabase()
        const db = mongoose.connection.db
        if (!db) throw new Error('MongoDB connection not found')

        const user = await db.collection('user').findOne<{ _id?: unknown; id?: string; email?: string }>({ email })

        if (!user) {
            return { success: false, message: 'User not found' }
        }

        const userId = (user.id as string) || String(user._id || '')
        if (!userId) {
            return { success: false, message: 'User ID not found' }
        }

        const item = new Watchlist({
            userId,
            symbol: symbol.toUpperCase(),
            company: company || symbol.toUpperCase(),
            addedAt: new Date(),
        })

        await item.save()
        return { success: true, message: 'Item added to watchlist' }
    } catch (err: any) {
        console.error('addWatchlistItemByEmail error:', err)
        if (err.code === 11000) {
            return { success: false, message: 'Item already in watchlist' }
        }
        return { success: false, message: 'Failed to add to watchlist' }
    }
}

export async function removeWatchlistItemByEmail(email: string, symbol: string) {
    if (!email || !symbol) {
        return { success: false, message: 'Email and symbol are required' }
    }

    try {
        const mongoose = await connectToDatabase()
        const db = mongoose.connection.db
        if (!db) throw new Error('MongoDB connection not found')

        const user = await db.collection('user').findOne<{ _id?: unknown; id?: string; email?: string }>({ email })

        if (!user) {
            return { success: false, message: 'User not found' }
        }

        const userId = (user.id as string) || String(user._id || '')
        if (!userId) {
            return { success: false, message: 'User ID not found' }
        }

        const result = await Watchlist.deleteOne({ userId, symbol: symbol.toUpperCase() })

        if (result.deletedCount === 0) {
            return { success: false, message: 'Watchlist item not found' }
        }

        return { success: true, message: 'Item removed from watchlist' }
    } catch (err) {
        console.error('removeWatchlistItemByEmail error:', err)
        return { success: false, message: 'Failed to remove from watchlist' }
    }
}