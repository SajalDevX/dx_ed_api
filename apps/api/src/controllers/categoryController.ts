import { Request, Response, NextFunction } from 'express';
import { Category } from '../models/Category.js';
import { ApiError } from '../utils/ApiError.js';

// Get all categories
export const getCategories = async (
  _req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const categories = await Category.find({ isActive: true, parent: null })
      .populate({
        path: 'subcategories',
        match: { isActive: true },
        select: 'name slug icon courseCount',
      })
      .sort({ order: 1 });

    res.json({
      success: true,
      data: { categories },
    });
  } catch (error) {
    next(error);
  }
};

// Get category by slug
export const getCategoryBySlug = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { slug } = req.params;

    const category = await Category.findOne({ slug, isActive: true }).populate({
      path: 'subcategories',
      match: { isActive: true },
    });

    if (!category) {
      throw ApiError.notFound('Category not found');
    }

    res.json({
      success: true,
      data: { category },
    });
  } catch (error) {
    next(error);
  }
};

// Create category (admin)
export const createCategory = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { name, description, icon, image, parent } = req.body;

    const category = await Category.create({
      name,
      description,
      icon,
      image,
      parent: parent || null,
    });

    res.status(201).json({
      success: true,
      data: { category },
    });
  } catch (error) {
    next(error);
  }
};

// Update category (admin)
export const updateCategory = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const category = await Category.findByIdAndUpdate(id, updates, {
      new: true,
      runValidators: true,
    });

    if (!category) {
      throw ApiError.notFound('Category not found');
    }

    res.json({
      success: true,
      data: { category },
    });
  } catch (error) {
    next(error);
  }
};

// Delete category (admin)
export const deleteCategory = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;

    // Check for subcategories
    const hasSubcategories = await Category.exists({ parent: id });
    if (hasSubcategories) {
      throw ApiError.badRequest('Cannot delete category with subcategories');
    }

    // Soft delete
    const category = await Category.findByIdAndUpdate(
      id,
      { isActive: false },
      { new: true }
    );

    if (!category) {
      throw ApiError.notFound('Category not found');
    }

    res.json({
      success: true,
      message: 'Category deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};
