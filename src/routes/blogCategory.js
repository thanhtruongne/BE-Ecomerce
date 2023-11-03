const router = require('express').Router();
import BlogCategories from '../controller/BlogCatefory';
import {verifyAccessToken,isAdmin} from '../middlewares/verifyToken';

router.post('/',[verifyAccessToken,isAdmin],BlogCategories.createCategory);

router.get('/',BlogCategories.getCategory);

router.put('/:ctgid',[verifyAccessToken,isAdmin],BlogCategories.EditCategory);

router.delete('/:ctgid',[verifyAccessToken,isAdmin],BlogCategories.DeleteCategory);

module.exports = router;