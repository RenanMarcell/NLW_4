import { Request, Response } from "express";
import { getCustomRepository } from "typeorm";
import { SurveysUsersRepository } from "../repositories/SurveysUsersRepository";
import { AppError } from "../errors/AppError";

class AnswerController {
    async execute(request: Request, response: Response) {
        const { rating } = request.params;
        const { survey_id } = request.query;

        const surveysUsersRepository = getCustomRepository(SurveysUsersRepository);

        const surveyUser = await surveysUsersRepository.findOne({
            id: String(survey_id)
        });

        if(!surveyUser) throw new AppError(
            'Survey does not exists!', 400
        );

        surveyUser.value = Number(rating);

        await surveysUsersRepository.save(surveyUser);

        return response.status(201).json(surveyUser);
    }
}

export { AnswerController };
