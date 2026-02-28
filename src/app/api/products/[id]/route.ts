import { NextRequest, NextResponse } from 'next/server'

// Types
interface ProductImage {
  id: string
  url: string
  isPrimary: boolean
}

interface ProductVariant {
  id: string
  size?: string
  color?: string
  price: number
  stock: number
  sku: string
}

interface Product {
  id: string
  name: string
  slug: string
  description: string
  price: number
  comparePrice: number | null
  costPrice: number | null
  sku: string
  barcode: string | null
  quantity: number
  categoryId: string
  categoryName: string
  brandId: string | null
  brandName: string | null
  images: ProductImage[]
  variants: ProductVariant[]
  tags: string[]
  weight: number | null
  dimensions: string | null
  material: string | null
  color: string | null
  size: string | null
  gender: string | null
  ageGroup: string | null
  isFeatured: boolean
  isPublished: boolean
  isDigital: boolean
  downloadLink: string | null
  views: number
  soldCount: number
  rating: number
  reviewCount: number
  createdAt: string
  updatedAt: string
}

interface ProductResponse {
  success: boolean
  message: string
  data?: Product
  error?: string
  errors?: Record<string, string>
}

// Mock products database
let products: Product[] = [
  {
    id: '1',
    name: 'Nike Mercurial Superfly 9',
    slug: 'nike-mercurial-superfly-9',
    description: 'Elite football boots for speed and precision. The Nike Mercurial Superfly 9 delivers enhanced traction and control for explosive speed.',
    price: 24999,
    comparePrice: 29999,
    costPrice: 18000,
    sku: 'NK-FB-001',
    barcode: '1234567890123',
    quantity: 50,
    categoryId: '2',
    categoryName: 'Football',
    brandId: '1',
    brandName: 'Nike',
    images: [
      { id: 'img1', url: '/images/n1.jpeg', isPrimary: true },
      { id: 'img2', url: '/images/n2.jpeg', isPrimary: false }
    ],
    variants: [
      { id: 'var1', size: 'UK 7', color: 'Black/Red', price: 24999, stock: 10, sku: 'NK-FB-001-7' },
      { id: 'var2', size: 'UK 8', color: 'Black/Red', price: 24999, stock: 15, sku: 'NK-FB-001-8' },
      { id: 'var3', size: 'UK 9', color: 'Black/Red', price: 24999, stock: 8, sku: 'NK-FB-001-9' }
    ],
    tags: ['football', 'boots', 'nike', 'mercurial'],
    weight: 0.22,
    dimensions: '30x20x15 cm',
    material: 'Synthetic',
    color: 'Black/Red',
    size: 'UK 7-12',
    gender: 'MALE',
    ageGroup: 'ADULT',
    isFeatured: true,
    isPublished: true,
    isDigital: false,
    downloadLink: null,
    views: 15420,
    soldCount: 325,
    rating: 4.5,
    reviewCount: 128,
    createdAt: '2024-01-15T10:30:00Z',
    updatedAt: '2024-03-10T14:20:00Z'
  },
  {
    id: '2',
    name: 'Adidas Predator Edge',
    slug: 'adidas-predator-edge',
    description: 'Professional football boots with striking control. The Predator Edge features innovative technology for precise ball control.',
    price: 22999,
    comparePrice: 25999,
    costPrice: 16500,
    sku: 'AD-FB-002',
    barcode: '1234567890124',
    quantity: 35,
    categoryId: '2',
    categoryName: 'Football',
    brandId: '2',
    brandName: 'Adidas',
    images: [
      { id: 'img3', url: '/images/n2.jpeg', isPrimary: true }
    ],
    variants: [],
    tags: ['football', 'boots', 'adidas', 'predator'],
    weight: 0.23,
    dimensions: '29x19x14 cm',
    material: 'Leather',
    color: 'White/Blue',
    size: 'UK 6-11',
    gender: 'MALE',
    ageGroup: 'ADULT',
    isFeatured: true,
    isPublished: true,
    isDigital: false,
    downloadLink: null,
    views: 8750,
    soldCount: 187,
    rating: 4.3,
    reviewCount: 76,
    createdAt: '2024-01-20T09:15:00Z',
    updatedAt: '2024-03-05T11:30:00Z'
  },
  {
    id: '3',
    name: 'SG Test Cricket Bat',
    slug: 'sg-test-cricket-bat',
    description: 'English willow cricket bat for professional players. Hand-crafted for the perfect balance and pickup.',
    price: 15999,
    comparePrice: 18999,
    costPrice: 11000,
    sku: 'SG-CR-001',
    barcode: '1234567890125',
    quantity: 20,
    categoryId: '3',
    categoryName: 'Cricket',
    brandId: '4',
    brandName: 'SG',
    images: [
      { id: 'img4', url: '/images/n3.jpeg', isPrimary: true }
    ],
    variants: [
      { id: 'var4', size: 'Short Handle', color: 'Natural', price: 15999, stock: 8, sku: 'SG-CR-001-SH' },
      { id: 'var5', size: 'Long Handle', color: 'Natural', price: 16999, stock: 5, sku: 'SG-CR-001-LH' }
    ],
    tags: ['cricket', 'bat', 'sg', 'willow'],
    weight: 1.2,
    dimensions: '85x11x4 cm',
    material: 'English Willow',
    color: 'Natural',
    size: 'Short/Long Handle',
    gender: 'MALE',
    ageGroup: 'ADULT',
    isFeatured: true,
    isPublished: true,
    isDigital: false,
    downloadLink: null,
    views: 6230,
    soldCount: 143,
    rating: 4.8,
    reviewCount: 92,
    createdAt: '2024-01-25T14:45:00Z',
    updatedAt: '2024-03-08T16:20:00Z'
  }
]

