const router = require('express').Router();
import {verifyAccessToken,isAdmin} from '../middlewares/verifyToken';
import Order from '../controller/order';

router.post('/',verifyAccessToken,Order.createOrder);

router.put('/status/:orid',[verifyAccessToken,isAdmin], Order.updateOrder);

router.delete('/:orid',[verifyAccessToken,isAdmin], Order.deleteOrder);

router.get('/all',verifyAccessToken,Order.getOrdersUser);



module.exports = router ;