import userRouter  from './user';
import products from './products';
import category from './categories';
import blogCategory from './blogCategory';
import blog from './Blog';
import brand from './brand';
import coupon from './Coupons';
import order from './order';
import insert from './insertData'
import { notfound,errHandler } from '../middlewares/errHandle';

let initRoutes = (app) => {

 app.use('/api/user',userRouter);

 app.use('/api/products',products);

 app.use('/api/category',category)

 app.use('/api/blogCategory',blogCategory)

 app.use('/api/blog',blog);

 app.use('/api/brand',brand);

 app.use('/api/coupon',coupon);

 app.use('/api/order',order);
 
 app.use('/api/insert',insert)
 //handle Error tránh log ra terminal
 app.use(notfound);
 app.use(errHandler);

}

module.exports = initRoutes;