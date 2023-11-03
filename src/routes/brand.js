const router = require('express').Router();
import brand from '../controller/BrandController';
import {verifyAccessToken,isAdmin} from '../middlewares/verifyToken';

router.post('/',[verifyAccessToken,isAdmin],brand.createBrand);

router.get('/',brand.getBrand);

router.put('/:brid',[verifyAccessToken,isAdmin],brand.EditBrand);

router.delete('/:brid',[verifyAccessToken,isAdmin],brand.DeleteBrand);

module.exports = router;
