const router = require('express').Router();
import Coupon from '../controller/Coupon';
import {verifyAccessToken,isAdmin} from '../middlewares/verifyToken';

router.post('/',[verifyAccessToken,isAdmin],Coupon.createCoupon);

router.get('/',verifyAccessToken,Coupon.getCoupons);

router.put('/:cid',[verifyAccessToken,isAdmin],Coupon.EditCoupon);

router.delete('/:cid',[verifyAccessToken,isAdmin],Coupon.Deleteoupon);

module.exports = router;