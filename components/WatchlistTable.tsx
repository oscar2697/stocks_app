'use client'

import { useState } from 'react'
import { WATCHLIST_TABLE_HEADER } from '@/lib/constants'

interface WatchlistTableProps {
    initialData?: Array<Record<string, string>>
    userEmail?: string
}

const WatchlistTable = ({ initialData = [], userEmail = '' }: WatchlistTableProps) => {
    const [rows, setRows] = useState(initialData)

    const handleRemove = async (symbol: string) => {
        if (!userEmail) {
            alert('User email not found')
            return
        }

        try {
            const response = await fetch('/api/watchlist/remove', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: userEmail, symbol }),
            })

            if (response.ok) {
                setRows((prev) => prev.filter((row) => (row as any).Symbol !== symbol))
            } else {
                alert('Failed to remove from watchlist')
            }
        } catch (error) {
            console.error('Remove error:', error)
            alert('Error removing from watchlist')
        }
    }

    return (
        <div className="rounded-md border border-gray-800 overflow-x-auto bg-surface-900">
            <table className="min-w-full w-full text-sm text-left">
                <thead className="bg-gray-900">
                    <tr>
                        {WATCHLIST_TABLE_HEADER.map((header) => (
                            <th key={header} className="px-4 py-3 font-medium text-gray-300">
                                {header}
                            </th>
                        ))}
                    </tr>
                </thead>

                <tbody className="divide-y divide-gray-800">
                    {rows.map((row, index) => (
                        <tr key={index} className="hover:bg-gray-900/40">
                            {WATCHLIST_TABLE_HEADER.map((col) => {
                                if (col === 'Action') {
                                    return (
                                        <td key={col} className="px-4 py-3 text-gray-200">
                                            <button
                                                onClick={() => handleRemove((row as any).Symbol)}
                                                className="text-red-400 hover:text-red-300 transition-colors cursor-pointer"
                                            >
                                                Remove
                                            </button>
                                        </td>
                                    )
                                }

                                return (
                                    <td key={col} className="px-4 py-3 text-gray-200">
                                        {(row as any)[col]}
                                    </td>
                                )
                            })}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}

export default WatchlistTable
