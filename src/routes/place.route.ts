import { Router } from "express";
import { CreateCountry, GetCity, GetCountry } from "src/controllers/place.controller.js";

const router:Router=Router()

router.post('/country',CreateCountry)
router.get('/country',GetCountry)
router.get('/city',GetCity)

export default router;
