# Email Configuration Guide

## Setup Instructions

### 1. Environment Variables

Create a `.env` file in the server directory with the following variables:

```env
# Email Configuration
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
```

### 2. Gmail Setup (Recommended)

1. Enable 2-Step Verification on your Google Account
2. Go to Google Account > Security > 2-Step Verification > App passwords
3. Generate an app password for "Mail"
4. Use this app password as `SMTP_PASS`

### 3. Alternative Email Providers

- **Outlook/Hotmail**: `smtp-mail.outlook.com`
- **Yahoo**: `smtp.mail.yahoo.com`
- **Custom domain**: Use your SMTP server details

### 4. Testing Email Configuration

The server will automatically verify email configuration on startup. Check the console logs for:

- "Email configuration verified successfully" ✅
- "Email configuration verification failed" ❌

### 5. Email Template Customization

Edit `emailService.ts` to customize:

- Email subject and content
- Event details (date, time, location)
- Company branding and colors
- Additional information or disclaimers

## Troubleshooting

### Common Issues:

1. **Authentication failed**: Check your email and app password
2. **Connection timeout**: Verify SMTP host and port
3. **Email not sending**: Check firewall/network settings

### For Development:

- Use Gmail with App Password (most reliable)
- Consider using services like Mailtrap for testing
- Check spam folder for test emails
