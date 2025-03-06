import { Router } from 'express';
import { PlayerController } from '../controllers/player.controller';

const router = Router();

router.get('/', PlayerController.getAllPlayers);
router.get('/:id', PlayerController.getPlayerById);
router.post('/', PlayerController.createPlayer);
router.put('/:id', PlayerController.updatePlayer);
router.delete('/:id', PlayerController.deletePlayer);

export default router;
