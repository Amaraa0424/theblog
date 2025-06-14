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
        from: `"${process.env.SMTP_FROM_NAME || 'OurLab.fun'}" <${process.env.SMTP_FROM_EMAIL || process.env.SMTP_USER}>`,
      to: email,
        subject: '🔐 Verify your OurLab.fun account',
      html: `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Verify Your Email - OurLab.fun</title>
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
<body style="margin: 0; padding: 0; background-color: #0f0f23; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;">
    <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background: linear-gradient(135deg, #0f0f23 0%, #1a1a3e 50%, #0f0f23 100%);">
        <tr>
            <td align="center" style="padding: 40px 20px;">
                <!-- Main Container -->
                <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="600" style="max-width: 600px; background-color: #ffffff; border-radius: 20px; box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3); overflow: hidden; border: 1px solid #e2e8f0;">
                    
                    <!-- Header with Brand Logo -->
                    <tr>
                        <td style="background: linear-gradient(135deg, #3b82f6 0%, #8b5cf6 50%, #06b6d4 100%); padding: 50px 40px; text-align: center; position: relative;">
                            <!-- Decorative elements -->
                            <div style="position: absolute; top: -20px; right: -20px; width: 100px; height: 100px; background: rgba(255, 255, 255, 0.1); border-radius: 50%; opacity: 0.5;"></div>
                            <div style="position: absolute; bottom: -30px; left: -30px; width: 80px; height: 80px; background: rgba(255, 255, 255, 0.1); border-radius: 50%; opacity: 0.3;"></div>
                            
                            <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                                <tr>
                                    <td align="center">
                                        <!-- OurLab.fun Logo -->
                                        <div style="margin-bottom: 30px;">
                                            <img src="https://ourlab.fun/images/ourlabfun-forlight-bg.png" alt="OurLab.fun" style="height: 80px; width: auto; max-width: 280px; object-fit: contain;" />
            </div>
            
                                        <h1 style="color: #ffffff; font-size: 36px; font-weight: 800; margin: 0; text-shadow: 0 4px 8px rgba(0, 0, 0, 0.2); letter-spacing: -0.5px;">
                                            Welcome to OurLab.fun!
                                        </h1>
                                        <p style="color: rgba(255, 255, 255, 0.95); font-size: 18px; margin: 12px 0 0 0; font-weight: 500;">
                                            Your journey to amazing content starts here
                                        </p>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                    
                    <!-- Main Content -->
                    <tr>
                        <td style="padding: 60px 50px;">
                            <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                                <tr>
                                    <td>
                                        <h2 style="color: #1e293b; font-size: 32px; font-weight: 700; margin: 0 0 20px 0; text-align: center; line-height: 1.2;">
                                            Verify Your Email Address
                                        </h2>
                                        
                                        <p style="color: #475569; font-size: 18px; line-height: 1.7; margin: 0 0 40px 0; text-align: center;">
                                            Thank you for joining our amazing community! We're thrilled to have you on board. 
                                            Please verify your email address to unlock all features and start sharing your incredible ideas.
                                        </p>
                                        
                                        <!-- Verification Code Box -->
                                        <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="margin: 50px 0;">
                                            <tr>
                                                <td align="center">
                                                    <div style="background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%); border: 3px solid #e2e8f0; border-radius: 16px; padding: 40px; text-align: center; position: relative; overflow: hidden; box-shadow: 0 10px 25px rgba(0, 0, 0, 0.08);">
                                                        <!-- Decorative gradient overlay -->
                                                        <div style="position: absolute; top: 0; left: 0; right: 0; height: 4px; background: linear-gradient(90deg, #3b82f6, #8b5cf6, #06b6d4);"></div>
                                                        
                                                        <!-- Floating decorative elements -->
                                                        <div style="position: absolute; top: 15px; right: 20px; width: 30px; height: 30px; background: linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%); border-radius: 50%; opacity: 0.15;"></div>
                                                        <div style="position: absolute; bottom: 15px; left: 20px; width: 25px; height: 25px; background: linear-gradient(135deg, #8b5cf6 0%, #06b6d4 100%); border-radius: 50%; opacity: 0.15;"></div>
                                                        
                                                        <div style="margin-bottom: 20px;">
                                                            <div style="display: inline-block; background: linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%); padding: 12px; border-radius: 12px; margin-bottom: 16px;">
                                                                <div style="width: 24px; height: 24px; background: white; border-radius: 6px; position: relative;">
                                                                    <div style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); width: 12px; height: 12px; background: linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%); border-radius: 3px;"></div>
                                                                </div>
          </div>
              </div>
              
                                                        <p style="color: #374151; font-size: 16px; font-weight: 700; margin: 0 0 20px 0; text-transform: uppercase; letter-spacing: 2px;">
                                                            Your Verification Code
                                                        </p>
                                                        
                                                        <div style="background: linear-gradient(135deg, #3b82f6 0%, #8b5cf6 50%, #06b6d4 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; font-size: 56px; font-weight: 900; letter-spacing: 12px; font-family: 'Courier New', monospace; margin: 24px 0; text-align: center; line-height: 1.1; text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);">
                                                            ${otp}
                                                        </div>
                                                        
                                                        <p style="color: #6b7280; font-size: 14px; margin: 20px 0 0 0; font-weight: 600;">
                                                            ⏰ This code expires in <strong style="color: #dc2626;">15 minutes</strong>
                                                        </p>
                                                    </div>
                                                </td>
                                            </tr>
                                        </table>
                                        
                                        <!-- Instructions -->
                                        <div style="background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%); border-left: 5px solid #3b82f6; padding: 30px; border-radius: 12px; margin: 40px 0; box-shadow: 0 4px 12px rgba(59, 130, 246, 0.1);">
                                            <h3 style="color: #1e293b; font-size: 18px; font-weight: 700; margin: 0 0 16px 0; display: flex; align-items: center;">
                                                <span style="display: inline-block; width: 24px; height: 24px; background: linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%); border-radius: 50%; margin-right: 12px; position: relative;">
                                                    <span style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); color: white; font-size: 12px; font-weight: bold;">✓</span>
                                                </span>
                                                How to verify your account:
                                            </h3>
                                            <ol style="color: #475569; font-size: 16px; line-height: 1.8; margin: 0; padding-left: 24px;">
                                                <li style="margin-bottom: 12px; font-weight: 500;">Go back to the OurLab.fun verification page</li>
                                                <li style="margin-bottom: 12px; font-weight: 500;">Enter the 6-digit code above</li>
                                                <li style="margin-bottom: 0; font-weight: 500;">Click "Verify" to complete your account setup</li>
                                            </ol>
                                        </div>
                                        
                                        <!-- CTA Button -->
                                        <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="margin: 50px 0;">
                                            <tr>
                                                <td align="center">
                                                    <a href="${process.env.NEXTAUTH_URL || 'https://ourlab.fun'}/verify-email?code=${otp}&email=${encodeURIComponent(email)}"
                                                       style="display: inline-block; background: linear-gradient(135deg, #3b82f6 0%, #8b5cf6 50%, #06b6d4 100%); color: #ffffff; text-decoration: none; padding: 20px 40px; border-radius: 12px; font-weight: 700; font-size: 18px; box-shadow: 0 8px 20px rgba(59, 130, 246, 0.4); transition: all 0.3s ease; text-transform: uppercase; letter-spacing: 1px;">
                                                        🚀 Verify My Account Now
                                                    </a>
                                                </td>
                                            </tr>
                                        </table>
                                        
                                        <!-- Alternative verification -->
                                        <div style="text-align: center; margin: 30px 0;">
                                            <p style="color: #6b7280; font-size: 14px; margin: 0 0 10px 0;">
                                                Can't click the button? Copy and paste this link:
                                            </p>
                                            <p style="color: #3b82f6; font-size: 14px; word-break: break-all; background: #f8fafc; padding: 12px; border-radius: 8px; border: 1px solid #e2e8f0; font-family: monospace;">
                                                ${process.env.NEXTAUTH_URL || 'https://ourlab.fun'}/verify-email?code=${otp}&email=${encodeURIComponent(email)}
                                            </p>
                                        </div>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                    
                    <!-- Footer -->
                    <tr>
                        <td style="background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%); padding: 40px 50px; border-top: 1px solid #e2e8f0;">
                            <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                                <tr>
                                    <td align="center">
                                        <!-- Footer Logo -->
                                        <div style="margin-bottom: 24px;">
                                            <img src="https://ourlab.fun/images/ourlabfun-forlight-transparent.png" alt="OurLab.fun" style="height: 40px; width: auto; opacity: 0.8;" />
                                        </div>
                                        
                                        <p style="color: #6b7280; font-size: 16px; margin: 0 0 20px 0; line-height: 1.6; font-weight: 500;">
                                            If you didn't create an account with OurLab.fun, you can safely ignore this email.
                                        </p>
                                        
                                        <div style="border-top: 2px solid #e2e8f0; padding-top: 24px; margin-top: 24px;">
                                            <p style="color: #9ca3af; font-size: 14px; margin: 0 0 12px 0; line-height: 1.5;">
                                                © ${new Date().getFullYear()} OurLab.fun - Guide Me To Your World
                                            </p>
                                            <p style="color: #9ca3af; font-size: 13px; margin: 0; line-height: 1.4;">
                                                This email was sent to <strong style="color: #6b7280;">${email}</strong>
              </p>
            </div>
            
                                        <!-- Social Links -->
                                        <div style="margin-top: 30px; text-align: center;">
                                            <p style="color: #6b7280; font-size: 14px; margin: 0 0 16px 0; font-weight: 600;">
                                                Connect with us:
                                            </p>
                                            <div style="text-align: center;">
                                                <a href="https://www.facebook.com/ourlab.fun/" style="display: inline-block; margin: 0 8px; padding: 8px 16px; background: linear-gradient(135deg, #1877f2 0%, #42a5f5 100%); color: white; text-decoration: none; border-radius: 8px; font-size: 13px; font-weight: 600;">
                                                    📘 Facebook
                                                </a>
                                                <a href="mailto:info@ourlab.fun" style="display: inline-block; margin: 0 8px; padding: 8px 16px; background: linear-gradient(135deg, #6b7280 0%, #9ca3af 100%); color: white; text-decoration: none; border-radius: 8px; font-size: 13px; font-weight: 600;">
                                                    ✉️ Contact Us
                                                </a>
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
        from: `"${process.env.SMTP_FROM_NAME || 'OurLab.fun'}" <${process.env.SMTP_FROM_EMAIL || process.env.SMTP_USER}>`,
      to: email,
        subject: '🔑 Reset your OurLab.fun password',
      html: `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Reset Your Password - OurLab.fun</title>
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
<body style="margin: 0; padding: 0; background-color: #0f0f23; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;">
    <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background: linear-gradient(135deg, #0f0f23 0%, #2d1b69 50%, #0f0f23 100%);">
        <tr>
            <td align="center" style="padding: 40px 20px;">
                <!-- Main Container -->
                <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="600" style="max-width: 600px; background-color: #ffffff; border-radius: 20px; box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3); overflow: hidden; border: 1px solid #e2e8f0;">
                    
                    <!-- Header with Brand Logo -->
                    <tr>
                        <td style="background: linear-gradient(135deg, #f97316 0%, #dc2626 50%, #ec4899 100%); padding: 50px 40px; text-align: center; position: relative;">
                            <!-- Decorative elements -->
                            <div style="position: absolute; top: -20px; right: -20px; width: 100px; height: 100px; background: rgba(255, 255, 255, 0.1); border-radius: 50%; opacity: 0.5;"></div>
                            <div style="position: absolute; bottom: -30px; left: -30px; width: 80px; height: 80px; background: rgba(255, 255, 255, 0.1); border-radius: 50%; opacity: 0.3;"></div>
                            
                            <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                                <tr>
                                    <td align="center">
                                        <!-- OurLab.fun Logo -->
                                        <div style="margin-bottom: 30px;">
                                            <img src="https://ourlab.fun/images/ourlabfun-forlight-bg.png" alt="OurLab.fun" style="height: 80px; width: auto; max-width: 280px; object-fit: contain;" />
            </div>
            
                                        <h1 style="color: #ffffff; font-size: 36px; font-weight: 800; margin: 0; text-shadow: 0 4px 8px rgba(0, 0, 0, 0.2); letter-spacing: -0.5px;">
                                            Password Reset Request
                                        </h1>
                                        <p style="color: rgba(255, 255, 255, 0.95); font-size: 18px; margin: 12px 0 0 0; font-weight: 500;">
                                            Secure your account with a new password
                                        </p>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                    
                    <!-- Main Content -->
                    <tr>
                        <td style="padding: 60px 50px;">
                            <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                                <tr>
                                    <td>
                                        <h2 style="color: #1e293b; font-size: 32px; font-weight: 700; margin: 0 0 20px 0; text-align: center; line-height: 1.2;">
                                            Reset Your Password
                                        </h2>
                                        
                                        <p style="color: #475569; font-size: 18px; line-height: 1.7; margin: 0 0 40px 0; text-align: center;">
                                            We received a request to reset your password for your OurLab.fun account. 
                                            Use the verification code below to proceed with creating a new secure password.
                                        </p>
                                        
                                        <!-- Verification Code Box -->
                                        <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="margin: 50px 0;">
                                            <tr>
                                                <td align="center">
                                                    <div style="background: linear-gradient(135deg, #fef2f2 0%, #fef7f7 100%); border: 3px solid #fecaca; border-radius: 16px; padding: 40px; text-align: center; position: relative; overflow: hidden; box-shadow: 0 10px 25px rgba(220, 38, 38, 0.08);">
                                                        <!-- Decorative gradient overlay -->
                                                        <div style="position: absolute; top: 0; left: 0; right: 0; height: 4px; background: linear-gradient(90deg, #f97316, #dc2626, #ec4899);"></div>
                                                        
                                                        <!-- Floating decorative elements -->
                                                        <div style="position: absolute; top: 15px; right: 20px; width: 30px; height: 30px; background: linear-gradient(135deg, #f97316 0%, #dc2626 100%); border-radius: 50%; opacity: 0.15;"></div>
                                                        <div style="position: absolute; bottom: 15px; left: 20px; width: 25px; height: 25px; background: linear-gradient(135deg, #dc2626 0%, #ec4899 100%); border-radius: 50%; opacity: 0.15;"></div>
                                                        
                                                        <div style="margin-bottom: 20px;">
                                                            <div style="display: inline-block; background: linear-gradient(135deg, #f97316 0%, #dc2626 100%); padding: 12px; border-radius: 12px; margin-bottom: 16px;">
                                                                <div style="width: 24px; height: 24px; background: white; border-radius: 6px; position: relative;">
                                                                    <div style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); width: 12px; height: 12px; background: linear-gradient(135deg, #f97316 0%, #dc2626 100%); border-radius: 3px;"></div>
                                                                </div>
          </div>
              </div>
              
                                                        <p style="color: #374151; font-size: 16px; font-weight: 700; margin: 0 0 20px 0; text-transform: uppercase; letter-spacing: 2px;">
                                                            Your Reset Code
                                                        </p>
                                                        
                                                        <div style="background: linear-gradient(135deg, #f97316 0%, #dc2626 50%, #ec4899 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; font-size: 56px; font-weight: 900; letter-spacing: 12px; font-family: 'Courier New', monospace; margin: 24px 0; text-align: center; line-height: 1.1; text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);">
                                                            ${otp}
                                                        </div>
                                                        
                                                        <p style="color: #6b7280; font-size: 14px; margin: 20px 0 0 0; font-weight: 600;">
                                                            ⏰ This code expires in <strong style="color: #dc2626;">15 minutes</strong>
                                                        </p>
                                                    </div>
                                                </td>
                                            </tr>
                                        </table>
                                        
                                        <!-- Instructions -->
                                        <div style="background: linear-gradient(135deg, #fff7ed 0%, #fed7aa 100%); border-left: 5px solid #f97316; padding: 30px; border-radius: 12px; margin: 40px 0; box-shadow: 0 4px 12px rgba(249, 115, 22, 0.1);">
                                            <h3 style="color: #1e293b; font-size: 18px; font-weight: 700; margin: 0 0 16px 0; display: flex; align-items: center;">
                                                <span style="display: inline-block; width: 24px; height: 24px; background: linear-gradient(135deg, #f97316 0%, #dc2626 100%); border-radius: 50%; margin-right: 12px; position: relative;">
                                                    <span style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); color: white; font-size: 12px; font-weight: bold;">🔐</span>
                                                </span>
                                                How to reset your password:
                                            </h3>
                                            <ol style="color: #475569; font-size: 16px; line-height: 1.8; margin: 0; padding-left: 24px;">
                                                <li style="margin-bottom: 12px; font-weight: 500;">Go to the OurLab.fun password reset page</li>
                                                <li style="margin-bottom: 12px; font-weight: 500;">Enter the 6-digit code above</li>
                                                <li style="margin-bottom: 0; font-weight: 500;">Create your new secure password</li>
                                            </ol>
                                        </div>
                                        
                                        <!-- Security Notice -->
                                        <div style="background: linear-gradient(135deg, #fef2f2 0%, #fee2e2 100%); border: 2px solid #fecaca; border-radius: 12px; padding: 24px; margin: 32px 0; box-shadow: 0 4px 12px rgba(220, 38, 38, 0.1);">
                                            <div style="display: flex; align-items: flex-start; gap: 12px;">
                                                <div style="flex-shrink: 0; width: 24px; height: 24px; background: linear-gradient(135deg, #dc2626 0%, #b91c1c 100%); border-radius: 50%; display: flex; align-items: center; justify-content: center; margin-top: 2px;">
                                                    <span style="color: white; font-size: 12px; font-weight: bold;">!</span>
                                                </div>
                                                <div>
                                                    <p style="color: #dc2626; font-size: 16px; margin: 0; font-weight: 700; margin-bottom: 8px;">
                                                        Security Notice
                                                    </p>
                                                    <p style="color: #7f1d1d; font-size: 14px; margin: 0; line-height: 1.6;">
                                                        If you didn't request this password reset, please ignore this email and consider changing your password as a precaution. Your account security is important to us.
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                        
                                        <!-- CTA Button -->
                                        <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="margin: 50px 0;">
                                            <tr>
                                                <td align="center">
                                                    <a href="${process.env.NEXTAUTH_URL || 'https://ourlab.fun'}/forgot-password"
                                                       style="display: inline-block; background: linear-gradient(135deg, #f97316 0%, #dc2626 50%, #ec4899 100%); color: #ffffff; text-decoration: none; padding: 20px 40px; border-radius: 12px; font-weight: 700; font-size: 18px; box-shadow: 0 8px 20px rgba(249, 115, 22, 0.4); transition: all 0.3s ease; text-transform: uppercase; letter-spacing: 1px;">
                                                        🔑 Reset My Password Now
                                                    </a>
                                                </td>
                                            </tr>
                                        </table>
                                        
                                        <!-- Alternative reset -->
                                        <div style="text-align: center; margin: 30px 0;">
                                            <p style="color: #6b7280; font-size: 14px; margin: 0 0 10px 0;">
                                                Can't click the button? Copy and paste this link:
                                            </p>
                                            <p style="color: #f97316; font-size: 14px; word-break: break-all; background: #f8fafc; padding: 12px; border-radius: 8px; border: 1px solid #e2e8f0; font-family: monospace;">
                                                ${process.env.NEXTAUTH_URL || 'https://ourlab.fun'}/forgot-password
                                            </p>
                                        </div>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                    
                    <!-- Footer -->
                    <tr>
                        <td style="background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%); padding: 40px 50px; border-top: 1px solid #e2e8f0;">
                            <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                                <tr>
                                    <td align="center">
                                        <!-- Footer Logo -->
                                        <div style="margin-bottom: 24px;">
                                            <img src="https://ourlab.fun/images/ourlabfun-forlight-transparent.png" alt="OurLab.fun" style="height: 40px; width: auto; opacity: 0.8;" />
                                        </div>
                                        
                                        <p style="color: #6b7280; font-size: 16px; margin: 0 0 20px 0; line-height: 1.6; font-weight: 500;">
                                            This password reset request was made for the account associated with <strong style="color: #374151;">${email}</strong>
                                        </p>
                                        
                                        <div style="border-top: 2px solid #e2e8f0; padding-top: 24px; margin-top: 24px;">
                                            <p style="color: #9ca3af; font-size: 14px; margin: 0 0 12px 0; line-height: 1.5;">
                                                © ${new Date().getFullYear()} OurLab.fun - Guide Me To Your World
                                            </p>
                                            <p style="color: #9ca3af; font-size: 13px; margin: 0; line-height: 1.4;">
                                                For security reasons, this email cannot be replied to.
              </p>
            </div>
            
                                        <!-- Support & Social Links -->
                                        <div style="margin-top: 30px; text-align: center;">
                                            <p style="color: #6b7280; font-size: 14px; margin: 0 0 16px 0; font-weight: 600;">
                                                Need help or have questions?
                                            </p>
                                            <div style="text-align: center;">
                                                <a href="mailto:info@ourlab.fun" style="display: inline-block; margin: 0 8px; padding: 8px 16px; background: linear-gradient(135deg, #6b7280 0%, #9ca3af 100%); color: white; text-decoration: none; border-radius: 8px; font-size: 13px; font-weight: 600;">
                                                    📧 Contact Support
                                                </a>
                                                <a href="https://www.facebook.com/ourlab.fun/" style="display: inline-block; margin: 0 8px; padding: 8px 16px; background: linear-gradient(135deg, #1877f2 0%, #42a5f5 100%); color: white; text-decoration: none; border-radius: 8px; font-size: 13px; font-weight: 600;">
                                                    📘 Facebook
                                                </a>
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