// Helper: Generate slug from name
const generateSlug = (name: string): string => {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
}

// Helper: Check if slug exists (excluding current product)
const slugExists = (slug: string, excludeId?: string): boolean => {
  return products.some(p => p.slug === slug && p.id !== excludeId)
}

// Helper: Check if SKU exists (excluding current product)
const skuExists = (sku: string, excludeId?: string): boolean => {
  return products.some(p => p.sku === sku && p.id !== excludeId)
}

// Helper: Authenticate user
const authenticateUser = (request: NextRequest): { id: string; role: string } | null => {
  const userInfo = request.cookies.get('user_info')?.value
  if (userInfo) {
    try {
      const user = JSON.parse(userInfo)
      return { id: user.id, role: user.role }
    } catch {
      return null
    }
  }
  return null
}

// Helper: Check if user is admin
const isAdmin = (user: { role: string } | null): boolean => {
  if (!user) return false
  return ['SUPER_ADMIN', 'ADMIN', 'MANAGER'].includes(user.role)
}

// Helper: Validate product data
const validateProduct = (data: any, isUpdate: boolean = false, productId?: string): Record<string, string> => {
  const errors: Record<string, string> = {}

  if (!isUpdate || data.name !== undefined) {
    if (!data.name?.trim()) {
      errors.name = 'Product name is required'
    } else if (data.name.length < 3) {
      errors.name = 'Product name must be at least 3 characters'
    } else if (data.name.length > 100) {
      errors.name = 'Product name must be less than 100 characters'
    }
  }

  if (!isUpdate || data.slug !== undefined) {
    if (!data.slug?.trim()) {
      errors.slug = 'Slug is required'
    } else if (!/^[a-z0-9-]+$/.test(data.slug)) {
      errors.slug = 'Slug can only contain lowercase letters, numbers, and hyphens'
    } else if (slugExists(data.slug, productId)) {
      errors.slug = 'Slug already exists'
    }
  }

  if (!isUpdate || data.description !== undefined) {
    if (!data.description?.trim()) {
      errors.description = 'Description is required'
    } else if (data.description.length < 20) {
      errors.description = 'Description must be at least 20 characters'
    } else if (data.description.length > 2000) {
      errors.description = 'Description must be less than 2000 characters'
    }
  }

  if (!isUpdate || data.price !== undefined) {
    if (!data.price) {
      errors.price = 'Price is required'
    } else if (data.price <= 0) {
      errors.price = 'Price must be greater than 0'
    } else if (data.price > 1000000) {
      errors.price = 'Price cannot exceed ₹10,00,000'
    }
  }

  if (!isUpdate || data.sku !== undefined) {
    if (!data.sku?.trim()) {
      errors.sku = 'SKU is required'
    } else if (skuExists(data.sku, productId)) {
      errors.sku = 'SKU already exists'
    }
  }

  if (!isUpdate || data.quantity !== undefined) {
    if (data.quantity < 0) {
      errors.quantity = 'Quantity cannot be negative'
    } else if (data.quantity > 10000) {
      errors.quantity = 'Quantity cannot exceed 10,000'
    }
  }

  if (data.weight && (data.weight < 0 || data.weight > 1000)) {
    errors.weight = 'Weight must be between 0 and 1000 kg'
  }

  return errors
}

