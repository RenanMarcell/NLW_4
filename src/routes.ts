import { Router } from 'express';
import { SurveyController } from "./controllers/SurveyController";
import { UserController } from "./controllers/UserController";
import { SendMailController } from "./controllers/SendMailController";
import { AnswerController } from "./controllers/AnswerController";
import { NpsController } from "./controllers/NpsController";

const router = Router();
const userController = new UserController();
const surveyController = new SurveyController();
const sendMail = new SendMailController();
const answerController = new AnswerController();
const npsController = new NpsController();

router.post('/users', userController.create)
router.post('/surveys', surveyController.create)
router.get('/surveys', surveyController.show)

router.post('/sendMail', sendMail.execute)
router.get('/answers/:rating', answerController.execute)
router.get('/nps/:survey_id', npsController.execute)

export { router };
