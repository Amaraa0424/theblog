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
        subject: '🔐 Verify your TheBlog account',
        html: `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Verify Your Email - TheBlog</title>
    <!--[if mso]>
    <noscript>
        <xml>
            <o:OfficeDocumentSettings>
                <o:PixelsPerInch>96</o:PixelsPerInch>
            </o:OfficeDocumentSettings>
        </xml>
    </noscript>
    <![endif]-->
</head>
<body style="margin: 0; padding: 0; background-color: #f8fafc; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;">
    <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background-color: #f8fafc;">
        <tr>
            <td align="center" style="padding: 40px 20px;">
                <!-- Main Container -->
                <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="600" style="max-width: 600px; background-color: #ffffff; border-radius: 16px; box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1); overflow: hidden;">
                    
                    <!-- Header with Gradient -->
                    <tr>
                        <td style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px 30px; text-align: center;">
                            <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                                <tr>
                                    <td align="center">
                                        <!-- Logo/Icon -->
                                        <div style="width: 80px; height: 80px; background-color: rgba(255, 255, 255, 0.2); border-radius: 50%; display: inline-flex; align-items: center; justify-content: center; margin-bottom: 20px; backdrop-filter: blur(10px);">
                                            <div style="width: 40px; height: 40px; background-color: #ffffff; border-radius: 8px; position: relative;">
                                                <div style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); width: 24px; height: 24px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); border-radius: 4px;"></div>
                                            </div>
                                        </div>
                                        
                                        <h1 style="color: #ffffff; font-size: 32px; font-weight: 700; margin: 0; text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);">
                                            TheBlog
                                        </h1>
                                        <p style="color: rgba(255, 255, 255, 0.9); font-size: 16px; margin: 8px 0 0 0; font-weight: 400;">
                                            Welcome to our community
                                        </p>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                    
                    <!-- Main Content -->
                    <tr>
                        <td style="padding: 50px 40px;">
                            <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                                <tr>
                                    <td>
                                        <h2 style="color: #1a202c; font-size: 28px; font-weight: 600; margin: 0 0 16px 0; text-align: center;">
                                            Verify Your Email Address
                                        </h2>
                                        
                                        <p style="color: #4a5568; font-size: 16px; line-height: 1.6; margin: 0 0 32px 0; text-align: center;">
                                            Thank you for joining TheBlog! We're excited to have you on board. 
                                            Please verify your email address to complete your account setup and start sharing your amazing content.
                                        </p>
                                        
                                        <!-- Verification Code Box -->
                                        <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="margin: 40px 0;">
                                            <tr>
                                                <td align="center">
                                                    <div style="background: linear-gradient(135deg, #f7fafc 0%, #edf2f7 100%); border: 2px solid #e2e8f0; border-radius: 12px; padding: 30px; text-align: center; position: relative; overflow: hidden;">
                                                        <!-- Decorative elements -->
                                                        <div style="position: absolute; top: -20px; right: -20px; width: 40px; height: 40px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); border-radius: 50%; opacity: 0.1;"></div>
                                                        <div style="position: absolute; bottom: -15px; left: -15px; width: 30px; height: 30px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); border-radius: 50%; opacity: 0.1;"></div>
                                                        
                                                        <p style="color: #2d3748; font-size: 14px; font-weight: 600; margin: 0 0 16px 0; text-transform: uppercase; letter-spacing: 1px;">
                                                            Your Verification Code
                                                        </p>
                                                        
                                                        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; font-size: 48px; font-weight: 800; letter-spacing: 8px; font-family: 'Courier New', monospace; margin: 16px 0; text-align: center; line-height: 1.2;">
                                                            ${otp}
                                                        </div>
                                                        
                                                        <p style="color: #718096; font-size: 13px; margin: 16px 0 0 0; font-weight: 500;">
                                                            ⏰ This code expires in <strong style="color: #e53e3e;">15 minutes</strong>
                                                        </p>
                                                    </div>
                                                </td>
                                            </tr>
                                        </table>
                                        
                                        <!-- Instructions -->
                                        <div style="background-color: #f7fafc; border-left: 4px solid #667eea; padding: 20px; border-radius: 8px; margin: 32px 0;">
                                            <h3 style="color: #2d3748; font-size: 16px; font-weight: 600; margin: 0 0 12px 0;">
                                                📝 How to verify:
                                            </h3>
                                            <ol style="color: #4a5568; font-size: 14px; line-height: 1.6; margin: 0; padding-left: 20px;">
                                                <li style="margin-bottom: 8px;">Go back to the TheBlog verification page</li>
                                                <li style="margin-bottom: 8px;">Enter the 6-digit code above</li>
                                                <li style="margin-bottom: 0;">Click "Verify" to complete your account setup</li>
                                            </ol>
                                        </div>
                                        
                                        <!-- CTA Button -->
                                        <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="margin: 40px 0;">
                                            <tr>
                                                <td align="center">
                                                    <a href="${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/verify-email?code=${otp}&email=${encodeURIComponent(email)}" 
                                                       style="display: inline-block; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: #ffffff; text-decoration: none; padding: 16px 32px; border-radius: 8px; font-weight: 600; font-size: 16px; box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4); transition: all 0.3s ease;">
                                                        🚀 Verify My Account
                                                    </a>
                                                </td>
                                            </tr>
                                        </table>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                    
                    <!-- Footer -->
                    <tr>
                        <td style="background-color: #f7fafc; padding: 30px 40px; border-top: 1px solid #e2e8f0;">
                            <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                                <tr>
                                    <td align="center">
                                        <p style="color: #718096; font-size: 14px; margin: 0 0 16px 0; line-height: 1.5;">
                                            If you didn't create an account with TheBlog, you can safely ignore this email.
                                        </p>
                                        
                                        <div style="border-top: 1px solid #e2e8f0; padding-top: 20px; margin-top: 20px;">
                                            <p style="color: #a0aec0; font-size: 12px; margin: 0; line-height: 1.4;">
                                                © ${new Date().getFullYear()} TheBlog. All rights reserved.<br>
                                                This email was sent to <strong>${email}</strong>
                                            </p>
                                        </div>
                                        
                                        <!-- Social Links (Optional) -->
                                        <div style="margin-top: 20px;">
                                            <p style="color: #a0aec0; font-size: 12px; margin: 0 0 8px 0;">
                                                Follow us for updates and tips:
                                            </p>
                                            <div style="text-align: center;">
                                                <span style="color: #718096; font-size: 12px;">🌐 TheBlog Community</span>
                                            </div>
                                        </div>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>
</html>
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
        subject: '🔑 Reset your TheBlog password',
        html: `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Reset Your Password - TheBlog</title>
    <!--[if mso]>
    <noscript>
        <xml>
            <o:OfficeDocumentSettings>
                <o:PixelsPerInch>96</o:PixelsPerInch>
            </o:OfficeDocumentSettings>
        </xml>
    </noscript>
    <![endif]-->
