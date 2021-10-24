import {Router} from 'express';
import DataCtrl from './data.controller';

const router = new Router();

// router.route('/').get(DataCtrl.apiGetHistoricalData);
// router.route('/AAPL').get(DataCtrl.apiInsertData);

router.route('/scanner').post(DataCtrl.apiGetLatestDataWithIndicators);

router.route('/latest').get(DataCtrl.apiGetLiveData);

router.route('/test').get((req, res) => res.json('test'));

router.route('/latest/:ticker').get(DataCtrl.apiGetHistoricalData);

export default router;
