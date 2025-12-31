const nodemailer = require('nodemailer');

// Create transporter
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

// Send welcome email
exports.sendWelcomeEmail = async (email, { name }) => {
  try {
    await transporter.sendMail({
      from: process.env.EMAIL_FROM,
      to: email,
      subject: 'Welcome to Israel Visa Application Portal',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #0038B8 0%, #0052E0 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
            .button { display: inline-block; padding: 12px 30px; background: #0038B8; color: white; text-decoration: none; border-radius: 5px; margin: 20px 0; }
            .footer { text-align: center; margin-top: 20px; color: #666; font-size: 12px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Welcome to Israel Visa Portal!</h1>
            </div>
            <div class="content">
              <h2>Hello ${name || 'there'}!</h2>
              <p>Thank you for registering with Israel Visa Application Portal.</p>
              <p>We're excited to help you with your visa application journey. Our platform provides:</p>
              <ul>
                <li>✓ Fast and secure application process</li>
                <li>✓ Real-time application tracking</li>
                <li>✓ Expert support 24/7</li>
                <li>✓ Document management</li>
              </ul>
              <p>Ready to start your visa application?</p>
              <a href="${process.env.FRONTEND_URL}/apply" class="button">Start Application</a>
              <p>If you have any questions, feel free to reach out to our support team.</p>
            </div>
            <div class="footer">
              <p>&copy; 2024 Israel Visa Portal. All rights reserved.</p>
            </div>
          </div>
        </body>
        </html>
      `,
    });
    console.log('Welcome email sent successfully');
  } catch (error) {
    console.error('Error sending welcome email:', error);
  }
};

// Send application confirmation email
exports.sendApplicationConfirmation = async (email, { applicationNumber, applicantName }) => {
  try {
    await transporter.sendMail({
      from: process.env.EMAIL_FROM,
      to: email,
      subject: `Application Submitted - ${applicationNumber}`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #0038B8 0%, #0052E0 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
            .app-number { font-size: 24px; font-weight: bold; color: #0038B8; text-align: center; margin: 20px 0; padding: 15px; background: white; border-radius: 5px; }
            .button { display: inline-block; padding: 12px 30px; background: #0038B8; color: white; text-decoration: none; border-radius: 5px; margin: 20px 0; }
            .footer { text-align: center; margin-top: 20px; color: #666; font-size: 12px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>✓ Application Submitted Successfully!</h1>
            </div>
            <div class="content">
              <h2>Dear ${applicantName},</h2>
              <p>Your visa application has been submitted successfully.</p>
              <div class="app-number">
                Application Number: ${applicationNumber}
              </div>
              <p><strong>What's next?</strong></p>
              <ul>
                <li>Our team will review your application within 24-48 hours</li>
                <li>You'll receive email updates on your application status</li>
                <li>Track your application status anytime from your profile</li>
              </ul>
              <p>Keep your application number safe for future reference.</p>
              <a href="${process.env.FRONTEND_URL}/profile" class="button">Track Application</a>
            </div>
            <div class="footer">
              <p>&copy; 2024 Israel Visa Portal. All rights reserved.</p>
            </div>
          </div>
        </body>
        </html>
      `,
    });
    console.log('Confirmation email sent successfully');
  } catch (error) {
    console.error('Error sending confirmation email:', error);
  }
};

// Send status update email
exports.sendStatusUpdate = async (email, { applicationNumber, applicantName, status, remarks }) => {
  const statusMessages = {
    pending: { title: 'Application Pending', color: '#FFA500', icon: '⏳' },
    under_review: { title: 'Under Review', color: '#0038B8', icon: '🔍' },
    documents_required: { title: 'Documents Required', color: '#FF6B6B', icon: '📄' },
    approved: { title: 'Application Approved', color: '#10B981', icon: '✅' },
    rejected: { title: 'Application Rejected', color: '#EF4444', icon: '❌' },
  };

  const statusInfo = statusMessages[status] || statusMessages.pending;

  try {
    await transporter.sendMail({
      from: process.env.EMAIL_FROM,
      to: email,
      subject: `${statusInfo.title} - ${applicationNumber}`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: ${statusInfo.color}; color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
            .status-badge { font-size: 48px; margin: 20px 0; }
            .remarks { background: white; padding: 15px; border-left: 4px solid ${statusInfo.color}; margin: 20px 0; }
            .button { display: inline-block; padding: 12px 30px; background: #0038B8; color: white; text-decoration: none; border-radius: 5px; margin: 20px 0; }
            .footer { text-align: center; margin-top: 20px; color: #666; font-size: 12px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <div class="status-badge">${statusInfo.icon}</div>
              <h1>${statusInfo.title}</h1>
            </div>
            <div class="content">
              <h2>Dear ${applicantName},</h2>
              <p>Your visa application <strong>${applicationNumber}</strong> status has been updated.</p>
              ${remarks ? `<div class="remarks"><strong>Remarks:</strong><br>${remarks}</div>` : ''}
              <p>You can view your full application details and track progress from your profile.</p>
              <a href="${process.env.FRONTEND_URL}/profile" class="button">View Application</a>
            </div>
            <div class="footer">
              <p>&copy; 2024 Israel Visa Portal. All rights reserved.</p>
            </div>
          </div>
        </body>
        </html>
      `,
    });
    console.log('Status update email sent successfully');
  } catch (error) {
    console.error('Error sending status update email:', error);
  }
};
