import dotenv from 'dotenv';
import { ALL_EMAIL_TEMPLATE_TYPES } from './EmailTemplateTypes';

dotenv.config();

export default function validateEmailTemplateIDs(): void {
  Object.keys(ALL_EMAIL_TEMPLATE_TYPES).forEach((templateID: string): void => {
    const templateId = process.env[templateID];
    if (templateId == null) {
      throw new Error('Not present in .env: ' + templateID);
    }
  });
}
