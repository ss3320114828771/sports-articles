import { NextRequest, NextResponse } from 'next/server'

// Types
interface Category {
  id: string
  name: string
  slug: string
  description: string
  image: string
  parentId: string | null
  parentName?: string
  productCount: number
  isActive: boolean
  order: number
  createdAt: string
  updatedAt: string
}

interface CategoryResponse {
  success: boolean
  message: string
  data?: Category | Category[]
  error?: string
  errors?: Record<string, string>
}

// Mock categories database (in production, use real database)
let categories: Category[] = [
  {
    id: '1',
    name: 'Sports Equipment',
    slug: 'sports-equipment',
    description: 'All types of sports equipment',
    image: '/images/categories/sports-equipment.jpg',
    parentId: null,
    productCount: 156,
    isActive: true,
    order: 1,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  },
  {
    id: '2',
    name: 'Football',
    slug: 'football',
    description: 'Football boots, balls, and accessories',
    image: '/images/categories/football.jpg',
    parentId: '1',
    parentName: 'Sports Equipment',
    productCount: 45,
    isActive: true,
    order: 1,
    createdAt: '2024-01-02T00:00:00Z',
    updatedAt: '2024-01-02T00:00:00Z'
  },
  {
    id: '3',
    name: 'Cricket',
    slug: 'cricket',
    description: 'Cricket bats, balls, and protective gear',
    image: '/images/categories/cricket.jpg',
    parentId: '1',
    parentName: 'Sports Equipment',
    productCount: 38,
    isActive: true,
    order: 2,
    createdAt: '2024-01-03T00:00:00Z',
    updatedAt: '2024-01-03T00:00:00Z'
  },
  {
    id: '4',
    name: 'Basketball',
    slug: 'basketball',
    description: 'Basketball shoes, jerseys, and equipment',
    image: '/images/categories/basketball.jpg',
    parentId: '1',
    parentName: 'Sports Equipment',
    productCount: 32,
    isActive: true,
    order: 3,
    createdAt: '2024-01-04T00:00:00Z',
    updatedAt: '2024-01-04T00:00:00Z'
  },
  {
    id: '5',
    name: 'Tennis',
    slug: 'tennis',
    description: 'Tennis rackets, balls, and accessories',
    image: '/images/categories/tennis.jpg',
    parentId: '1',
    parentName: 'Sports Equipment',
    productCount: 28,
    isActive: false,
    order: 4,
    createdAt: '2024-01-05T00:00:00Z',
    updatedAt: '2024-01-05T00:00:00Z'
  },
  {
    id: '6',
    name: 'Swimming',
    slug: 'swimming',
    description: 'Swimwear, goggles, and training equipment',
    image: '/images/categories/swimming.jpg',
    parentId: null,
    productCount: 25,
    isActive: true,
    order: 5,
    createdAt: '2024-01-06T00:00:00Z',
    updatedAt: '2024-01-06T00:00:00Z'
  },
  {
    id: '7',
    name: 'Boxing',
    slug: 'boxing',
    description: 'Boxing gloves, punch bags, and protective gear',
    image: '/images/categories/boxing.jpg',
    parentId: null,
    productCount: 22,
    isActive: true,
    order: 6,
    createdAt: '2024-01-07T00:00:00Z',
    updatedAt: '2024-01-07T00:00:00Z'
  }
]

// Helper: Generate slug from name
const generateSlug = (name: string): string => {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
}

// Helper: Check if slug exists
const slugExists = (slug: string, excludeId?: string): boolean => {
  return categories.some(c => c.slug === slug && c.id !== excludeId)
}

// Helper: Get parent category name
const getParentName = (parentId: string | null): string | undefined => {
  if (!parentId) return undefined
  const parent = categories.find(c => c.id === parentId)
  return parent?.name
}

