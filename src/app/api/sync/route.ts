import { put, head, list } from '@vercel/blob'
import { NextRequest, NextResponse } from 'next/server'

const BLOB_NAME = 'crm-data.json'

// GET — load CRM data from Vercel Blob
export async function GET() {
  try {
    // Find the blob by listing with prefix
    const { blobs } = await list({ prefix: BLOB_NAME })
    if (blobs.length === 0) {
      return NextResponse.json({ exists: false })
    }
    const blob = blobs[0]
    const res = await fetch(blob.url)
    const data = await res.json()
    return NextResponse.json({ exists: true, data, updatedAt: blob.uploadedAt })
  } catch (error) {
    console.error('Sync GET error:', error)
    return NextResponse.json({ exists: false, error: 'Failed to load' }, { status: 500 })
  }
}

// POST — save CRM data to Vercel Blob
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const blob = await put(BLOB_NAME, JSON.stringify(body), {
      access: 'public',
      addRandomSuffix: false,
    })
    return NextResponse.json({ success: true, url: blob.url, updatedAt: new Date().toISOString() })
  } catch (error) {
    console.error('Sync POST error:', error)
    return NextResponse.json({ success: false, error: 'Failed to save' }, { status: 500 })
  }
}
