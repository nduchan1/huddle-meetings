import { Router } from 'express';
import {
  createMeeting,
  deleteMeeting,
  getMeeting,
  updateMeeting,
} from '../controllers/meetings.controller.js';

export const meetingsRouter = Router();

meetingsRouter.get('/:id', getMeeting);
meetingsRouter.post('/', createMeeting);
meetingsRouter.put('/:id', updateMeeting);
meetingsRouter.delete('/:id', deleteMeeting);
