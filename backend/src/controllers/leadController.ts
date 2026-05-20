import { Response, NextFunction } from 'express';
import { body, validationResult } from 'express-validator';
import { Lead } from '../models/Lead';
import { AuthRequest, LeadStatus, LeadSource, LeadQuery } from '../types';
import { leadsToCSV } from '../utils/csvExport';
import { FilterQuery } from 'mongoose';
import { ILead } from '../types';

export const leadValidation = [
  body('name').trim().notEmpty().withMessage('Name is required'),
  body('email').isEmail().withMessage('Valid email required'),
  body('status')
    .optional()
    .isIn(['New', 'Contacted', 'Qualified', 'Lost'])
    .withMessage('Invalid status'),
  body('source')
    .isIn(['Website', 'Instagram', 'Referral'])
    .withMessage('Invalid source'),
];

const buildQuery = (query: LeadQuery, userId: string, role: string): FilterQuery<ILead> => {
  const filter: FilterQuery<ILead> = {};

  if (role === 'sales') filter.createdBy = userId;
  if (query.status) filter.status = query.status;
  if (query.source) filter.source = query.source;
  if (query.search) {
    const regex = new RegExp(query.search, 'i');
    filter.$or = [{ name: regex }, { email: regex }];
  }

  return filter;
};

export const getLeads = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const queryParams = req.query as Record<string, string>;
    const { status, source, search, sort } = queryParams;
    const page = queryParams.page ?? '1';
    const limit = queryParams.limit ?? '10';
    const pageNum = Math.max(1, parseInt(page, 10));
    const limitNum = Math.min(50, Math.max(1, parseInt(limit, 10)));
    const skip = (pageNum - 1) * limitNum;

    const query: LeadQuery = { status: status as LeadStatus, source: source as LeadSource, search, sort: sort as 'latest' | 'oldest' };
    const filter = buildQuery(query, req.user!.id, req.user!.role);

    const sortOrder = sort === 'oldest' ? 1 : -1;

    const [leads, total] = await Promise.all([
      Lead.find(filter)
        .sort({ createdAt: sortOrder })
        .skip(skip)
        .limit(limitNum)
        .populate('createdBy', 'name email'),
      Lead.countDocuments(filter),
    ]);

    res.json({
      success: true,
      data: leads,
      pagination: {
        total,
        page: pageNum,
        limit: limitNum,
        totalPages: Math.ceil(total / limitNum),
      },
    });
  } catch (err) {
    next(err);
  }
};

export const getLead = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const lead = await Lead.findById(req.params.id).populate('createdBy', 'name email');
    if (!lead) {
      res.status(404).json({ success: false, message: 'Lead not found' });
      return;
    }
    if (req.user!.role === 'sales' && lead.createdBy.toString() !== req.user!.id) {
      res.status(403).json({ success: false, message: 'Forbidden' });
      return;
    }
    res.json({ success: true, data: lead });
  } catch (err) {
    next(err);
  }
};

export const createLead = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ success: false, message: errors.array()[0].msg });
      return;
    }

    const { name, email, status, source } = req.body as {
      name: string;
      email: string;
      status?: LeadStatus;
      source: LeadSource;
    };

    const lead = await Lead.create({
      name,
      email,
      status: status ?? 'New',
      source,
      createdBy: req.user!.id,
    });

    res.status(201).json({ success: true, data: lead });
  } catch (err) {
    next(err);
  }
};

export const updateLead = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ success: false, message: errors.array()[0].msg });
      return;
    }

    const lead = await Lead.findById(req.params.id);
    if (!lead) {
      res.status(404).json({ success: false, message: 'Lead not found' });
      return;
    }
    if (req.user!.role === 'sales' && lead.createdBy.toString() !== req.user!.id) {
      res.status(403).json({ success: false, message: 'Forbidden' });
      return;
    }

    const updated = await Lead.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.json({ success: true, data: updated });
  } catch (err) {
    next(err);
  }
};

export const deleteLead = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const lead = await Lead.findById(req.params.id);
    if (!lead) {
      res.status(404).json({ success: false, message: 'Lead not found' });
      return;
    }
    await lead.deleteOne();
    res.json({ success: true, message: 'Lead deleted' });
  } catch (err) {
    next(err);
  }
};

export const exportCSV = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { status, source, search, sort } = req.query as Record<string, string>;
    const query: LeadQuery = { status: status as LeadStatus, source: source as LeadSource, search, sort: sort as 'latest' | 'oldest' };
    const filter = buildQuery(query, req.user!.id, req.user!.role);

    const leads = await Lead.find(filter).sort({ createdAt: sort === 'oldest' ? 1 : -1 });
    const csv = leadsToCSV(leads);

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename="leads.csv"');
    res.send(csv);
  } catch (err) {
    next(err);
  }
};
