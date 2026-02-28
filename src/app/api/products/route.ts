import { NextRequest, NextResponse } from 'next/server'

// Simple Product Type
interface Product {
  id: string
  name: string
  slug: string
  description: string
  price: number
  sku: string
  quantity: number
  categoryId: string
  categoryName: string
  isPublished: boolean
  createdAt: string
  updatedAt: string
}

// Mock database
let products = [
  {
    id: '1',
    name: 'Nike Mercurial Superfly 9',
    slug: 'nike-mercurial-superfly-9',
    description: 'Elite football boots for speed and precision.',
    price: 24999,
    sku: 'NK-FB-001',
    quantity: 50,
    categoryId: '2',
    categoryName: 'Football',
    isPublished: true,
    createdAt: '2024-01-15T10:30:00Z',
    updatedAt: '2024-03-10T14:20:00Z'
  },
  {
    id: '2',
    name: 'Adidas Predator Edge',
    slug: 'adidas-predator-edge',
    description: 'Professional football boots with striking control.',
    price: 22999,
    sku: 'AD-FB-002',
    quantity: 35,
    categoryId: '2',
    categoryName: 'Football',
    isPublished: true,
    createdAt: '2024-01-20T09:15:00Z',
    updatedAt: '2024-03-05T11:30:00Z'
  },
  {
    id: '3',
    name: 'SG Test Cricket Bat',
    slug: 'sg-test-cricket-bat',
    description: 'English willow cricket bat for professional players.',
    price: 15999,
    sku: 'SG-CR-001',
    quantity: 20,
    categoryId: '3',
    categoryName: 'Cricket',
    isPublished: true,
    createdAt: '2024-01-25T14:45:00Z',
    updatedAt: '2024-03-08T16:20:00Z'
  }
]

// Helper functions
const generateSlug = (name: string) => {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
}

// GET /api/products
export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url)
    const page = parseInt(url.searchParams.get('page') || '1')
    const limit = parseInt(url.searchParams.get('limit') || '10')
    const search = url.searchParams.get('search') || ''

    // Simple filter
    let filtered = [...products]
    if (search) {
      filtered = filtered.filter(p => 
        p.name.toLowerCase().includes(search.toLowerCase())
      )
    }

    // Simple pagination
    const total = filtered.length
    const pages = Math.ceil(total / limit)
    const start = (page - 1) * limit
    const paginated = filtered.slice(start, start + limit)

    return NextResponse.json({
      success: true,
      message: 'Products retrieved',
      data: paginated,
      pagination: { total, page, limit, pages }
    })

  } catch (error) {
    return NextResponse.json(
      { success: false, message: 'Failed to get products' },
      { status: 500 }
    )
  }
}

// POST /api/products
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, description, price, sku, categoryId, categoryName } = body

    // Simple validation
    if (!name || !price || !sku) {
      return NextResponse.json(
        { success: false, message: 'Missing required fields' },
        { status: 400 }
      )
    }

    const newProduct = {
      id: String(products.length + 1),
      name,
      slug: generateSlug(name),
      description: description || '',
      price: Number(price),
      sku,
      quantity: body.quantity || 0,
      categoryId: categoryId || '',
      categoryName: categoryName || '',
      isPublished: body.isPublished || false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }

    products.push(newProduct)

    return NextResponse.json({
      success: true,
      message: 'Product created',
      data: newProduct
    }, { status: 201 })

  } catch (error) {
    return NextResponse.json(
      { success: false, message: 'Failed to create product' },
      { status: 500 }
    )
  }
}

// DELETE /api/products?ids=1,2,3
export async function DELETE(request: NextRequest) {
  try {
    const url = new URL(request.url)
    const idsParam = url.searchParams.get('ids')
    
    if (!idsParam) {
      return NextResponse.json(
        { success: false, message: 'No IDs provided' },
        { status: 400 }
      )
    }

    const ids = idsParam.split(',')
    const count = ids.length
    
    products = products.filter(p => !ids.includes(p.id))

    return NextResponse.json({
      success: true,
      message: count + ' product(s) deleted'
    })

  } catch (error) {
    return NextResponse.json(
      { success: false, message: 'Failed to delete products' },
      { status: 500 }
    )
  }
}

// PATCH /api/products
export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json()
    const { action, productIds, ...data } = body

    if (!action || !productIds || !Array.isArray(productIds)) {
      return NextResponse.json(
        { success: false, message: 'Invalid request' },
        { status: 400 }
      )
    }

    const count = productIds.length

    switch (action) {
      case 'publish':
        products = products.map(p => 
          productIds.includes(p.id) ? { ...p, isPublished: true, updatedAt: new Date().toISOString() } : p
        )
        break

      case 'unpublish':
        products = products.map(p => 
          productIds.includes(p.id) ? { ...p, isPublished: false, updatedAt: new Date().toISOString() } : p
        )
        break

      case 'update-price':
        if (!data.price) {
          return NextResponse.json(
            { success: false, message: 'Price required' },
            { status: 400 }
          )
        }
        products = products.map(p => 
          productIds.includes(p.id) ? { ...p, price: data.price, updatedAt: new Date().toISOString() } : p
        )
        break

      case 'update-stock':
        if (data.quantity === undefined) {
          return NextResponse.json(
            { success: false, message: 'Quantity required' },
            { status: 400 }
          )
        }
        products = products.map(p => 
          productIds.includes(p.id) ? { ...p, quantity: data.quantity, updatedAt: new Date().toISOString() } : p
        )
        break

      default:
        return NextResponse.json(
          { success: false, message: 'Invalid action' },
          { status: 400 }
        )
    }

    return NextResponse.json({
      success: true,
      message: count + ' product(s) updated'
    })

  } catch (error) {
    return NextResponse.json(
      { success: false, message: 'Failed to update products' },
      { status: 500 }
    )
  }
}