// Helper: Validate category data
const validateCategory = (data: any, isUpdate: boolean = false): Record<string, string> => {
  const errors: Record<string, string> = {}

  if (!isUpdate || data.name !== undefined) {
    if (!data.name?.trim()) {
      errors.name = 'Category name is required'
    } else if (data.name.length < 2) {
      errors.name = 'Category name must be at least 2 characters'
    } else if (data.name.length > 50) {
      errors.name = 'Category name must be less than 50 characters'
    }
  }

  if (!isUpdate || data.slug !== undefined) {
    if (!data.slug?.trim()) {
      errors.slug = 'Slug is required'
    } else if (!/^[a-z0-9-]+$/.test(data.slug)) {
      errors.slug = 'Slug can only contain lowercase letters, numbers, and hyphens'
    }
  }

  if (!isUpdate || data.description !== undefined) {
    if (!data.description?.trim()) {
      errors.description = 'Description is required'
    } else if (data.description.length < 10) {
      errors.description = 'Description must be at least 10 characters'
    } else if (data.description.length > 500) {
      errors.description = 'Description must be less than 500 characters'
    }
  }

  if (data.parentId && !categories.some(c => c.id === data.parentId)) {
    errors.parentId = 'Parent category does not exist'
  }

  if (data.order !== undefined && (data.order < 0 || data.order > 999)) {
    errors.order = 'Order must be between 0 and 999'
  }

  return errors
}

// Helper: Check admin authorization (mock)
const isAdmin = (request: NextRequest): boolean => {
  const userInfo = request.cookies.get('user_info')?.value
  if (userInfo) {
    try {
      const user = JSON.parse(userInfo)
      return ['SUPER_ADMIN', 'ADMIN', 'MANAGER'].includes(user.role)
    } catch {
      return false
    }
  }
  return false
}

// GET /api/categories - Get all categories or single category
export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url)
    const id = url.searchParams.get('id')
    const slug = url.searchParams.get('slug')
    const parentId = url.searchParams.get('parentId')
    const includeInactive = url.searchParams.get('includeInactive') === 'true'
    const limit = url.searchParams.get('limit') ? parseInt(url.searchParams.get('limit')!) : undefined

    // Filter categories
    let filteredCategories = [...categories]

    // Filter by active status
    if (!includeInactive) {
      filteredCategories = filteredCategories.filter(c => c.isActive)
    }

    // Get single category by ID
    if (id) {
      const category = filteredCategories.find(c => c.id === id)
      if (!category) {
        return NextResponse.json<CategoryResponse>(
          {
            success: false,
            message: 'Category not found',
            error: 'NOT_FOUND'
          },
          { status: 404 }
        )
      }
      return NextResponse.json<CategoryResponse>(
        {
          success: true,
          message: 'Category retrieved successfully',
          data: category
        },
        { status: 200 }
      )
    }

    // Get single category by slug
    if (slug) {
      const category = filteredCategories.find(c => c.slug === slug)
      if (!category) {
        return NextResponse.json<CategoryResponse>(
          {
            success: false,
            message: 'Category not found',
            error: 'NOT_FOUND'
          },
          { status: 404 }
        )
      }
      return NextResponse.json<CategoryResponse>(
        {
          success: true,
          message: 'Category retrieved successfully',
          data: category
        },
        { status: 200 }
      )
    }

    // Filter by parent
    if (parentId !== null) {
      filteredCategories = filteredCategories.filter(c => c.parentId === parentId)
    }

    // Apply limit
    if (limit && limit > 0) {
      filteredCategories = filteredCategories.slice(0, limit)
    }

    // Sort by order
    filteredCategories.sort((a, b) => a.order - b.order)

    return NextResponse.json<CategoryResponse>(
      {
        success: true,
        message: 'Categories retrieved successfully',
        data: filteredCategories
      },
      { status: 200 }
    )

  } catch (error) {
    console.error('Error retrieving categories:', error)
    return NextResponse.json<CategoryResponse>(
      {
        success: false,
        message: 'Failed to retrieve categories',
        error: 'SERVER_ERROR'
      },
      { status: 500 }
    )
  }
}

