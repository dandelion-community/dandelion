import env from 'src/shared/env/env';
import { ALL_EMAIL_TEMPLATE_TYPES } from './EmailTemplateTypes';
export default function validateEmailTemplateIDs(): void {
  Object.keys(ALL_EMAIL_TEMPLATE_TYPES).forEach((templateID: string): void => {
    const templateId = env[templateID];
    if (templateId == null) {
      throw new Error('Not present in .env: ' + templateID);
    }
  });
}
