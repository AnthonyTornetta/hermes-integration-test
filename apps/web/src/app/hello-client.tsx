"use client"

import { useEffect, useState } from "react"

export function HelloClient() {
  const [data, setData] = useState<{ message: string; timestamp: string } | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetch("/api/hello")
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`)
        return res.json()
      })
      .then(setData)
      .catch((err) => setError(err.message))
  }, [])

  return (
    <div className="mt-8 rounded-xl border border-black/[.08] p-6 text-center dark:border-white/[.145]">
      {error ? (
        <p className="text-red-600">Error: {error}</p>
      ) : data ? (
        <>
          <p className="text-lg font-medium">{data.message}</p>
          <p className="mt-2 text-sm text-zinc-500">{data.timestamp}</p>
        </>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  )
}