// POST /api/categories - Create new category
export async function POST(request: NextRequest) {
  try {
    // Check authorization
    if (!isAdmin(request)) {
      return NextResponse.json<CategoryResponse>(
        {
          success: false,
          message: 'Unauthorized',
          error: 'UNAUTHORIZED'
        },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { name, description, image, parentId, order, isActive } = body

    // Auto-generate slug from name
    const slug = generateSlug(name || '')

    // Validate input
    const errors = validateCategory({ name, slug, description, parentId, order })
    if (Object.keys(errors).length > 0) {
      return NextResponse.json<CategoryResponse>(
        {
          success: false,
          message: 'Validation failed',
          errors
        },
        { status: 400 }
      )
    }

    // Check if slug already exists
    if (slugExists(slug)) {
      return NextResponse.json<CategoryResponse>(
        {
          success: false,
          message: 'Slug already exists',
          error: 'DUPLICATE_SLUG'
        },
        { status: 400 }
      )
    }

    // Create new category
    const newCategory: Category = {
      id: (categories.length + 1).toString(),
      name: name.trim(),
      slug,
      description: description.trim(),
      image: image || '/images/categories/placeholder.jpg',
      parentId: parentId || null,
      parentName: getParentName(parentId),
      productCount: 0,
      isActive: isActive !== undefined ? isActive : true,
      order: order || 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }

    categories.push(newCategory)

    return NextResponse.json<CategoryResponse>(
      {
        success: true,
        message: 'Category created successfully',
        data: newCategory
      },
      { status: 201 }
    )

  } catch (error) {
    console.error('Error creating category:', error)
    return NextResponse.json<CategoryResponse>(
      {
        success: false,
        message: 'Failed to create category',
        error: 'SERVER_ERROR'
      },
      { status: 500 }
    )
  }
}

// PUT /api/categories - Update category
export async function PUT(request: NextRequest) {
  try {
    // Check authorization
    if (!isAdmin(request)) {
      return NextResponse.json<CategoryResponse>(
        {
          success: false,
          message: 'Unauthorized',
          error: 'UNAUTHORIZED'
        },
        { status: 401 }
      )
    }

    const url = new URL(request.url)
    const id = url.searchParams.get('id')

    if (!id) {
      return NextResponse.json<CategoryResponse>(
        {
          success: false,
          message: 'Category ID is required',
          error: 'MISSING_ID'
        },
        { status: 400 }
      )
    }

    const body = await request.json()
    const categoryIndex = categories.findIndex(c => c.id === id)

    if (categoryIndex === -1) {
      return NextResponse.json<CategoryResponse>(
        {
          success: false,
          message: 'Category not found',
          error: 'NOT_FOUND'
        },
        { status: 404 }
      )
    }

    const existingCategory = categories[categoryIndex]

    // Auto-generate slug if name changed
    let slug = body.slug
    if (body.name && body.name !== existingCategory.name) {
      slug = generateSlug(body.name)
    }

    // Validate input
    const errors = validateCategory(
      { 
        name: body.name || existingCategory.name,
        slug: slug || existingCategory.slug,
        description: body.description || existingCategory.description,
        parentId: body.parentId !== undefined ? body.parentId : existingCategory.parentId,
        order: body.order !== undefined ? body.order : existingCategory.order
      },
      true
    )

    if (Object.keys(errors).length > 0) {
      return NextResponse.json<CategoryResponse>(
        {
          success: false,
          message: 'Validation failed',
          errors
        },
        { status: 400 }
      )
    }

    // Check if new slug already exists (excluding current category)
    if (slug && slug !== existingCategory.slug && slugExists(slug, id)) {
      return NextResponse.json<CategoryResponse>(
        {
          success: false,
          message: 'Slug already exists',
          error: 'DUPLICATE_SLUG'
        },
        { status: 400 }
      )
    }

    // Prevent circular parent relationship
    if (body.parentId === id) {
      return NextResponse.json<CategoryResponse>(
        {
          success: false,
          message: 'Category cannot be its own parent',
          error: 'INVALID_PARENT'
        },
        { status: 400 }
      )
    }

    // Update category
    const updatedCategory: Category = {
      ...existingCategory,
      name: body.name?.trim() || existingCategory.name,
      slug: slug || existingCategory.slug,
      description: body.description?.trim() || existingCategory.description,
      image: body.image !== undefined ? body.image : existingCategory.image,
      parentId: body.parentId !== undefined ? body.parentId : existingCategory.parentId,
      parentName: body.parentId !== undefined ? getParentName(body.parentId) : existingCategory.parentName,
      isActive: body.isActive !== undefined ? body.isActive : existingCategory.isActive,
      order: body.order !== undefined ? body.order : existingCategory.order,
      updatedAt: new Date().toISOString()
    }

    categories[categoryIndex] = updatedCategory

    return NextResponse.json<CategoryResponse>(
      {
        success: true,
        message: 'Category updated successfully',
        data: updatedCategory
      },
      { status: 200 }
    )

  } catch (error) {
    console.error('Error updating category:', error)
    return NextResponse.json<CategoryResponse>(
      {
        success: false,
        message: 'Failed to update category',
        error: 'SERVER_ERROR'
      },
      { status: 500 }
    )
  }
}

// DELETE /api/categories - Delete category
export async function DELETE(request: NextRequest) {
  try {
    // Check authorization
    if (!isAdmin(request)) {
      return NextResponse.json<CategoryResponse>(
        {
          success: false,
          message: 'Unauthorized',
          error: 'UNAUTHORIZED'
        },
        { status: 401 }
      )
    }

    const url = new URL(request.url)
    const id = url.searchParams.get('id')
    const force = url.searchParams.get('force') === 'true'

    if (!id) {
      return NextResponse.json<CategoryResponse>(
        {
          success: false,
          message: 'Category ID is required',
          error: 'MISSING_ID'
        },
        { status: 400 }
      )
    }

    const categoryIndex = categories.findIndex(c => c.id === id)

    if (categoryIndex === -1) {
      return NextResponse.json<CategoryResponse>(
        {
          success: false,
          message: 'Category not found',
          error: 'NOT_FOUND'
        },
        { status: 404 }
      )
    }

    const category = categories[categoryIndex]

    // Check if category has products
    if (category.productCount > 0 && !force) {
      return NextResponse.json<CategoryResponse>(
        {
          success: false,
          message: 'Category has products. Use force=true to delete anyway',
          error: 'HAS_PRODUCTS'
        },
        { status: 400 }
      )
    }

    // Check if category has subcategories
    const hasChildren = categories.some(c => c.parentId === id)
    if (hasChildren && !force) {
      return NextResponse.json<CategoryResponse>(
        {
          success: false,
          message: 'Category has subcategories. Use force=true to delete anyway',
          error: 'HAS_CHILDREN'
        },
        { status: 400 }
      )
    }

    // Remove category
    categories.splice(categoryIndex, 1)

    // If not force, update child categories to remove parent reference
    if (!force) {
      categories = categories.map(c => 
        c.parentId === id ? { ...c, parentId: null, parentName: undefined } : c
      )
    }

    return NextResponse.json<CategoryResponse>(
      {
        success: true,
        message: 'Category deleted successfully'
      },
      { status: 200 }
    )

  } catch (error) {
    console.error('Error deleting category:', error)
    return NextResponse.json<CategoryResponse>(
      {
        success: false,
        message: 'Failed to delete category',
        error: 'SERVER_ERROR'
      },
      { status: 500 }
    )
  }
}

// PATCH /api/categories - Bulk update (reorder, toggle status)
export async function PATCH(request: NextRequest) {
  try {
    // Check authorization
    if (!isAdmin(request)) {
      return NextResponse.json<CategoryResponse>(
        {
          success: false,
          message: 'Unauthorized',
          error: 'UNAUTHORIZED'
        },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { action, items } = body

    if (!action || !items || !Array.isArray(items)) {
      return NextResponse.json<CategoryResponse>(
        {
          success: false,
          message: 'Invalid request format',
          error: 'INVALID_REQUEST'
        },
        { status: 400 }
      )
    }

    switch (action) {
      case 'reorder':
        // Update order for multiple categories
        items.forEach((item: { id: string; order: number }) => {
          const category = categories.find(c => c.id === item.id)
          if (category) {
            category.order = item.order
            category.updatedAt = new Date().toISOString()
          }
        })
        break

      case 'toggle-status':
        // Toggle active status for multiple categories
        items.forEach((item: { id: string; isActive: boolean }) => {
          const category = categories.find(c => c.id === item.id)
          if (category) {
            category.isActive = item.isActive
            category.updatedAt = new Date().toISOString()
          }
        })
        break

      default:
        return NextResponse.json<CategoryResponse>(
          {
            success: false,
            message: 'Invalid action',
            error: 'INVALID_ACTION'
          },
          { status: 400 }
        )
    }

    return NextResponse.json<CategoryResponse>(
      {
        success: true,
        message: 'Categories updated successfully',
        data: categories
      },
      { status: 200 }
    )

  } catch (error) {
    console.error('Error updating categories:', error)
    return NextResponse.json<CategoryResponse>(
      {
        success: false,
        message: 'Failed to update categories',
        error: 'SERVER_ERROR'
      },
      { status: 500 }
    )
  }
}