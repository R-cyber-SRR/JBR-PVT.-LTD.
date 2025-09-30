const express = require('express');
const nodemailer = require('nodemailer');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(helmet({
    contentSecurityPolicy: false, // Disable CSP for development
}));

app.use(cors({
    origin: ['http://localhost:3000', 'http://127.0.0.1:3000', '*'],
    credentials: true
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Serve static files
app.use(express.static(path.join(__dirname)));

// Rate limiting for contact form
const contactLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 3, // limit each IP to 3 requests per windowMs
    message: {
        success: false,
        message: 'Too many contact form submissions. Please try again in 15 minutes.'
    },
    standardHeaders: true,
    legacyHeaders: false,
});

// Email transporter configuration
const createTransporter = () => {
    return nodemailer.createTransporter({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USER || 'your-email@gmail.com',
            pass: process.env.EMAIL_PASS || 'your-app-password'
        },
        tls: {
            rejectUnauthorized: false
        }
    });
};

// Validation function
function validateContactForm(data) {
    const errors = [];
    const { name, phone, email, reason, description, consent } = data;

    // Name validation
    if (!name || typeof name !== 'string' || name.trim().length < 2) {
        errors.push('Name is required and must be at least 2 characters long');
    }

    // Phone validation
    if (!phone || typeof phone !== 'string') {
        errors.push('Phone number is required');
    } else if (!/^[\d\s\+\-\(\)]{8,}$/.test(phone.trim())) {
        errors.push('Please enter a valid phone number');
    }

    // Email validation
    if (!email || typeof email !== 'string') {
        errors.push('Email address is required');
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
        errors.push('Please enter a valid email address');
    }

    // Reason validation
    if (!reason || typeof reason !== 'string' || reason.trim().length === 0) {
        errors.push('Please select a reason for contact');
    }

    // Description validation
    if (!description || typeof description !== 'string' || description.trim().length < 10) {
        errors.push('Message must be at least 10 characters long');
    }

    // Consent validation
    if (!consent || consent !== 'on') {
        errors.push('You must agree to be contacted');
    }

    return errors;
}

// Sanitize input data
function sanitizeData(data) {
    const sanitized = {};
    for (const [key, value] of Object.entries(data)) {
        if (typeof value === 'string') {
            sanitized[key] = value.trim().substring(0, 1000); // Limit length
        } else {
            sanitized[key] = value;
        }
    }
    return sanitized;
}

// Routes
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.get('/about', (req, res) => {
    res.sendFile(path.join(__dirname, 'about.html'));
});

app.get('/contact', (req, res) => {
    res.sendFile(path.join(__dirname, 'contact.html'));
});

// Health check endpoint
app.get('/api/health', (req, res) => {
    res.json({ 
        status: 'OK', 
        timestamp: new Date().toISOString(),
        server: 'JBR Website Backend'
    });
});

