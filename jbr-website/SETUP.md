# 🚀 JBR Website - Complete Setup Guide

This guide will help you set up and run the complete JBR website with working backend and email functionality.

## 📋 Prerequisites

Before starting, make sure you have:
- **Node.js** installed (version 16 or higher) - [Download here](https://nodejs.org/)
- A **Gmail account** for sending emails
- **Basic terminal/command prompt** knowledge

## 🔧 Setup Instructions

### Step 1: Install Node.js Dependencies

Open your terminal/command prompt in the `jbr-website` folder and run:

```bash
# Install all required packages
npm install
```

This will install:
- Express (web server)
- Nodemailer (email sending)
- CORS (cross-origin requests)
- Helmet (security)
- Express-rate-limit (spam protection)
- Dotenv (environment variables)

### Step 2: Configure Email Settings

1. **Open the `.env` file** in the website folder
2. **Replace the placeholder values:**

```env
# Replace with your Gmail address
EMAIL_USER=your-actual-email@gmail.com

# Replace with your Gmail App Password (see instructions below)
EMAIL_PASS=your-16-character-app-password
```

### Step 3: Get Gmail App Password

🔐 **Important: You need an App Password, not your regular Gmail password!**

1. **Go to your Google Account:** [myaccount.google.com](https://myaccount.google.com)
2. **Enable 2-Factor Authentication:**
   - Go to Security → 2-Step Verification
   - Follow the setup process

3. **Generate App Password:**
   - Go to Security → App passwords
   - Select "Mail" and your device
   - **Copy the 16-character password** (looks like: `abcd efgh ijkl mnop`)
   - **Paste this in your `.env` file** as `EMAIL_PASS`

### Step 4: Start the Server

In your terminal, run:

```bash
# Start the server
npm start
```

You should see:
```
🚀 JBR Website Server Started!
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📡 Server: http://localhost:3000
📧 Email: your-email@gmail.com  
📮 Target: journeybeyondresultspvtltd@gmail.com

🌐 Available Routes:
   • http://localhost:3000         → Home Page
   • http://localhost:3000/about   → About Page  
   • http://localhost:3000/contact → Contact Page
   • http://localhost:3000/api/health → Health Check

⚡ Environment: development
💻 Ready to serve JBR Private Limited!
```

### Step 5: Test Your Website

1. **Open your browser** and go to: `http://localhost:3000`
2. **Navigate to Contact Us** page
3. **Fill out the form** and submit
4. **Check your email** - you should receive messages at `journeybeyondresultspvtltd@gmail.com`

## 📧 Email Features

### What happens when someone submits the contact form:

1. **Company Email** (`journeybeyondresultspvtltd@gmail.com`) receives:
   - 🎨 **Beautifully formatted HTML email**
   - 📋 **Complete contact information**
   - 💬 **Full message content**
   - 📅 **Submission timestamp**
   - 🔗 **Quick action links** (reply, call)
   - 📊 **Technical details** (IP, browser info)

2. **Customer** receives:
   - ✅ **Professional confirmation email**
   - 📋 **Summary of their inquiry**
   - ⏰ **Response time expectations**
   - 🎨 **Company branding**

## 🛡️ Security Features

- ✅ **Rate Limiting** - Max 3 submissions per 15 minutes per IP
- ✅ **Input Validation** - All fields validated on server
- ✅ **Data Sanitization** - Prevents malicious input
- ✅ **CORS Protection** - Secure cross-origin requests
- ✅ **Helmet Security** - HTTP security headers

## 🔧 Troubleshooting

### Problem: "Gmail Authentication Failed"
**Solution:** 
- Make sure you're using an **App Password**, not your regular password
- Enable **2-Factor Authentication** on your Google account
- The App Password should be **16 characters** with no spaces

### Problem: "Cannot find module 'express'"
**Solution:**
```bash
npm install
```

### Problem: "Port 3000 already in use"
**Solution:** 
- Change the port in `.env` file: `PORT=3001`
- Or stop other applications using port 3000

### Problem: "Email not received"
**Solution:**
- Check your **spam folder**
- Verify the `.env` configuration
- Check server console for error messages
- Test with `http://localhost:3000/api/health`

## 🌐 Deployment

### For Production Deployment:

1. **Update .env for production:**
   ```env
   NODE_ENV=production
   ```

2. **Popular hosting options:**
   - **Heroku** - Easy deployment with Git
   - **Railway** - Modern platform with GitHub integration
   - **DigitalOcean** - VPS with full control
   - **Vercel** - Serverless functions (requires code modification)

## 📱 Contact Form Fields

The form includes all requested fields:
- ✅ **Name** (required, min 2 characters)
- ✅ **Phone** (required, format validation)
- ✅ **Email** (required, email validation)
- ✅ **Reason for Contact** (dropdown selection)
- ✅ **Message/Description** (required, min 10 characters)
- ✅ **Consent Checkbox** (required)

## 🎨 Design Features

### Hero Section:
- ✅ **Bungee Shade font** for company name (only in hero)
- ✅ **Rotating background logo** (60-second animation)
- ✅ **Larger hero logo** (140px)
- ✅ **Responsive design** for all devices

### Visual Elements:
- ✅ **Exact color palette** from PRF specifications
- ✅ **Smooth animations** and transitions
- ✅ **Mobile-first responsive** design
- ✅ **Professional business** presentation

## 📞 Support

If you need help:
1. **Check the console** for error messages
2. **Verify all steps** in this setup guide
3. **Test the health endpoint:** `http://localhost:3000/api/health`
4. **Check email spam folders**

---

## ✅ Quick Checklist

- [ ] Node.js installed
- [ ] Ran `npm install`
- [ ] Updated `.env` with real Gmail credentials
- [ ] Got Gmail App Password (16 characters)
- [ ] Enabled 2-Factor Authentication on Gmail
- [ ] Server starts without errors
- [ ] Website loads at `http://localhost:3000`
- [ ] Contact form submits successfully
- [ ] Email received at `journeybeyondresultspvtltd@gmail.com`
- [ ] Logo file placed in `images/` folder

**🎉 Once all items are checked, your JBR website is fully operational!**