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
        subject: '✨ Verify your TheBlog account',
        html: `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Verify Your Email - TheBlog</title>
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
    </style>
</head>
<body style="margin: 0; padding: 0; background-color: #f8fafc; font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6;">
    <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background-color: #f8fafc;">
        <tr>
            <td align="center" style="padding: 40px 20px;">
                <!-- Main Container -->
                <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="600" style="max-width: 600px; background-color: #ffffff; border-radius: 16px; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06); overflow: hidden; border: 1px solid #e2e8f0;">
                    
                    <!-- Header -->
                    <tr>
                        <td style="background-color: #ffffff; padding: 48px 40px 32px 40px; text-align: center; border-bottom: 1px solid #f1f5f9;">
                            <!-- Logo -->
                            <div style="margin-bottom: 32px;">
                                <img src="${process.env.NEXTAUTH_URL || 'https://www.ourlab.fun'}/images/ourlabfun-forlight-transparent.png" alt="TheBlog" style="height: 48px; width: auto; max-width: 200px;" />
                            </div>
                            
                            <h1 style="color: #0f172a; font-size: 28px; font-weight: 700; margin: 0 0 12px 0; letter-spacing: -0.025em;">
                                Welcome to TheBlog! 👋
                            </h1>
                            <p style="color: #64748b; font-size: 16px; margin: 0; font-weight: 500;">
                                Let's verify your email to get started
                            </p>
                        </td>
                    </tr>
                    
                    <!-- Main Content -->
                    <tr>
                        <td style="padding: 48px 40px;">
                            <div style="text-align: center; margin-bottom: 40px;">
                                <h2 style="color: #1e293b; font-size: 24px; font-weight: 600; margin: 0 0 16px 0;">
                                    Verify Your Email Address
                                </h2>
                                <p style="color: #475569; font-size: 16px; line-height: 1.6; margin: 0;">
                                    Thanks for joining our community! Please use the verification code below to complete your account setup.
                                </p>
                            </div>
                            
                            <!-- Verification Code Box -->
                            <div style="background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%); border: 2px solid #e2e8f0; border-radius: 12px; padding: 32px; text-align: center; margin: 32px 0;">
                                <div style="margin-bottom: 16px;">
                                    <div style="display: inline-flex; align-items: center; justify-content: center; width: 48px; height: 48px; background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%); border-radius: 12px; margin-bottom: 16px;">
                                        <span style="color: white; font-size: 20px;">🔐</span>
                                    </div>
                                </div>
                                
                                <p style="color: #374151; font-size: 14px; font-weight: 600; margin: 0 0 16px 0; text-transform: uppercase; letter-spacing: 1px;">
                                    Your Verification Code
                                </p>
                                
                                <div style="background: #ffffff; border: 2px solid #e5e7eb; border-radius: 8px; padding: 20px; margin: 16px 0; display: inline-block;">
                                    <span style="color: #1f2937; font-size: 32px; font-weight: 800; letter-spacing: 8px; font-family: 'Courier New', monospace;">
                                        ${otp}
                                    </span>
                                </div>
                                
                                <p style="color: #6b7280; font-size: 14px; margin: 16px 0 0 0; font-weight: 500;">
                                    ⏰ Expires in 15 minutes
                                </p>
                            </div>
                            
                            <!-- Instructions -->
                            <div style="background: #f0f9ff; border-left: 4px solid #3b82f6; padding: 24px; border-radius: 8px; margin: 32px 0;">
                                <h3 style="color: #1e293b; font-size: 16px; font-weight: 600; margin: 0 0 12px 0;">
                                    📋 How to verify:
                                </h3>
                                <ol style="color: #475569; font-size: 14px; line-height: 1.6; margin: 0; padding-left: 20px;">
                                    <li style="margin-bottom: 8px;">Return to the verification page</li>
                                    <li style="margin-bottom: 8px;">Enter the 6-digit code above</li>
                                    <li style="margin-bottom: 0;">Click "Verify Email" to complete setup</li>
                                </ol>
                            </div>
                            
                            <!-- CTA Button -->
                            <div style="text-align: center; margin: 40px 0;">
                                <a href="${process.env.NEXTAUTH_URL || 'https://www.ourlab.fun'}/verify-email?code=${otp}&email=${encodeURIComponent(email)}"
                                   style="display: inline-block; background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%); color: #ffffff; text-decoration: none; padding: 16px 32px; border-radius: 8px; font-weight: 600; font-size: 16px; box-shadow: 0 4px 6px -1px rgba(59, 130, 246, 0.5); transition: all 0.2s;">
                                    ✨ Verify My Account
                                </a>
                            </div>
                            
                            <!-- Alternative Link -->
                            <div style="text-align: center; margin: 24px 0;">
                                <p style="color: #6b7280; font-size: 13px; margin: 0 0 8px 0;">
                                    Can't click the button? Copy this link:
                                </p>
                                <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 6px; padding: 12px; font-family: monospace; font-size: 12px; color: #3b82f6; word-break: break-all;">
                                    ${process.env.NEXTAUTH_URL || 'https://www.ourlab.fun'}/verify-email?code=${otp}&email=${encodeURIComponent(email)}
                                </div>
                            </div>
                        </td>
                    </tr>
                    
                    <!-- Footer -->
                    <tr>
                        <td style="background: #f8fafc; padding: 32px 40px; border-top: 1px solid #e2e8f0; text-align: center;">
                            <div style="margin-bottom: 20px;">
                                <img src="${process.env.NEXTAUTH_URL || 'https://www.ourlab.fun'}/images/ourlabfun-forlight-transparent.png" alt="TheBlog" style="height: 32px; width: auto; opacity: 0.7;" />
                            </div>
                            
                            <p style="color: #6b7280; font-size: 14px; margin: 0 0 16px 0; line-height: 1.5;">
                                If you didn't create an account, you can safely ignore this email.
                            </p>
                            
                            <div style="border-top: 1px solid #e2e8f0; padding-top: 20px; margin-top: 20px;">
                                <p style="color: #9ca3af; font-size: 12px; margin: 0 0 8px 0;">
                                    © ${new Date().getFullYear()} TheBlog - Share your thoughts with the world
                                </p>
                                <p style="color: #9ca3af; font-size: 12px; margin: 0;">
                                    This email was sent to ${email}
                                </p>
                            </div>
                            
                            <!-- Social Links -->
                            <div style="margin-top: 24px;">
                                <a href="https://www.facebook.com/ourlab.fun/" style="display: inline-block; margin: 0 8px; padding: 8px 16px; background: #1877f2; color: white; text-decoration: none; border-radius: 6px; font-size: 12px; font-weight: 500;">
                                    Facebook
                                </a>
                                <a href="mailto:info@ourlab.fun" style="display: inline-block; margin: 0 8px; padding: 8px 16px; background: #6b7280; color: white; text-decoration: none; border-radius: 6px; font-size: 12px; font-weight: 500;">
                                    Contact
                                </a>
                            </div>
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
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
    </style>
</head>
<body style="margin: 0; padding: 0; background-color: #f8fafc; font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6;">
    <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background-color: #f8fafc;">
        <tr>
            <td align="center" style="padding: 40px 20px;">
                <!-- Main Container -->
                <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="600" style="max-width: 600px; background-color: #ffffff; border-radius: 16px; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06); overflow: hidden; border: 1px solid #e2e8f0;">
                    
                    <!-- Header -->
                    <tr>
                        <td style="background-color: #ffffff; padding: 48px 40px 32px 40px; text-align: center; border-bottom: 1px solid #f1f5f9;">
                            <!-- Logo -->
                            <div style="margin-bottom: 32px;">
                                <img src="${process.env.NEXTAUTH_URL || 'https://www.ourlab.fun'}/images/ourlabfun-forlight-transparent.png" alt="TheBlog" style="height: 48px; width: auto; max-width: 200px;" />
                            </div>
                            
                            <h1 style="color: #0f172a; font-size: 28px; font-weight: 700; margin: 0 0 12px 0; letter-spacing: -0.025em;">
                                Password Reset Request 🔐
                            </h1>
                            <p style="color: #64748b; font-size: 16px; margin: 0; font-weight: 500;">
                                Let's get you back into your account
                            </p>
                        </td>
                    </tr>
                    
                    <!-- Main Content -->
                    <tr>
                        <td style="padding: 48px 40px;">
                            <div style="text-align: center; margin-bottom: 40px;">
                                <h2 style="color: #1e293b; font-size: 24px; font-weight: 600; margin: 0 0 16px 0;">
                                    Reset Your Password
                                </h2>
                                <p style="color: #475569; font-size: 16px; line-height: 1.6; margin: 0;">
                                    We received a request to reset your password. Use the code below to create a new secure password.
                                </p>
                            </div>
                            
                            <!-- Reset Code Box -->
                            <div style="background: linear-gradient(135deg, #fef2f2 0%, #fef7f7 100%); border: 2px solid #fecaca; border-radius: 12px; padding: 32px; text-align: center; margin: 32px 0;">
                                <div style="margin-bottom: 16px;">
                                    <div style="display: inline-flex; align-items: center; justify-content: center; width: 48px; height: 48px; background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%); border-radius: 12px; margin-bottom: 16px;">
                                        <span style="color: white; font-size: 20px;">🔑</span>
                                    </div>
                                </div>
                                
                                <p style="color: #374151; font-size: 14px; font-weight: 600; margin: 0 0 16px 0; text-transform: uppercase; letter-spacing: 1px;">
                                    Your Reset Code
                                </p>
                                
                                <div style="background: #ffffff; border: 2px solid #e5e7eb; border-radius: 8px; padding: 20px; margin: 16px 0; display: inline-block;">
                                    <span style="color: #1f2937; font-size: 32px; font-weight: 800; letter-spacing: 8px; font-family: 'Courier New', monospace;">
                                        ${otp}
                                    </span>
                                </div>
                                
                                <p style="color: #6b7280; font-size: 14px; margin: 16px 0 0 0; font-weight: 500;">
                                    ⏰ Expires in 15 minutes
                                </p>
                            </div>
                            
                            <!-- Instructions -->
                            <div style="background: #fff7ed; border-left: 4px solid #f97316; padding: 24px; border-radius: 8px; margin: 32px 0;">
                                <h3 style="color: #1e293b; font-size: 16px; font-weight: 600; margin: 0 0 12px 0;">
                                    🔐 How to reset your password:
                                </h3>
                                <ol style="color: #475569; font-size: 14px; line-height: 1.6; margin: 0; padding-left: 20px;">
                                    <li style="margin-bottom: 8px;">Go to the password reset page</li>
                                    <li style="margin-bottom: 8px;">Enter the 6-digit code above</li>
                                    <li style="margin-bottom: 0;">Create your new secure password</li>
                                </ol>
                            </div>
                            
                            <!-- Security Notice -->
                            <div style="background: #fef2f2; border: 1px solid #fecaca; border-radius: 8px; padding: 20px; margin: 24px 0;">
                                <div style="display: flex; align-items: flex-start; gap: 12px;">
                                    <div style="flex-shrink: 0; width: 20px; height: 20px; background: #ef4444; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin-top: 2px;">
                                        <span style="color: white; font-size: 12px; font-weight: bold;">!</span>
                                    </div>
                                    <div>
                                        <p style="color: #dc2626; font-size: 14px; margin: 0; font-weight: 600; margin-bottom: 4px;">
                                            Security Notice
                                        </p>
                                        <p style="color: #7f1d1d; font-size: 13px; margin: 0; line-height: 1.5;">
                                            If you didn't request this password reset, please ignore this email and consider changing your password as a precaution.
                                        </p>
                                    </div>
                                </div>
                            </div>
                            
                            <!-- CTA Button -->
                            <div style="text-align: center; margin: 40px 0;">
                                <a href="${process.env.NEXTAUTH_URL || 'https://www.ourlab.fun'}/forgot-password"
                                   style="display: inline-block; background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%); color: #ffffff; text-decoration: none; padding: 16px 32px; border-radius: 8px; font-weight: 600; font-size: 16px; box-shadow: 0 4px 6px -1px rgba(239, 68, 68, 0.5); transition: all 0.2s;">
                                    🔑 Reset My Password
                                </a>
                            </div>
                            
                            <!-- Alternative Link -->
                            <div style="text-align: center; margin: 24px 0;">
                                <p style="color: #6b7280; font-size: 13px; margin: 0 0 8px 0;">
                                    Can't click the button? Copy this link:
                                </p>
                                <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 6px; padding: 12px; font-family: monospace; font-size: 12px; color: #ef4444; word-break: break-all;">
                                    ${process.env.NEXTAUTH_URL || 'https://www.ourlab.fun'}/forgot-password
                                </div>
                            </div>
                        </td>
                    </tr>
                    
                    <!-- Footer -->
                    <tr>
                        <td style="background: #f8fafc; padding: 32px 40px; border-top: 1px solid #e2e8f0; text-align: center;">
                            <div style="margin-bottom: 20px;">
                                <img src="${process.env.NEXTAUTH_URL || 'https://www.ourlab.fun'}/images/ourlabfun-forlight-transparent.png" alt="TheBlog" style="height: 32px; width: auto; opacity: 0.7;" />
                            </div>
                            
                            <p style="color: #6b7280; font-size: 14px; margin: 0 0 16px 0; line-height: 1.5;">
                                This password reset request was made for ${email}
                            </p>
                            
                            <div style="border-top: 1px solid #e2e8f0; padding-top: 20px; margin-top: 20px;">
                                <p style="color: #9ca3af; font-size: 12px; margin: 0 0 8px 0;">
                                    © ${new Date().getFullYear()} TheBlog - Share your thoughts with the world
                                </p>
                                <p style="color: #9ca3af; font-size: 12px; margin: 0;">
                                    For security reasons, this email cannot be replied to.
                                </p>
                            </div>
                            
                            <!-- Support Links -->
                            <div style="margin-top: 24px;">
                                <a href="mailto:info@ourlab.fun" style="display: inline-block; margin: 0 8px; padding: 8px 16px; background: #6b7280; color: white; text-decoration: none; border-radius: 6px; font-size: 12px; font-weight: 500;">
                                    Contact Support
                                </a>
                                <a href="https://www.facebook.com/ourlab.fun/" style="display: inline-block; margin: 0 8px; padding: 8px 16px; background: #1877f2; color: white; text-decoration: none; border-radius: 6px; font-size: 12px; font-weight: 500;">
                                    Facebook
                                </a>
                            </div>
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