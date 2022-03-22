export const ALL_EMAIL_TEMPLATE_TYPES = {
  NEW_COMMENT_NOTIFICATION_TEMPLATE_ID: null,
  PASSWORD_RESET_EMAIL_TEMPLATE_ID: null,
  REMINDER_NOTIFICATION_TEMPLATE_ID: null,
};

interface EmailTemplateTypeBase {
  templateID: keyof typeof ALL_EMAIL_TEMPLATE_TYPES;
  templateProps: Record<string, string>;
}

interface NewComment extends EmailTemplateTypeBase {
  templateID: 'NEW_COMMENT_NOTIFICATION_TEMPLATE_ID';
  templateProps: {
    comment_value: string;
    commenter_name: string;
    notification_settings_url: string;
    request_url: string;
    what_is_needed: string;
    who_is_it_for: string;
    subject: string;
  };
}

interface AidRequestReminder extends EmailTemplateTypeBase {
  templateID: 'REMINDER_NOTIFICATION_TEMPLATE_ID';
  templateProps: {
    aid_request_title: string;
    reminder_reason: string;
    request_url: string;
    notification_reason: string;
    notification_settings_url: string;
  };
}

interface PasswordResetEmail extends EmailTemplateTypeBase {
  templateID: 'PASSWORD_RESET_EMAIL_TEMPLATE_ID';
  templateProps: {
    password_reset_url: string;
  };
}

export type EmailTemplateType =
  | NewComment
  | AidRequestReminder
  | PasswordResetEmail;
