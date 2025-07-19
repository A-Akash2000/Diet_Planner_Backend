import { Router } from 'express';
import * as UserCtrl from './controllers'
import { validateAddUser } from './Validations/Validations';
import { validateUserDetails } from './Validations/uservalidation';
import { validateMeal } from './Validations/dietmealvalidation';
import { decryptRequest,jwtMiddleware } from '../../middlewares/middleware';
import { uploadProfilePictureUser } from '../../utils/fileupload'

const router = Router();

router.get('/getallusers', jwtMiddleware, UserCtrl.getAllUsers);
router.get('/get-userdetails/:userId', jwtMiddleware, UserCtrl.getUserDetails);
router.get('/getcurrentuser/:id', jwtMiddleware, UserCtrl.getCurrentUserById);
router.get('/bmi-logs/:userId',jwtMiddleware, UserCtrl.getUserBMILogs);
router.get('/getmeal',jwtMiddleware, UserCtrl.getMeals);
router.get('/diet-plan/:userId', UserCtrl.generateDietPlan);

router.use(decryptRequest)
router.post('/login', UserCtrl.loginUser);
router.post('/add-user',jwtMiddleware, validateAddUser,uploadProfilePictureUser, UserCtrl.addUser);
router.post('/update-user',jwtMiddleware, validateAddUser,uploadProfilePictureUser, UserCtrl.updateUser);
router.post('/delete-user/:id/:deleted',jwtMiddleware, UserCtrl.deleteUser);
router.post('/create-UserDetails',jwtMiddleware,validateUserDetails, UserCtrl.createUserDetails);
router.post('/update-UserDetails/:userId',jwtMiddleware,validateUserDetails, UserCtrl.updateUserDetails);
router.post('/add-meals',jwtMiddleware,validateMeal, UserCtrl.createMeal);
router.post('/update-meal/:userId',jwtMiddleware,validateMeal, UserCtrl.updateMeal);


export default router;