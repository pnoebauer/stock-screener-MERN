import {Router} from 'express';
import ChartDataCtrl from './chart-data.controller';

const router = new Router();

router.route('/').post(ChartDataCtrl.apiGetSampledStockData);
// router
// 	.route('/')
// 	.post((req, res) => console.log('hit', ChartDataCtrl.apiGetSampledStockData));

export default router;
