const router = require('express').Router();
import {verifyAccessToken,isAdmin} from '../middlewares/verifyToken';
import ProductsController from '../controller/ProductsController';
import fileUpload from '../configs/cloudinary';

router.post('/',[verifyAccessToken,isAdmin],
fileUpload.fields([{name : 'thumb',maxCount: 1},{name : 'images',maxCount : 10}]),
ProductsController.createProducts);

router.get('/',ProductsController.getListProducts);

router.put('/updates/:uuid',[verifyAccessToken,isAdmin],
fileUpload.fields([{name : 'thumb',maxCount: 1},{name    : 'images',maxCount : 10}])
,ProductsController.updateProduct);

router.post('/variants/:uuid',[verifyAccessToken,isAdmin],
fileUpload.fields([{name : 'thumb',maxCount: 1},{name : 'images',maxCount : 10}]),
ProductsController.CreateVariants
)

router.put('/uploadimages/:uuid',[verifyAccessToken,isAdmin],fileUpload.array('files',8),ProductsController.uploadImage)

router.put('/ratings',verifyAccessToken,ProductsController.ratings)


router.delete('/:uuid',[verifyAccessToken,isAdmin],ProductsController.DeleteProduct)

router.get('/:uuid',ProductsController.getSingleProduct);

module.exports = router;