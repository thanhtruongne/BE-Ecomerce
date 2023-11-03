const router = require('express').Router();
import insert from '../controller/insert';
import {verifyAccessToken,isAdmin} from '../middlewares/verifyToken';

router.post('/create_new',insert.insertDataUSER)
router.post('/',insert.insertDataProduct);


router.post('/cate',insert.insertDataCate);



module.exports  = router