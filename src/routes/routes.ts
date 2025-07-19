import { Router } from 'express';
import UserRoute from "../app/Users/routes"

const router = Router();

router.use('/user', UserRoute);

export default router;
