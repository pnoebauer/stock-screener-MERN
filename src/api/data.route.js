import {Router} from 'express';
import DataCtrl from './data.controller';

const router = new Router();

// router.route('/').get(DataCtrl.apiGetStockData);
// router.route('/AAPL').get(DataCtrl.apiInsertData);
router.route('/:ticker').get(DataCtrl.apiGetStockData);

export default router;
