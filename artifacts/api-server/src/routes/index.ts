import { Router, type IRouter } from "express";
import healthRouter from "./health";
import meWaitlistRouter from "./me-waitlist";

const router: IRouter = Router();

router.use(healthRouter);
router.use(meWaitlistRouter);

export default router;
