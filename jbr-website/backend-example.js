// Example backend implementation for contact form
// This is a Node.js/Express example - can be adapted for other platforms

const express = require('express');
const nodemailer = require('nodemailer');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rate limiting
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 5, // limit each IP to 5 requests per windowMs
    message: 'Too many requests from this IP, please try again later.',
});

app.use('/api/contact', limiter);

// Email configuration
const createTransporter = () => {
    // Configure based on your email service
    // Example for Gmail:
    return nodemailer.createTransporter({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USER, // Your email
            pass: process.env.EMAIL_PASS, // App password
        },
    });

    // Example for other SMTP services:
    /*
    return nodemailer.createTransporter({
        host: 'smtp.your-email-service.com',
        port: 587,
        secure: false,
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        },
    });
    */
};

// Validation function
function validateContactForm(data) {
    const errors = [];
    const { name, phone, email, reason, description, consent } = data;

    if (!name || name.trim().length < 2) {
        errors.push('Name is required and must be at least 2 characters');
    }

    if (!phone || !/^[\d\s\+\-\(\)]+$/.test(phone)) {
        errors.push('Valid phone number is required');
    }

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        errors.push('Valid email address is required');
    }

    if (!reason || reason.trim().length === 0) {
        errors.push('Reason for contact is required');
    }

    if (!description || description.trim().length < 10) {
        errors.push('Description must be at least 10 characters');
    }

    if (!consent) {
        errors.push('Consent to be contacted is required');
    }

    return errors;
}

// Contact form endpoint
app.post('/api/contact', async (req, res) => {
    try {
        const { name, phone, email, reason, description, consent } = req.body;

        // Validate form data
        const validationErrors = validateContactForm(req.body);
        if (validationErrors.length > 0) {
            return res.status(400).json({
                success: false,
                message: 'Validation failed',
                errors: validationErrors,
            });
        }

        // Create email content
        const emailContent = {
            from: process.env.EMAIL_USER,
            to: process.env.COMPANY_EMAIL || process.env.EMAIL_USER,
            subject: `New Contact Form Submission - ${reason}`,
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                    <h2 style="color: #086b68;">New Contact Form Submission</h2>
                    
                    <div style="background: #fffbde; padding: 20px; border-radius: 10px; margin: 20px 0;">
                        <h3 style="color: #129a90; margin-bottom: 15px;">Contact Information</h3>
                        <p><strong>Name:</strong> ${name}</p>
                        <p><strong>Phone:</strong> ${phone}</p>
                        <p><strong>Email:</strong> ${email}</p>
                        <p><strong>Reason for Contact:</strong> ${reason}</p>
                    </div>
                    
                    <div style="background: #f9f9f9; padding: 20px; border-radius: 10px; margin: 20px 0;">
                        <h3 style="color: #129a90; margin-bottom: 15px;">Message</h3>
                        <p style="line-height: 1.6;">${description.replace(/\n/g, '<br>')}</p>
                    </div>
                    
                    <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd;">
                        <p style="color: #666; font-size: 12px;">
                            This message was sent from the JBR Private Limited website contact form.<br>
                            Submitted on: ${new Date().toLocaleString()}
                        </p>
                    </div>
                </div>
            `,
            text: `
                New Contact Form Submission

                Name: ${name}
                Phone: ${phone}
                Email: ${email}
                Reason: ${reason}

                Message:
                ${description}

                Submitted on: ${new Date().toLocaleString()}
            `,
        };

        // Send email
        const transporter = createTransporter();
        await transporter.sendMail(emailContent);

        // Optionally send confirmation email to user
        if (process.env.SEND_CONFIRMATION === 'true') {
            const confirmationEmail = {
                from: process.env.EMAIL_USER,
                to: email,
                subject: 'Thank you for contacting JBR Private Limited',
                html: `
                    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                        <h2 style="color: #086b68;">Thank You for Your Inquiry</h2>
                        <p>Dear ${name},</p>
                        <p>Thank you for contacting JourneyBeyondResults Private Limited. We have received your message and will get back to you within 24 hours.</p>
                        
                        <div style="background: #fffbde; padding: 20px; border-radius: 10px; margin: 20px 0;">
                            <h3 style="color: #129a90;">Your Message Summary</h3>
                            <p><strong>Subject:</strong> ${reason}</p>
                            <p><strong>Submitted:</strong> ${new Date().toLocaleString()}</p>
                        </div>
                        
                        <p>If you have any urgent matters, please don't hesitate to call us directly.</p>
                        
                        <p>Best regards,<br>
                        JBR Private Limited Team</p>
                    </div>
                `,
            };

            await transporter.sendMail(confirmationEmail);
        }

        res.json({
            success: true,
            message: 'Message sent successfully',
        });

    } catch (error) {
        console.error('Error sending email:', error);
        
        res.status(500).json({
            success: false,
            message: 'Failed to send message. Please try again later.',
        });
    }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
    res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Start server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

module.exports = app;