import {Router} from 'express';

import {UNIVERSES} from '../assets/constants';

const router = new Router();

router.route('/').get((req, res) => {
	console.log('universes endpoint receiving');
	return res.json(UNIVERSES);
});

export default router;
