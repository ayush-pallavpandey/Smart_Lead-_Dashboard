import { Router } from 'express';
import {
  getLeads,
  getLead,
  createLead,
  updateLead,
  deleteLead,
  exportCSV,
  leadValidation,
} from '../controllers/leadController';
import { authenticate, requireRole } from '../middleware/auth';

const router = Router();

router.use(authenticate);

router.get('/export/csv', exportCSV);
router.get('/', getLeads);
router.post('/', leadValidation, createLead);
router.get('/:id', getLead);
router.put('/:id', leadValidation, updateLead);
router.delete('/:id', requireRole('admin'), deleteLead);

export default router;
