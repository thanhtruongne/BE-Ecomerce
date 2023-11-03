const router = require('express').Router();
import Categories from '../controller/Category';
import {verifyAccessToken,isAdmin} from '../middlewares/verifyToken';

router.post('/',[verifyAccessToken,isAdmin],Categories.createCategory);

router.get('/',Categories.getCategory);

router.put('/:ctgid',[verifyAccessToken,isAdmin],Categories.EditCategory);

router.delete('/:ctgid',[verifyAccessToken,isAdmin],Categories.DeleteCategory);

module.exports = router;