// Contact form endpoint
app.post('/api/contact', contactLimiter, async (req, res) => {
    try {
        console.log('Contact form submission received:', req.body);

        // Sanitize input data
        const sanitizedData = sanitizeData(req.body);
        const { name, phone, email, reason, description, consent } = sanitizedData;

        // Validate form data
        const validationErrors = validateContactForm(sanitizedData);
        if (validationErrors.length > 0) {
            console.log('Validation errors:', validationErrors);
            return res.status(400).json({
                success: false,
                message: 'Please fix the following errors:',
                errors: validationErrors,
            });
        }

        // Create email content
        const companyEmail = 'journeybeyondresultspvtltd@gmail.com';
        const currentDate = new Date().toLocaleString('en-IN', {
            timeZone: 'Asia/Kolkata',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });

        const emailContent = {
            from: process.env.EMAIL_USER,
            to: companyEmail,
            subject: `🔔 New Contact Form Submission - ${reason}`,
            html: `
                <!DOCTYPE html>
                <html>
                <head>
                    <meta charset="utf-8">
                    <style>
                        body { font-family: 'Arial', sans-serif; line-height: 1.6; color: #333; }
                        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                        .header { background: linear-gradient(135deg, #129a90, #086b68); color: white; padding: 30px; text-align: center; border-radius: 15px 15px 0 0; }
                        .content { background: #fffbde; padding: 30px; border: 2px solid #90d1c9; }
                        .section { background: white; margin: 20px 0; padding: 20px; border-radius: 10px; border-left: 4px solid #129a90; }
                        .field { margin: 15px 0; }
                        .label { font-weight: bold; color: #086b68; }
                        .value { background: #f8f9fa; padding: 10px; border-radius: 5px; margin-top: 5px; }
                        .footer { background: #086b68; color: white; padding: 20px; text-align: center; border-radius: 0 0 15px 15px; font-size: 12px; }
                        .highlight { background: #90d1c9; padding: 2px 6px; border-radius: 4px; }
                        .urgent { background: #e74c3c; color: white; padding: 5px 10px; border-radius: 20px; font-size: 12px; }
                    </style>
                </head>
                <body>
                    <div class="container">
                        <div class="header">
                            <h1>📧 New Contact Form Submission</h1>
                            <p>JourneyBeyondResults Private Limited</p>
                            <div class="urgent">Action Required</div>
                        </div>
                        
                        <div class="content">
                            <div class="section">
                                <h3 style="color: #129a90; margin-bottom: 20px;">👤 Contact Information</h3>
                                <div class="field">
                                    <div class="label">Full Name:</div>
                                    <div class="value">${name}</div>
                                </div>
                                <div class="field">
                                    <div class="label">📞 Phone Number:</div>
                                    <div class="value"><a href="tel:${phone}" style="color: #129a90; text-decoration: none;">${phone}</a></div>
                                </div>
                                <div class="field">
                                    <div class="label">📧 Email Address:</div>
                                    <div class="value"><a href="mailto:${email}" style="color: #129a90; text-decoration: none;">${email}</a></div>
                                </div>
                                <div class="field">
                                    <div class="label">📋 Inquiry Type:</div>
                                    <div class="value"><span class="highlight">${reason}</span></div>
                                </div>
                            </div>
                            
                            <div class="section">
                                <h3 style="color: #129a90; margin-bottom: 20px;">💬 Message Details</h3>
                                <div class="field">
                                    <div class="label">Message:</div>
                                    <div class="value" style="white-space: pre-wrap; line-height: 1.6;">${description}</div>
                                </div>
                            </div>
                            
                            <div class="section">
                                <h3 style="color: #129a90; margin-bottom: 20px;">📅 Submission Details</h3>
                                <div class="field">
                                    <div class="label">Submitted On:</div>
                                    <div class="value">${currentDate} (India Time)</div>
                                </div>
                                <div class="field">
                                    <div class="label">IP Address:</div>
                                    <div class="value">${req.ip || 'Unknown'}</div>
                                </div>
                                <div class="field">
                                    <div class="label">User Agent:</div>
                                    <div class="value" style="font-size: 11px;">${req.get('User-Agent') || 'Unknown'}</div>
                                </div>
                            </div>
                        </div>
                        
                        <div class="footer">
                            <p><strong>⚡ Quick Actions:</strong></p>
                            <p>
                                <a href="mailto:${email}?subject=Re: Your inquiry about ${reason}" style="color: #90d1c9; text-decoration: none;">📧 Reply to Customer</a> | 
                                <a href="tel:${phone}" style="color: #90d1c9; text-decoration: none;">📞 Call Customer</a>
                            </p>
                            <hr style="border: 1px solid #90d1c9; margin: 20px 0;">
                            <p>This email was automatically generated from the JBR Private Limited website contact form.</p>
                            <p><strong>⏰ Response Time Target:</strong> Within 24 hours</p>
                        </div>
                    </div>
                </body>
                </html>
            `,
            text: `
New Contact Form Submission - JBR Private Limited

CONTACT INFORMATION:
Name: ${name}
Phone: ${phone}
Email: ${email}
Inquiry Type: ${reason}

MESSAGE:
${description}

SUBMISSION DETAILS:
Submitted: ${currentDate} (India Time)
IP Address: ${req.ip || 'Unknown'}

---
Please respond within 24 hours.
This message was sent from the JBR Private Limited website contact form.
            `
        };

        // Send email to company
        console.log('Attempting to send email...');
        const transporter = createTransporter();
        await transporter.sendMail(emailContent);
        console.log('Email sent successfully to company');

        // Send confirmation email to customer
        const customerConfirmation = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: '✅ Thank you for contacting JBR Private Limited',
            html: `
                <!DOCTYPE html>
                <html>
                <head>
                    <meta charset="utf-8">
                    <style>
                        body { font-family: 'Arial', sans-serif; line-height: 1.6; color: #333; }
                        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                        .header { background: linear-gradient(135deg, #129a90, #086b68); color: white; padding: 30px; text-align: center; border-radius: 15px 15px 0 0; }
                        .content { background: #fffbde; padding: 30px; border: 2px solid #90d1c9; border-radius: 0 0 15px 15px; }
                        .highlight { background: #90d1c9; padding: 2px 8px; border-radius: 4px; }
                        .footer { text-align: center; margin-top: 20px; font-size: 12px; color: #666; }
                    </style>
                </head>
                <body>
                    <div class="container">
                        <div class="header">
                            <h1>🙏 Thank You for Your Inquiry!</h1>
                            <p>JourneyBeyondResults Private Limited</p>
                        </div>
                        
                        <div class="content">
                            <p>Dear <strong>${name}</strong>,</p>
                            
                            <p>Thank you for contacting <strong>JourneyBeyondResults Private Limited</strong>. We have successfully received your inquiry about <span class="highlight">${reason}</span>.</p>
                            
                            <div style="background: white; padding: 20px; border-radius: 10px; margin: 20px 0; border-left: 4px solid #129a90;">
                                <h3 style="color: #129a90; margin-top: 0;">📋 Your Inquiry Summary:</h3>
                                <p><strong>Subject:</strong> ${reason}</p>
                                <p><strong>Submitted:</strong> ${currentDate}</p>
                                <p><strong>Reference ID:</strong> JBR-${Date.now()}</p>
                            </div>
                            
                            <h3 style="color: #129a90;">⏰ What Happens Next?</h3>
                            <ul style="color: #555;">
                                <li>Our team will review your inquiry carefully</li>
                                <li>We'll respond within <strong>24 hours</strong> during business days</li>
                                <li>You'll receive a detailed response at <strong>${email}</strong></li>
                                <li>For urgent matters, feel free to call us directly</li>
                            </ul>
                            
                            <div style="background: #129a90; color: white; padding: 15px; border-radius: 10px; text-align: center; margin: 20px 0;">
                                <p style="margin: 0;"><strong>📞 Need Immediate Assistance?</strong></p>
                                <p style="margin: 5px 0 0 0; font-size: 14px;">Contact us directly for urgent matters</p>
                            </div>
                            
                            <p>We appreciate your interest in our services and look forward to helping you achieve your business goals.</p>
                            
                            <p style="margin-top: 30px;">
                                Best regards,<br>
                                <strong>JBR Private Limited Team</strong><br>
                                <em>Empowering businesses through comprehensive sales and services solutions</em>
                            </p>
                            
                            <div class="footer">
                                <p>This is an automated confirmation. Please do not reply to this email.</p>
                                <p>© 2024 JourneyBeyondResults Private Limited. All rights reserved.</p>
                            </div>
                        </div>
                    </div>
                </body>
                </html>
            `,
            text: `
Dear ${name},

Thank you for contacting JourneyBeyondResults Private Limited!

We have successfully received your inquiry about "${reason}" and will respond within 24 hours during business days.

Your inquiry details:
- Subject: ${reason}
- Submitted: ${currentDate}
- Reference ID: JBR-${Date.now()}

Our team will review your message and send you a detailed response at ${email}.

For urgent matters, please contact us directly.

Best regards,
JBR Private Limited Team
Empowering businesses through comprehensive sales and services solutions

---
This is an automated confirmation. Please do not reply to this email.
© 2024 JourneyBeyondResults Private Limited. All rights reserved.
            `
        };

        await transporter.sendMail(customerConfirmation);
        console.log('Confirmation email sent to customer');

        // Success response
        res.json({
            success: true,
            message: 'Your message has been sent successfully! We will get back to you within 24 hours.',
            reference: `JBR-${Date.now()}`
        });

    } catch (error) {
        console.error('Error processing contact form:', error);
        
        res.status(500).json({
            success: false,
            message: 'Sorry, there was an error sending your message. Please try again or contact us directly.',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error('Server error:', err);
    res.status(500).json({
        success: false,
        message: 'Internal server error'
    });
});

// 404 handler
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: 'Route not found'
    });
});

// Start server
app.listen(PORT, () => {
    console.log(`
🚀 JBR Website Server Started!
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📡 Server: http://localhost:${PORT}
📧 Email: ${process.env.EMAIL_USER || 'Not configured'}
📮 Target: journeybeyondresultspvtltd@gmail.com

🌐 Available Routes:
   • http://localhost:${PORT}         → Home Page
   • http://localhost:${PORT}/about   → About Page  
   • http://localhost:${PORT}/contact → Contact Page
   • http://localhost:${PORT}/api/health → Health Check

⚡ Environment: ${process.env.NODE_ENV || 'development'}
💻 Ready to serve JBR Private Limited!

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    `);
});

module.exports = app;