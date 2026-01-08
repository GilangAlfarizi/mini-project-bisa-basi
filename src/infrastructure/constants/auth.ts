import { envsConfig } from '@infrastructure/envs';

export const MAIL_CONFIRM_URL = envsConfig().mailConfirmUrl;
export const MAIL_CONFIRM_EMAIL_SUBJECT =
  'BisaBasi - Confirm Your Email Address';
export const MAIL_SENDER_NAME = 'BisaBasi';
export const MAIL_SENDER_ADDRESS = 'noreply@bisa.com';