// ============================================
// FIXED: GET /api/products/[id] - Get single product
// ============================================
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }  // 👈 FIXED: Added Promise
) {
  try {
    const { id } = await params  // 👈 FIXED: Added await

    // Find product by ID or slug
    const product = products.find(p => p.id === id || p.slug === id)

    if (!product) {
      return NextResponse.json<ProductResponse>(
        {
          success: false,
          message: 'Product not found',
          error: 'NOT_FOUND'
        },
        { status: 404 }
      )
    }

    // Increment view count (only for published products)
    if (product.isPublished) {
      product.views += 1
      product.updatedAt = new Date().toISOString()
    }

    return NextResponse.json<ProductResponse>(
      {
        success: true,
        message: 'Product retrieved successfully',
        data: product
      },
      { status: 200 }
    )

  } catch (error) {
    console.error('Error retrieving product:', error)
    return NextResponse.json<ProductResponse>(
      {
        success: false,
        message: 'Failed to retrieve product',
        error: 'SERVER_ERROR'
      },
      { status: 500 }
    )
  }
}

// ============================================
// FIXED: PUT /api/products/[id] - Update product
// ============================================
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }  // 👈 FIXED: Added Promise
) {
  try {
    // Check authorization
    const user = authenticateUser(request)
    if (!isAdmin(user)) {
      return NextResponse.json<ProductResponse>(
        {
          success: false,
          message: 'Unauthorized',
          error: 'UNAUTHORIZED'
        },
        { status: 401 }
      )
    }

    const { id } = await params  // 👈 FIXED: Added await
    const productIndex = products.findIndex(p => p.id === id)

    if (productIndex === -1) {
      return NextResponse.json<ProductResponse>(
        {
          success: false,
          message: 'Product not found',
          error: 'NOT_FOUND'
        },
        { status: 404 }
      )
    }

    const body = await request.json()
    const existingProduct = products[productIndex]

    // Auto-generate slug if name changed
    let slug = body.slug
    if (body.name && body.name !== existingProduct.name) {
      slug = generateSlug(body.name)
    }

    // Validate input
    const errors = validateProduct(
      { 
        ...body,
        slug: slug || existingProduct.slug
      },
      true,
      id
    )

    if (Object.keys(errors).length > 0) {
      return NextResponse.json<ProductResponse>(
        {
          success: false,
          message: 'Validation failed',
          errors
        },
        { status: 400 }
      )
    }

    // Update product
    const updatedProduct: Product = {
      ...existingProduct,
      name: body.name?.trim() || existingProduct.name,
      slug: slug || existingProduct.slug,
      description: body.description?.trim() || existingProduct.description,
      price: body.price !== undefined ? body.price : existingProduct.price,
      comparePrice: body.comparePrice !== undefined ? body.comparePrice : existingProduct.comparePrice,
      costPrice: body.costPrice !== undefined ? body.costPrice : existingProduct.costPrice,
      sku: body.sku?.trim() || existingProduct.sku,
      barcode: body.barcode !== undefined ? body.barcode : existingProduct.barcode,
      quantity: body.quantity !== undefined ? body.quantity : existingProduct.quantity,
      categoryId: body.categoryId || existingProduct.categoryId,
      categoryName: body.categoryName || existingProduct.categoryName,
      brandId: body.brandId !== undefined ? body.brandId : existingProduct.brandId,
      brandName: body.brandName !== undefined ? body.brandName : existingProduct.brandName,
      tags: body.tags || existingProduct.tags,
      weight: body.weight !== undefined ? body.weight : existingProduct.weight,
      dimensions: body.dimensions !== undefined ? body.dimensions : existingProduct.dimensions,
      material: body.material !== undefined ? body.material : existingProduct.material,
      color: body.color !== undefined ? body.color : existingProduct.color,
      size: body.size !== undefined ? body.size : existingProduct.size,
      gender: body.gender || existingProduct.gender,
      ageGroup: body.ageGroup || existingProduct.ageGroup,
      isFeatured: body.isFeatured !== undefined ? body.isFeatured : existingProduct.isFeatured,
      isPublished: body.isPublished !== undefined ? body.isPublished : existingProduct.isPublished,
      isDigital: body.isDigital !== undefined ? body.isDigital : existingProduct.isDigital,
      downloadLink: body.downloadLink !== undefined ? body.downloadLink : existingProduct.downloadLink,
      updatedAt: new Date().toISOString()
    }

    products[productIndex] = updatedProduct

    return NextResponse.json<ProductResponse>(
      {
        success: true,
        message: 'Product updated successfully',
        data: updatedProduct
      },
      { status: 200 }
    )

  } catch (error) {
    console.error('Error updating product:', error)
    return NextResponse.json<ProductResponse>(
      {
        success: false,
        message: 'Failed to update product',
        error: 'SERVER_ERROR'
      },
      { status: 500 }
    )
  }
}

