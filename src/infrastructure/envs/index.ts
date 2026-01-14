import * as Joi from 'joi';

class Envs {
  port!: number;
  databaseUrl!: string;
  jwtSecret!: string;
  jwtExpiresIn!: string;
  mailerPort!: number;
  mailerHost!: string;
  mailerUser!: string;
  mailerPass!: string;
  mailConfirmUrl!: string;
  cloudinaryCloudName!: string;
  cloudinaryApiKey!: string;
  cloudinaryApiSecret!: string;
  isProduction!: boolean;
  midtransClientKey!: string;
  midtransServerKey!: string;
}

export const validationSchema = Joi.object({
  port: Joi.number().required(),
  databaseUrl: Joi.string().required(),
  jwtSecret: Joi.string().required(),
  jwtExpiresIn: Joi.string().required(),
  mailerHost: Joi.string().required(),
  mailerPort: Joi.number().required(),
  mailerUser: Joi.string().required(),
  mailerPass: Joi.string().required(),
  mailConfirmUrl: Joi.string().required(),
  cloudinaryCloudName: Joi.string().required(),
  cloudinaryApiKey: Joi.string().required(),
  cloudinaryApiSecret: Joi.string().required(),
  isProduction: Joi.boolean().required(),
  midtransClientKey: Joi.string().required(),
  midtransServerKey: Joi.string().required(),
});

export const envsConfig = (): Envs => {
  const { error, value } = validationSchema.validate({
    port: Number(process.env.PORT ?? 3000),
    databaseUrl: process.env.DATABASE_URL!,
    jwtSecret: process.env.JWT_SECRET!,
    jwtExpiresIn: process.env.JWT_EXPIRES_IN!,
    mailerHost: process.env.MAILER_HOST!,
    mailerPort: Number(process.env.MAILER_PORT!),
    mailerUser: process.env.MAILER_USER!,
    mailerPass: process.env.MAILER_PASS!,
    mailConfirmUrl: process.env.MAIL_CONFIRM_URL!,
    cloudinaryCloudName: process.env.CLOUDINARY_CLOUD_NAME!,
    cloudinaryApiKey: process.env.CLOUDINARY_API_KEY!,
    cloudinaryApiSecret: process.env.CLOUDINARY_API_SECRET!,
    isProduction: process.env.IS_PRODUCTION!,
    midtransClientKey: process.env.MIDTRANS_CLIENT_KEY!,
    midtransServerKey: process.env.MIDTRANS_SERVER_KEY!,
  });

  if (error) throw new Error(error.message);

  return value;
};
