import * as Joi from 'joi';

class Envs {
  port!: number;
  databaseUrl!: string;
}

export const validationSchema = Joi.object({
  port: Joi.number().required(),
  databaseUrl: Joi.string().required()
});

export const envsConfig = (): Envs => {
  const { error, value } = validationSchema.validate({
    port: Number(process.env.PORT ?? 3000),
    databaseUrl: process.env.DATABASE_URL!
  });

  if (error) throw new Error(error.message);

  return value;
};