// ============================================
// FIXED: DELETE /api/products/[id] - Delete product
// ============================================
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }  // 👈 FIXED: Added Promise
) {
  try {
    // Check authorization
    const user = authenticateUser(request)
    if (!isAdmin(user)) {
      return NextResponse.json<ProductResponse>(
        {
          success: false,
          message: 'Unauthorized',
          error: 'UNAUTHORIZED'
        },
        { status: 401 }
      )
    }

    const { id } = await params  // 👈 FIXED: Added await
    const productIndex = products.findIndex(p => p.id === id)

    if (productIndex === -1) {
      return NextResponse.json<ProductResponse>(
        {
          success: false,
          message: 'Product not found',
          error: 'NOT_FOUND'
        },
        { status: 404 }
      )
    }

    const product = products[productIndex]

    // Check if product has orders (mock check)
    if (product.soldCount > 0) {
      return NextResponse.json<ProductResponse>(
        {
          success: false,
          message: 'Cannot delete product with existing orders',
          error: 'HAS_ORDERS'
        },
        { status: 400 }
      )
    }

    // Remove product
    products.splice(productIndex, 1)

    return NextResponse.json<ProductResponse>(
      {
        success: true,
        message: 'Product deleted successfully'
      },
      { status: 200 }
    )

  } catch (error) {
    console.error('Error deleting product:', error)
    return NextResponse.json<ProductResponse>(
      {
        success: false,
        message: 'Failed to delete product',
        error: 'SERVER_ERROR'
      },
      { status: 500 }
    )
  }
}

// ============================================
// FIXED: PATCH /api/products/[id] - Partially update product
// ============================================
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }  // 👈 FIXED: Added Promise
) {
  try {
    // Check authorization
    const user = authenticateUser(request)
    if (!isAdmin(user)) {
      return NextResponse.json<ProductResponse>(
        {
          success: false,
          message: 'Unauthorized',
          error: 'UNAUTHORIZED'
        },
        { status: 401 }
      )
    }

    const { id } = await params  // 👈 FIXED: Added await
    const productIndex = products.findIndex(p => p.id === id)

    if (productIndex === -1) {
      return NextResponse.json<ProductResponse>(
        {
          success: false,
          message: 'Product not found',
          error: 'NOT_FOUND'
        },
        { status: 404 }
      )
    }

    const body = await request.json()
    const existingProduct = products[productIndex]

    // Handle specific actions
    if (body.action) {
      switch (body.action) {
        case 'publish':
          existingProduct.isPublished = true
          break
        case 'unpublish':
          existingProduct.isPublished = false
          break
        case 'feature':
          existingProduct.isFeatured = true
          break
        case 'unfeature':
          existingProduct.isFeatured = false
          break
        case 'increment-views':
          existingProduct.views += 1
          break
        case 'update-stock':
          if (body.quantity !== undefined) {
            existingProduct.quantity = body.quantity
          }
          if (body.soldCount !== undefined) {
            existingProduct.soldCount = body.soldCount
          }
          break
        default:
          return NextResponse.json<ProductResponse>(
            {
              success: false,
              message: 'Invalid action',
              error: 'INVALID_ACTION'
            },
            { status: 400 }
          )
      }

      existingProduct.updatedAt = new Date().toISOString()

      return NextResponse.json<ProductResponse>(
        {
          success: true,
          message: 'Product updated successfully',
          data: existingProduct
        },
        { status: 200 }
      )
    }

    // Partial update of fields
    const allowedUpdates = [
      'name', 'description', 'price', 'comparePrice', 'quantity',
      'isFeatured', 'isPublished', 'tags', 'weight', 'dimensions',
      'material', 'color', 'size', 'gender', 'ageGroup'
    ]

    allowedUpdates.forEach(field => {
      if (body[field] !== undefined) {
        (existingProduct as any)[field] = body[field]
      }
    })

    // Auto-update slug if name changed
    if (body.name && body.name !== existingProduct.name) {
      existingProduct.slug = generateSlug(body.name)
    }

    existingProduct.updatedAt = new Date().toISOString()

    return NextResponse.json<ProductResponse>(
      {
        success: true,
        message: 'Product updated successfully',
        data: existingProduct
      },
      { status: 200 }
    )

  } catch (error) {
    console.error('Error updating product:', error)
    return NextResponse.json<ProductResponse>(
      {
        success: false,
        message: 'Failed to update product',
        error: 'SERVER_ERROR'
      },
      { status: 500 }
    )
  }
}