</head>
<body style="margin: 0; padding: 0; background-color: #f8fafc; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;">
    <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background-color: #f8fafc;">
        <tr>
            <td align="center" style="padding: 40px 20px;">
                <!-- Main Container -->
                <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="600" style="max-width: 600px; background-color: #ffffff; border-radius: 16px; box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1); overflow: hidden;">
                    
                    <!-- Header with Gradient -->
                    <tr>
                        <td style="background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%); padding: 40px 30px; text-align: center;">
                            <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                                <tr>
                                    <td align="center">
                                        <!-- Logo/Icon -->
                                        <div style="width: 80px; height: 80px; background-color: rgba(255, 255, 255, 0.2); border-radius: 50%; display: inline-flex; align-items: center; justify-content: center; margin-bottom: 20px; backdrop-filter: blur(10px);">
                                            <div style="width: 40px; height: 40px; background-color: #ffffff; border-radius: 8px; position: relative;">
                                                <div style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); width: 24px; height: 24px; background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%); border-radius: 4px;"></div>
                                            </div>
                                        </div>
                                        
                                        <h1 style="color: #ffffff; font-size: 32px; font-weight: 700; margin: 0; text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);">
                                            TheBlog
                                        </h1>
                                        <p style="color: rgba(255, 255, 255, 0.9); font-size: 16px; margin: 8px 0 0 0; font-weight: 400;">
                                            Password Reset Request
                                        </p>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                    
                    <!-- Main Content -->
                    <tr>
                        <td style="padding: 50px 40px;">
                            <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                                <tr>
                                    <td>
                                        <h2 style="color: #1a202c; font-size: 28px; font-weight: 600; margin: 0 0 16px 0; text-align: center;">
                                            Reset Your Password
                                        </h2>
                                        
                                        <p style="color: #4a5568; font-size: 16px; line-height: 1.6; margin: 0 0 32px 0; text-align: center;">
                                            We received a request to reset your password for your TheBlog account. 
                                            Use the verification code below to proceed with resetting your password.
                                        </p>
                                        
                                        <!-- Verification Code Box -->
                                        <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="margin: 40px 0;">
                                            <tr>
                                                <td align="center">
                                                    <div style="background: linear-gradient(135deg, #fef5e7 0%, #fed7d7 100%); border: 2px solid #feb2b2; border-radius: 12px; padding: 30px; text-align: center; position: relative; overflow: hidden;">
                                                        <!-- Decorative elements -->
                                                        <div style="position: absolute; top: -20px; right: -20px; width: 40px; height: 40px; background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%); border-radius: 50%; opacity: 0.1;"></div>
                                                        <div style="position: absolute; bottom: -15px; left: -15px; width: 30px; height: 30px; background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%); border-radius: 50%; opacity: 0.1;"></div>
                                                        
                                                        <p style="color: #2d3748; font-size: 14px; font-weight: 600; margin: 0 0 16px 0; text-transform: uppercase; letter-spacing: 1px;">
                                                            Your Reset Code
                                                        </p>
                                                        
                                                        <div style="background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; font-size: 48px; font-weight: 800; letter-spacing: 8px; font-family: 'Courier New', monospace; margin: 16px 0; text-align: center; line-height: 1.2;">
                                                            ${otp}
                                                        </div>
                                                        
                                                        <p style="color: #718096; font-size: 13px; margin: 16px 0 0 0; font-weight: 500;">
                                                            ⏰ This code expires in <strong style="color: #e53e3e;">15 minutes</strong>
                                                        </p>
                                                    </div>
                                                </td>
                                            </tr>
                                        </table>
                                        
                                        <!-- Instructions -->
                                        <div style="background-color: #fef5e7; border-left: 4px solid #f093fb; padding: 20px; border-radius: 8px; margin: 32px 0;">
                                            <h3 style="color: #2d3748; font-size: 16px; font-weight: 600; margin: 0 0 12px 0;">
                                                🔐 How to reset your password:
                                            </h3>
                                            <ol style="color: #4a5568; font-size: 14px; line-height: 1.6; margin: 0; padding-left: 20px;">
                                                <li style="margin-bottom: 8px;">Go to the TheBlog password reset page</li>
                                                <li style="margin-bottom: 8px;">Enter the 6-digit code above</li>
                                                <li style="margin-bottom: 0;">Create your new secure password</li>
                                            </ol>
                                        </div>
                                        
                                        <!-- Security Notice -->
                                        <div style="background-color: #fff5f5; border: 1px solid #fed7d7; border-radius: 8px; padding: 16px; margin: 24px 0;">
                                            <p style="color: #c53030; font-size: 14px; margin: 0; font-weight: 500;">
                                                🛡️ <strong>Security Notice:</strong> If you didn't request this password reset, please ignore this email and consider changing your password as a precaution.
                                            </p>
                                        </div>
                                        
                                        <!-- CTA Button -->
                                        <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="margin: 40px 0;">
                                            <tr>
                                                <td align="center">
                                                    <a href="${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/forgot-password" 
                                                       style="display: inline-block; background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%); color: #ffffff; text-decoration: none; padding: 16px 32px; border-radius: 8px; font-weight: 600; font-size: 16px; box-shadow: 0 4px 12px rgba(240, 147, 251, 0.4); transition: all 0.3s ease;">
                                                        🔑 Reset My Password
                                                    </a>
                                                </td>
                                            </tr>
                                        </table>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                    
                    <!-- Footer -->
                    <tr>
                        <td style="background-color: #f7fafc; padding: 30px 40px; border-top: 1px solid #e2e8f0;">
                            <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                                <tr>
                                    <td align="center">
                                        <p style="color: #718096; font-size: 14px; margin: 0 0 16px 0; line-height: 1.5;">
                                            This password reset request was made for the account associated with <strong>${email}</strong>
                                        </p>
                                        
                                        <div style="border-top: 1px solid #e2e8f0; padding-top: 20px; margin-top: 20px;">
                                            <p style="color: #a0aec0; font-size: 12px; margin: 0; line-height: 1.4;">
                                                © ${new Date().getFullYear()} TheBlog. All rights reserved.<br>
                                                For security reasons, this email cannot be replied to.
                                            </p>
                                        </div>
                                        
                                        <!-- Support Info -->
                                        <div style="margin-top: 20px;">
                                            <p style="color: #a0aec0; font-size: 12px; margin: 0 0 8px 0;">
                                                Need help? Contact our support team:
                                            </p>
                                            <div style="text-align: center;">
                                                <span style="color: #718096; font-size: 12px;">📧 TheBlog Support</span>
                                            </div>
                                        </div>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>
</html>
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