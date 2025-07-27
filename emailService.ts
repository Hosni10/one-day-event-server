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

  const spouseInfo = registration.spouse 
    ? `- ${registration.spouse.name} (Age: ${registration.spouse.age}, Gender: ${registration.spouse.gender}, T-Shirt: ${registration.spouse.tshirtSize})`
    : 'None';

  const entertainmentSports = registration.entertainmentSports?.join(', ') || 'None';
  const competitiveSports = registration.competitiveSports?.join(', ') || 'None';

  return {
    subject: '🎉 DOF Registration Confirmation',
    html: `
      <table role="presentation" cellpadding="0" cellspacing="0" border="0" style="width:100%;max-width:600px;margin:0 auto;font-family:Arial,Helvetica,sans-serif;background:#ffffff;">
        <tr>
          <td style="background:#4a90e2;color:#ffffff;padding:20px;text-align:center;">
            <h1 style="margin:0 0 10px 0;font-size:24px;">DOF Registration Confirmed!</h1>
            <p style="margin:0;">Thank you for registering for our Company Day of Family Event</p>
          </td>
        </tr>
        
        <tr>
          <td style="padding:20px;">
            <div style="background:#28a745;color:#ffffff;padding:8px 15px;text-align:center;margin-bottom:20px;font-weight:bold;">
              Registration Successful
            </div>
            
            <div style="margin-bottom:25px;border-bottom:1px solid #eeeeee;padding-bottom:20px;">
              <h3 style="font-size:16px;font-weight:bold;color:#4a90e2;margin:0 0 15px 0;">Registration Details</h3>
              <p style="margin:0 0 10px 0;"><strong style="color:#666666;">Full Name:</strong> ${registration.fullName}</p>
              <p style="margin:0 0 10px 0;"><strong style="color:#666666;">Email:</strong> ${registration.email}</p>
              <p style="margin:0 0 10px 0;"><strong style="color:#666666;">Phone:</strong> ${registration.phone}</p>
              <p style="margin:0 0 10px 0;"><strong style="color:#666666;">Department:</strong> ${registration.department}</p>
              <p style="margin:0 0 10px 0;"><strong style="color:#666666;">Gender:</strong> ${registration.gender}</p>
              <p style="margin:0 0 10px 0;"><strong style="color:#666666;">T-Shirt Size:</strong> ${registration.parentTshirtSize}</p>
            </div>
  
            <div style="margin-bottom:25px;border-bottom:1px solid #eeeeee;padding-bottom:20px;">
              <h3 style="font-size:16px;font-weight:bold;color:#4a90e2;margin:0 0 15px 0;">Family Information</h3>
              <p style="margin:0 0 10px 0;"><strong style="color:#666666;">Bringing Kids:</strong> ${registration.bringingKids ? 'Yes' : 'No'}</p>
              ${registration.bringingKids ? `
                <p style="margin:0 0 10px 0;"><strong style="color:#666666;">Number of Kids:</strong> ${registration.numberOfKids}</p>
                <p style="margin:0 0 10px 0;"><strong style="color:#666666;">Kids Details:</strong> ${kidsInfo}</p>
              ` : ''}
              <p style="margin:0 0 10px 0;"><strong style="color:#666666;">Bringing Spouse:</strong> ${registration.bringingSpouse ? 'Yes' : 'No'}</p>
              ${registration.bringingSpouse ? `
                <p style="margin:0 0 10px 0;"><strong style="color:#666666;">Spouse Details:</strong> ${spouseInfo}</p>
              ` : ''}
            </div>
  
            <div style="margin-bottom:25px;border-bottom:1px solid #eeeeee;padding-bottom:20px;">
              <h3 style="font-size:16px;font-weight:bold;color:#4a90e2;margin:0 0 15px 0;">Sports Preferences</h3>
              <p style="margin:0 0 10px 0;"><strong style="color:#666666;">Entertainment Sports:</strong> ${entertainmentSports}</p>
              <p style="margin:0 0 10px 0;"><strong style="color:#666666;">Interested in Competing:</strong> ${registration.interestedInCompeting ? 'Yes' : 'No'}</p>
              ${registration.interestedInCompeting ? `
                <p style="margin:0 0 10px 0;"><strong style="color:#666666;">Competitive Sports:</strong> ${competitiveSports}</p>
              ` : ''}
            </div>
  
            <div style="margin-bottom:25px;border-bottom:1px solid #eeeeee;padding-bottom:20px;">
              <h3 style="font-size:16px;font-weight:bold;color:#4a90e2;margin:0 0 15px 0;">Health Information</h3>
              <p style="margin:0 0 10px 0;"><strong style="color:#666666;">Last Exercise:</strong> ${registration.lastExercise}</p>
              <p style="margin:0 0 10px 0;"><strong style="color:#666666;">Medical Conditions:</strong> ${registration.medicalConditions?.join(', ') || 'None'}</p>
            </div>
  
            <div style="background:#fff3cd;border:1px solid #ffeaa7;padding:15px;margin:20px 0;">
              <strong>📅 Event Details:</strong><br><br>
              • Date: 17th August 2025<br>
              • Time: 8:00 AM - 6:00 PM<br>
              • Location: Adnec Abu Dhabi Summer Sports hall 9<br><br>
              
              <strong>🎯 Important Notes:</strong><br>
              • Please arrive 15 minutes before the event starts<br>
              • All participants will receive their event t-shirts on the day<br>
              • Bring your registration confirmation<br>
            </div>
          </td>
        </tr>
        
        <tr>
          <td style="background:#f8f9fa;padding:20px;text-align:center;font-size:12px;color:#666666;">
            <p style="margin:0 0 10px 0;">If you have any questions, please contact the event organizers.</p>
            <p style="margin:0;">We look forward to seeing you at the Sports Day!</p>
          </td>
        </tr>
      </table>
    `,
    text: `
  DOF Registration Confirmation
  
  Dear ${registration.fullName},
  
  Thank you for registering for our Company Day of Family Event! Your registration has been successfully received.
  
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
  - Bringing Spouse: ${registration.bringingSpouse ? 'Yes' : 'No'}
  ${registration.bringingSpouse ? `- Spouse Details: ${spouseInfo}` : ''}
  
  SPORTS PREFERENCES:
  - Entertainment Sports: ${entertainmentSports}
  - Interested in Competing: ${registration.interestedInCompeting ? 'Yes' : 'No'}
  ${registration.interestedInCompeting ? `- Competitive Sports: ${competitiveSports}` : ''}
  
  HEALTH INFORMATION:
  - Last Exercise: ${registration.lastExercise}
  - Medical Conditions: ${registration.medicalConditions?.join(', ') || 'None'}
  
  EVENT DETAILS:
  - Date: 17th August 2025
  - Time: 8:00 AM - 6:00 PM
  - Location: Adnec Abu Dhabi Summer Sports hall 9
  
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