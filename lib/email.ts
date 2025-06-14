import nodemailer from 'nodemailer';

// Create transporter based on environment
const createTransporter = () => {
  if (process.env.NODE_ENV === 'production' || process.env.SMTP_HOST) {
    // Production SMTP configuration
    return nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT || '587'),
      secure: process.env.SMTP_SECURE === 'true', // true for 465, false for other ports
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });
  }
  return null; // Use console logging for development
};

const transporter = createTransporter();

export async function sendVerificationEmail(email: string, otp: string) {
  try {
    if (transporter) {
      // Production: Send real email
      await transporter.sendMail({
        from: `"${process.env.SMTP_FROM_NAME || 'TheBlog'}" <${process.env.SMTP_FROM_EMAIL || process.env.SMTP_USER}>`,
        to: email,
        subject: 'Verify your email address',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
            <div style="text-align: center; margin-bottom: 30px;">
              <h1 style="color: #333; margin: 0;">TheBlog</h1>
            </div>
            
            <div style="background-color: #f8f9fa; padding: 30px; border-radius: 8px; margin-bottom: 20px;">
              <h2 style="color: #333; margin-top: 0;">Verify your email address</h2>
              <p style="color: #666; font-size: 16px; line-height: 1.5;">
                Thank you for signing up! Please use the following verification code to complete your registration:
              </p>
              
              <div style="background-color: #fff; border: 2px dashed #007bff; padding: 20px; text-align: center; margin: 25px 0; border-radius: 8px;">
                <div style="font-size: 32px; font-weight: bold; letter-spacing: 8px; color: #007bff; font-family: 'Courier New', monospace;">
                  ${otp}
                </div>
              </div>
              
              <p style="color: #666; font-size: 14px; margin-bottom: 0;">
                This code will expire in <strong>15 minutes</strong>.
              </p>
            </div>
            
            <div style="text-align: center; color: #999; font-size: 12px;">
              <p>If you did not request this verification code, please ignore this email.</p>
              <p>© 2025 TheBlog. All rights reserved.</p>
            </div>
          </div>
        `,
      });
      console.log('✅ Verification email sent successfully to:', email);
    } else {
      // Development: Log to console
      console.log('\n🔐 EMAIL VERIFICATION CODE 🔐');
      console.log('================================');
      console.log(`Email: ${email}`);
      console.log(`Verification Code: ${otp}`);
      console.log('================================\n');
    }
  } catch (error) {
    console.error('❌ Error sending verification email:', error);
    throw new Error('Failed to send verification email');
  }
}

export async function sendPasswordResetEmail(email: string, otp: string) {
  try {
    if (transporter) {
      // Production: Send real email
      await transporter.sendMail({
        from: `"${process.env.SMTP_FROM_NAME || 'TheBlog'}" <${process.env.SMTP_FROM_EMAIL || process.env.SMTP_USER}>`,
        to: email,
        subject: 'Reset your password',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
            <div style="text-align: center; margin-bottom: 30px;">
              <h1 style="color: #333; margin: 0;">TheBlog</h1>
            </div>
            
            <div style="background-color: #f8f9fa; padding: 30px; border-radius: 8px; margin-bottom: 20px;">
              <h2 style="color: #333; margin-top: 0;">Reset your password</h2>
              <p style="color: #666; font-size: 16px; line-height: 1.5;">
                You have requested to reset your password. Please use the following code to proceed:
              </p>
              
              <div style="background-color: #fff; border: 2px dashed #dc3545; padding: 20px; text-align: center; margin: 25px 0; border-radius: 8px;">
                <div style="font-size: 32px; font-weight: bold; letter-spacing: 8px; color: #dc3545; font-family: 'Courier New', monospace;">
                  ${otp}
                </div>
              </div>
              
              <p style="color: #666; font-size: 14px; margin-bottom: 0;">
                This code will expire in <strong>15 minutes</strong>.
              </p>
            </div>
            
            <div style="text-align: center; color: #999; font-size: 12px;">
              <p>If you did not request this password reset, please ignore this email.</p>
              <p>© 2025 TheBlog. All rights reserved.</p>
            </div>
          </div>
        `,
      });
      console.log('✅ Password reset email sent successfully to:', email);
    } else {
      // Development: Log to console
      console.log('\n🔑 PASSWORD RESET CODE 🔑');
      console.log('============================');
      console.log(`Email: ${email}`);
      console.log(`Reset Code: ${otp}`);
      console.log('============================\n');
    }
  } catch (error) {
    console.error('❌ Error sending password reset email:', error);
    throw new Error('Failed to send password reset email');
  }
} 