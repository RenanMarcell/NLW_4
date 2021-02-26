import { Request, Response } from "express";
import { getCustomRepository, Not, IsNull } from "typeorm";
import { SurveysUsersRepository } from "../repositories/SurveysUsersRepository";

class NpsController {
    async execute(request: Request, response: Response) {
        const { survey_id } = request.params;
        const surveysUsersRepository = getCustomRepository(SurveysUsersRepository);

        const surveyUsers = await surveysUsersRepository.find({
            survey_id,
            value: Not(IsNull())
        })
        const detractors = surveyUsers.filter(survey => {
            return survey.value < 7
        }).length;
        const promoters = surveyUsers.filter(survey => {
            return survey.value > 8
        }).length;
        const passive = surveyUsers.filter(survey => {
            return survey.value > 6 && survey.value < 9
        }).length;
        const totalAnswers = surveyUsers.length;

        const calculate = Number(
            (((promoters - detractors) / totalAnswers) * 100).toFixed(2)
        );

        return response.json({
            detractors,
            promoters,
            passive,
            'total_answers': totalAnswers,
            'nps': calculate
        })
    }
}

export { NpsController };
