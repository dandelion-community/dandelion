export const ALL_EMAIL_TEMPLATE_TYPES = {
  NEW_COMMENT_NOTIFICATION_TEMPLATE_ID: null,
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
  };
}

export type EmailTemplateType = NewComment;
