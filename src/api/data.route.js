import {Router} from 'express';
import DataCtrl from './Data.controller';

const router = new Router();

// associate put, delete, and get(id)
router.route('/').get(DataCtrl.apiGetData);
router.route('/AAPL').get(DataCtrl.apiInsertData);

export default router;
