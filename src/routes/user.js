const router = require('express').Router();
import {verifyAccessToken,isAdmin} from '../middlewares/verifyToken';
import UserController  from '../controller/userController';
import fileUpload from '../configs/cloudinary';
router.post('/resisgter',UserController.resisgter);

router.get('/accuracy_vetify_register/:token',UserController.AccuracyVertifyRegister);

router.delete('/delete_accuracy_email_token/:token',UserController.DeleteRegisterDatabase)

router.post('/login',UserController.LoginUser);

router.get('/current',verifyAccessToken,UserController.getCurrentUser);

router.post('/',[verifyAccessToken,isAdmin],UserController.CreateNewUserAdmin)

router.post('/refreshtoken',UserController.refreshAccessToKen);

router.get('/logout',UserController.logout);

router.post('/forgot-password',UserController.forgotPassword);

router.put('/reset-password/:token',UserController.resetPassword);  

router.put('/address',verifyAccessToken,UserController.updateAddress)
// edit user current
router.put('/current',verifyAccessToken,fileUpload.single('avatar'),UserController.updateUser)

router.put('/cart',verifyAccessToken,UserController.updateCart);

router.delete('/cart',verifyAccessToken,UserController.removeCart);

router.put('/remove-cart/:id',verifyAccessToken,UserController.removeCart);

router.put('/change-cart',verifyAccessToken,UserController.ChangeQualnityCart)

// khi check access token admin r
router.get('/',[verifyAccessToken,isAdmin],UserController.getUserAll);

router.get('/get-user/:uuid',[verifyAccessToken,isAdmin],UserController.getUserById);

router.get('/trash-user-course',[verifyAccessToken,isAdmin],UserController.trashCourseUser);

router.delete('/:uuid/delete',[verifyAccessToken,isAdmin],UserController.deleteUsers);

router.delete('/delete-force/:uuid',[verifyAccessToken,isAdmin],UserController.DeleteForce);

router.delete('/delete-all-checkbox',[verifyAccessToken,isAdmin],UserController.HandleDeleteCheckBox);

router.post('/restore/:uuid',[verifyAccessToken,isAdmin],UserController.RestoreUser);

router.put('/:uuid',[verifyAccessToken,isAdmin],UserController.updateUserByAdmin);

router.post('/add-wishlist/:id',verifyAccessToken,UserController.AddWishlist);

router.delete('/remove-wishlist/:id',verifyAccessToken,UserController.RemoveWishList);


module.exports = router