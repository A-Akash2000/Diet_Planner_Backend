import { Router } from 'express';
import * as UserCtrl from './controllers'
import { validateAddUser } from './Validations/Validations';
import { decryptRequest,jwtMiddleware } from '../../middlewares/middleware';
import { uploadProfilePictureUser } from '../../utils/fileupload'

const router = Router();

router.get('/get-meals/:userId', jwtMiddleware, UserCtrl.getMeals);
router.get('/getallusers', jwtMiddleware, UserCtrl.getAllUsers);
router.get('/get-userdetails/:userId', jwtMiddleware, UserCtrl.getUserDetails);
router.get('/getcurrentuser/:id', jwtMiddleware, UserCtrl.getCurrentUserById);

router.use(decryptRequest)
router.post('/login', UserCtrl.loginUser);
router.post('/add-user',jwtMiddleware, validateAddUser,uploadProfilePictureUser, UserCtrl.addUser);
router.post('/update-user',jwtMiddleware, validateAddUser,uploadProfilePictureUser, UserCtrl.updateUser);
router.post('/delete-user/:id/:deleted',jwtMiddleware, UserCtrl.deleteUser);
router.post('/create-UserDetails',jwtMiddleware, UserCtrl.createUserDetails);
router.post('/update-UserDetails/:userId',jwtMiddleware, UserCtrl.updateUserDetails);
router.post('/add-meals',jwtMiddleware, UserCtrl.createMeal);
router.post('/update-means/:userId',jwtMiddleware, UserCtrl.updateMeal);


export default router;