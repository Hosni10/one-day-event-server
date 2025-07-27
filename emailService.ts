import { createTransport } from 'nodemailer';
import type { InsertRegistration } from './schema';
import dotenv from 'dotenv';

dotenv.config();

// Email configuration
const emailConfig = {
  service: 'gmail',

  
  auth: {
    user: process.env.SMTP_USER ,
    pass: process.env.SMTP_PASS ,
  },
};

// Create transporter
const transporter = createTransport(emailConfig);

// Email templates
const createConfirmationEmail = (registration: InsertRegistration) => {
  const kidsInfo = registration.kids && registration.kids.length > 0 
    ? registration.kids.map(kid => `- ${kid.name} (Age: ${kid.age}, Gender: ${kid.gender}, T-Shirt: ${kid.tshirtSize})`).join('\n')
    : 'None';

  const entertainmentSports = registration.entertainmentSports?.join(', ') || 'None';
  const competitiveSports = registration.competitiveSports?.join(', ') || 'None';

  return {
    subject: '🎉 DOF Registration Confirmation',
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>DOF Registration Confirmation</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
          .section { margin-bottom: 25px; }
          .section h3 { color: #667eea; border-bottom: 2px solid #667eea; padding-bottom: 5px; margin-bottom: 15px; }
          .info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 15px; }
          .info-item { background: white; padding: 15px; border-radius: 8px; border-left: 4px solid #667eea; }
          .label { font-weight: bold; color: #555; }
          .value { color: #333; }
          .success-badge { background: #4CAF50; color: white; padding: 8px 16px; border-radius: 20px; display: inline-block; margin-bottom: 20px; }
          .footer { text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd; color: #666; font-size: 14px; }
          .highlight { background: #fff3cd; padding: 15px; border-radius: 8px; border-left: 4px solid #ffc107; margin: 15px 0; }
          @media (max-width: 600px) {
            .info-grid { grid-template-columns: 1fr; }
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🏆 DOF Registration Confirmed!</h1>
            <p>Thank you for registering for our Company Day of family Event</p>
          </div>
          
          <div class="content">
            <div class="success-badge">✅ Registration Successful</div>
            
            <div class="section">
              <h3>📋 Registration Details</h3>
              <div class="info-grid">
                <div class="info-item">
                  <div class="label">Full Name:</div>
                  <div class="value">${registration.fullName}</div>
                </div>
                <div class="info-item">
                  <div class="label">Email:</div>
                  <div class="value">${registration.email}</div>
                </div>
                <div class="info-item">
                  <div class="label">Phone:</div>
                  <div class="value">${registration.phone}</div>
                </div>
                <div class="info-item">
                  <div class="label">Department:</div>
                  <div class="value">${registration.department}</div>
                </div>
                <div class="info-item">
                  <div class="label">Gender:</div>
                  <div class="value">${registration.gender}</div>
                </div>
                <div class="info-item">
                  <div class="label">T-Shirt Size:</div>
                  <div class="value">${registration.parentTshirtSize}</div>
                </div>
              </div>
            </div>

            <div class="section">
              <h3>👨‍👩‍👧‍👦 Family Information</h3>
              <div class="info-item">
                <div class="label">Bringing Kids:</div>
                <div class="value">${registration.bringingKids ? 'Yes' : 'No'}</div>
              </div>
              ${registration.bringingKids ? `
                <div class="info-item">
                  <div class="label">Number of Kids:</div>
                  <div class="value">${registration.numberOfKids}</div>
                </div>
                <div class="info-item">
                  <div class="label">Kids Details:</div>
                  <div class="value">${kidsInfo}</div>
                </div>
              ` : ''}
            </div>

            <div class="section">
              <h3>⚽ Sports Preferences</h3>
              <div class="info-grid">
                <div class="info-item">
                  <div class="label">Entertainment Sports:</div>
                  <div class="value">${entertainmentSports}</div>
                </div>
                <div class="info-item">
                  <div class="label">Interested in Competing:</div>
                  <div class="value">${registration.interestedInCompeting ? 'Yes' : 'No'}</div>
                </div>
                ${registration.interestedInCompeting ? `
                  <div class="info-item">
                    <div class="label">Competitive Sports:</div>
                    <div class="value">${competitiveSports}</div>
                  </div>
                ` : ''}
              </div>
            </div>

            <div class="section">
              <h3>💪 Health Information</h3>
              <div class="info-grid">
                <div class="info-item">
                  <div class="label">Last Exercise:</div>
                  <div class="value">${registration.lastExercise}</div>
                </div>
                <div class="info-item">
                  <div class="label">Medical Conditions:</div>
                  <div class="value">${registration.medicalConditions?.join(', ') || 'None'}</div>
                </div>
              </div>
            </div>

            <div class="highlight">
              <strong>📅 Event Details:</strong><br>
              • Date: 17th August 2025<br>
              • Time: 8:00 AM - 6:00 PM<br>
              • Location: Adnec Abu Dhabi Summer Sports hall 9<br>

              <br>
              <strong>🎯 Important Notes:</strong><br>
              • Please arrive 15 minutes before the event starts<br>
              • All participants will receive their event t-shirts on the day<br>
            </div>

            <div class="footer">
              <p>If you have any questions, please contact the event organizers.</p>
              <p>We look forward to seeing you at the Sports Day!</p>
            </div>
          </div>
        </div>
      </body>
      </html>
    `,
    text: `
Sports Day Registration Confirmation

Dear ${registration.fullName},

Thank you for registering for our Company Sports Day Event! Your registration has been successfully received.

REGISTRATION DETAILS:
- Full Name: ${registration.fullName}
- Email: ${registration.email}
- Phone: ${registration.phone}
- Department: ${registration.department}
- Gender: ${registration.gender}
- T-Shirt Size: ${registration.parentTshirtSize}

FAMILY INFORMATION:
- Bringing Kids: ${registration.bringingKids ? 'Yes' : 'No'}
${registration.bringingKids ? `- Number of Kids: ${registration.numberOfKids}
- Kids Details: ${kidsInfo}` : ''}

SPORTS PREFERENCES:
- Entertainment Sports: ${entertainmentSports}
- Interested in Competing: ${registration.interestedInCompeting ? 'Yes' : 'No'}
${registration.interestedInCompeting ? `- Competitive Sports: ${competitiveSports}` : ''}

HEALTH INFORMATION:
- Last Exercise: ${registration.lastExercise}
- Medical Conditions: ${registration.medicalConditions?.join(', ') || 'None'}

EVENT DETAILS:
- Date: [Event Date]
- Time: [Event Time]
- Location: [Event Location]

IMPORTANT NOTES:
- Please arrive 15 minutes before the event starts
- All participants will receive their event t-shirts on the day
- Medical staff will be available throughout the event
- Refreshments and snacks will be provided

If you have any questions, please contact the event organizers.

We look forward to seeing you at the Sports Day!

Best regards,
The Sports Day Team
    `
  };
};

// Send confirmation email
export const sendConfirmationEmail = async (registration: InsertRegistration): Promise<void> => {
  try {
    const emailContent = createConfirmationEmail(registration);
    
    const mailOptions = {
      from: `"Sports Day Team" <${emailConfig.auth.user}>`,
      to: registration.email,
      subject: emailContent.subject,
      html: emailContent.html,
      text: emailContent.text,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Confirmation email sent successfully:', info.messageId);
  } catch (error) {
    console.error('Error sending confirmation email:', error);
    throw new Error('Failed to send confirmation email');
  }
};

// Verify email configuration
export const verifyEmailConfig = async (): Promise<boolean> => {
  try {
    await transporter.verify();
    console.log('Email configuration verified successfully');
    return true;
  } catch (error) {
    console.error('Email configuration verification failed:', error);
    return false;
  }
}; 