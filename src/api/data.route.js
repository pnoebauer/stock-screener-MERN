import {Router} from 'express';
import DataCtrl from './data.controller';

const router = new Router();

// router.route('/').get(DataCtrl.apiGetStockData);
// router.route('/AAPL').get(DataCtrl.apiInsertData);

router.route('/scanner').post(DataCtrl.apiGetLatestDataWithIndicators);

router.route('/latest').get(DataCtrl.apiGetLiveStockData);
// router.route('/historical').get(DataCtrl.apiGetLiveStockData);

router.route('/lastest/:ticker').get(DataCtrl.apiGetStockData);

export default router;
