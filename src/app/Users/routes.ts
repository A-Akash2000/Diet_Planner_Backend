import { Router } from 'express';
import * as UserCtrl from './controllers'
import { validateAddUser } from './Validations/Validations';
import { decryptRequest,jwtMiddleware } from '../../middlewares/middleware';
import { uploadProfilePictureUser } from '../../utils/fileupload'

const router = Router();

router.post('/add-user',decryptRequest, validateAddUser,uploadProfilePictureUser, UserCtrl.addUser);
router.post('/update-user',jwtMiddleware,decryptRequest, validateAddUser,uploadProfilePictureUser, UserCtrl.updateUser);
router.post('/login',decryptRequest, UserCtrl.loginUser);
router.get('/getallusers', jwtMiddleware, UserCtrl.getAllUsers);
router.get('/getcurrentuser/:id', jwtMiddleware, UserCtrl.getCurrentUserById);
router.post('/delete-user/:id/:deleted',jwtMiddleware, UserCtrl.deleteUser);
router.post('/create-UserDetails',jwtMiddleware,decryptRequest, UserCtrl.createUserDetails);
router.post('/update-UserDetails/:userId',jwtMiddleware,decryptRequest, UserCtrl.updateUserDetails);
router.get('/get-userdetails/:userId', jwtMiddleware, UserCtrl.getUserDetails);
router.post('/add-meals',jwtMiddleware,decryptRequest, UserCtrl.createMeal);
router.post('/update-means/:userId',jwtMiddleware,decryptRequest, UserCtrl.updateMeal);
router.get('/get-meals/:userId', jwtMiddleware, UserCtrl.getMeals);

export default router;