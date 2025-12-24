import * as Joi from 'joi';

class Envs {
  port!: number;
  databaseUrl!: string;
  jwtSecret!: string;
  jwtExpiresIn!: string;
}

export const validationSchema = Joi.object({
  port: Joi.number().required(),
  databaseUrl: Joi.string().required(),
  jwtSecret: Joi.string().required(),
  jwtExpiresIn: Joi.string().required(),
});

export const envsConfig = (): Envs => {
  const { error, value } = validationSchema.validate({
    port: Number(process.env.PORT ?? 3000),
    databaseUrl: process.env.DATABASE_URL!,
    jwtSecret: process.env.JWT_SECRET!,
    jwtExpiresIn: process.env.JWT_EXPIRES_IN!,
  });

  if (error) throw new Error(error.message);

  return value;
};
