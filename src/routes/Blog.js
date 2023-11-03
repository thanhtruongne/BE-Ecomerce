const router = require('express').Router();
import Blog from '../controller/Blog';
import {verifyAccessToken,isAdmin} from '../middlewares/verifyToken';

router.post('/',[verifyAccessToken,isAdmin],Blog.createBlogs);

router.get('/',Blog.getBlogs);

router.get('/one/:blgid',Blog.getBlog);

router.put('/:blgid',[verifyAccessToken,isAdmin],Blog.EditBlogs);

router.put('/like/:blgid',verifyAccessToken,Blog.likeBlogs);

router.put('/dislike/:blgid',verifyAccessToken,Blog.dislikeBlog);

router.delete('/:blgid',[verifyAccessToken,isAdmin],Blog.DeleteBlogs);

module.exports = router;