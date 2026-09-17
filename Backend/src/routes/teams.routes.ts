import { Router } from 'express';
import { listTeamMeetings, listTeams } from '../controllers/teams.controller.js';

export const teamsRouter = Router();

teamsRouter.get('/', listTeams);
teamsRouter.get('/:teamId/meetings', listTeamMeetings);
