import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { body, validationResult } from 'express-validator';
import { User } from '../models/User';
import { AuthRequest, UserRole } from '../types';

const signToken = (id: string, role: UserRole): string =>
  jwt.sign({ id, role }, process.env.JWT_SECRET as string, {
    expiresIn: (process.env.JWT_EXPIRES_IN ?? '7d') as string,
  } as jwt.SignOptions);

export const registerValidation = [
  body('name').trim().notEmpty().withMessage('Name is required'),
  body('email').isEmail().withMessage('Valid email required'),
  body('password').isLength({ min: 6 }).withMessage('Password min 6 chars'),
  body('role').optional().isIn(['admin', 'sales']).withMessage('Invalid role'),
];

export const loginValidation = [
  body('email').isEmail().withMessage('Valid email required'),
  body('password').notEmpty().withMessage('Password required'),
];

export const register = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ success: false, message: errors.array()[0].msg });
      return;
    }

    const { name, email, password, role } = req.body as {
      name: string;
      email: string;
      password: string;
      role?: UserRole;
    };

    const existing = await User.findOne({ email });
    if (existing) {
      res.status(409).json({ success: false, message: 'Email already registered' });
      return;
    }

    const user = await User.create({ name, email, password, role: role ?? 'sales' });
    const token = signToken(user._id.toString(), user.role);

    res.status(201).json({ success: true, data: { token, user } });
  } catch (err) {
    next(err);
  }
};

export const login = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ success: false, message: errors.array()[0].msg });
      return;
    }

    const { email, password } = req.body as { email: string; password: string };

    const user = await User.findOne({ email }).select('+password');
    if (!user || !(await user.comparePassword(password))) {
      res.status(401).json({ success: false, message: 'Invalid credentials' });
      return;
    }

    const token = signToken(user._id.toString(), user.role);
    res.json({ success: true, data: { token, user } });
  } catch (err) {
    next(err);
  }
};

export const getMe = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const user = await User.findById(req.user!.id);
    res.json({ success: true, data: user });
  } catch (err) {
    next(err);
  }
};
