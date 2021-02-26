import { Request, Response } from 'express';
import { getCustomRepository } from "typeorm";
import { UsersRepository } from "../repositories/UsersRepository";
import { SurveysRepository } from "../repositories/SurveysRepository";
import { SurveysUsersRepository } from "../repositories/SurveysUsersRepository";
import SendMailService from "../services/SendMailService";
import { resolve } from "path";
import { AppError } from "../errors/AppError";

class SendMailController {
    async execute(request: Request, response: Response) {
        const { email, survey_id } = request.body;
        const surveysUsersRepository = getCustomRepository(SurveysUsersRepository);
        const usersRepository = getCustomRepository(UsersRepository);
        const surveysRepository = getCustomRepository(SurveysRepository);

        const user = await usersRepository.findOne({ email });

        if(!user) throw new AppError(
            'User does not exists!', 400
        );

        const survey = await surveysRepository.findOne({id: survey_id});

        if(!survey) throw new AppError(
            'Survey does not exists!', 404
        );

        const npsPath = resolve(__dirname, '..', 'views', 'emails', 'npsMail.hbs');
        const surveyUserAlreadyExists = await surveysUsersRepository.findOne({
            where: {
                user_id: user.id,
                survey_id: survey.id
            },
            relations: ['user', 'survey']
        })

        const variables = {
            name: user.name,
            title: survey.title,
            description: survey.description,
            link: process.env.URL_MAIL
        }

        if(surveyUserAlreadyExists){
            variables['id'] = surveyUserAlreadyExists.id;
            await SendMailService.execute(email, survey.title, variables, npsPath);
            return response.json(surveyUserAlreadyExists)
        }

        const surveyUser = await surveysUsersRepository.create({
            user_id: user.id,
            survey_id
        })

        variables['id'] = surveyUser.id;
        await SendMailService.execute(email, survey.title, variables, npsPath);
        await surveysUsersRepository.save(surveyUser);
        return response.json(surveyUser)
    }

}

export { SendMailController };
