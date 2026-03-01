import nodemailer from 'nodemailer';

// Create transporter (configure with your email service)
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD
  }
});

export async function sendViolationEmail(studentEmail: string, data: {
  name: string;
  regNo: string;
  violations: string[];
  timestamp: string;
}) {
  try {
    const violationsList = data.violations.map(v => `• ${v}`).join('\n');

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: studentEmail,
      subject: '⚠️ Dress Code Violation Alert - College Uniform Scanner',
      html: `
        <div style="font-family: Arial, sans-serif; background-color: #f5f5f5; padding: 20px;">
          <div style="background-color: white; padding: 30px; border-radius: 10px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
            <h2 style="color: #d32f2f; text-align: center;">⚠️ Dress Code Violation Detected</h2>
            
            <div style="margin: 20px 0; padding: 15px; background-color: #fff3cd; border-left: 4px solid #ffc107; border-radius: 4px;">
              <p><strong>Student Name:</strong> ${data.name}</p>
              <p><strong>Registration No:</strong> ${data.regNo}</p>
              <p><strong>Date & Time:</strong> ${data.timestamp}</p>
            </div>

            <h3 style="color: #333;">Violation Details:</h3>
            <div style="padding: 15px; background-color: #ffebee; border-left: 4px solid #d32f2f; border-radius: 4px; white-space: pre-line;">
              ${violationsList}
            </div>

            <p style="margin-top: 20px; color: #666;">
              Please ensure you follow the college dress code guidelines. 
              Multiple violations may result in further action.
            </p>

            <hr style="border: none; border-top: 1px solid #ddd; margin: 20px 0;" />

            <p style="color: #999; font-size: 12px; text-align: center;">
              This is an automated notification from College Uniform Scanner
            </p>
          </div>
        </div>
      `
    };

    await transporter.sendMail(mailOptions);
    console.log('Violation email sent successfully');
  } catch (error) {
    console.error('Error sending violation email:', error);
    throw error;
  }
}

export async function sendRegistrationEmail(email: string, name: string) {
  try {
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: '✅ Account Created - College Uniform Scanner',
      html: `
        <div style="font-family: Arial, sans-serif;">
          <h2>Welcome ${name}! 👋</h2>
          <p>Your account has been successfully created on College Uniform Scanner.</p>
          <p>You can now login and use the uniform scanning feature.</p>
        </div>
      `
    };

    await transporter.sendMail(mailOptions);
    console.log('Registration email sent successfully');
  } catch (error) {
    console.error('Error sending registration email:', error);
  }
}
