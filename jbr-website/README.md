# JBR Private Limited - Company Website

A modern, responsive company portfolio website for JourneyBeyondResults Private Limited, built according to the specifications in the Project Requirement File (PRF).

## 🌟 Features

- **Modern & Responsive Design**: Mobile-first approach with beautiful animations
- **Company Portfolio**: Professional showcase of services and company information  
- **Interactive Contact Form**: Secure form with email integration
- **Smooth Animations**: Using AOS (Animate On Scroll) library
- **SEO Optimized**: Proper meta tags and semantic HTML structure
- **Performance Optimized**: Optimized images, CSS, and JavaScript
- **Cross-Browser Compatible**: Works on all modern browsers

## 🎨 Design Specifications

### Color Palette
- **Primary Background**: `#fffbde`
- **Secondary Accent**: `#90d1c9` 
- **Brand Highlight**: `#129a90`
- **Contrast/CTA**: `#086b68`

### Pages
1. **Home Page**: Hero section with company logo animation and services preview
2. **About Us**: Detailed information about all company services
3. **Contact Us**: Interactive contact form with validation

## 🚀 Quick Start

### Option 1: Direct File Opening (Recommended for Testing)

1. **Download/Clone the files**
   - All website files are in the `jbr-website` folder

2. **Open in Browser**
   - Open `index.html` in any modern web browser
   - The website will work immediately without any server setup

3. **Note**: The contact form will show success messages but won't actually send emails without a backend server.

### Option 2: Local Development Server

If you want to test with a local server:

```bash
# Navigate to the website folder
cd jbr-website

# Option A: Using Python (if installed)
python -m http.server 8000

# Option B: Using Node.js live-server (if installed)
npx live-server

# Then open http://localhost:8000 in your browser
```

## 📁 Project Structure

```
jbr-website/
├── index.html              # Home page
├── about.html              # About us page  
├── contact.html            # Contact page
├── css/
│   └── styles.css          # Main stylesheet
├── js/
│   └── script.js           # Main JavaScript file
├── backend-example.js      # Example backend implementation
└── README.md              # This file
```

## 🔧 Backend Integration (Optional)

The contact form is ready for backend integration. An example Node.js/Express backend is provided in `backend-example.js`.

### Setting Up the Backend

1. **Install Node.js** (if not already installed)

2. **Install Dependencies**
   ```bash
   npm init -y
   npm install express nodemailer cors express-rate-limit helmet
   ```

3. **Environment Variables**
   Create a `.env` file:
   ```env
   EMAIL_USER=your-email@gmail.com
   EMAIL_PASS=your-app-password
   COMPANY_EMAIL=info@jbrpvt.com
   SEND_CONFIRMATION=true
   PORT=3001
   ```

4. **Run the Backend**
   ```bash
   node backend-example.js
   ```

5. **Update Frontend**
   In `js/script.js`, replace the `simulateEmailSend` function with:
   ```javascript
   async function simulateEmailSend(data) {
       const response = await fetch('http://localhost:3001/api/contact', {
           method: 'POST',
           headers: {
               'Content-Type': 'application/json',
           },
           body: JSON.stringify(data)
       });
       
       if (!response.ok) {
           throw new Error('Failed to send email');
       }
       
       return response.json();
   }
   ```

## 🌐 Deployment Options

### Option 1: Static Hosting (Recommended)

The website can be deployed to any static hosting service:

**Vercel (Recommended)**
1. Visit [vercel.com](https://vercel.com)
2. Sign up and connect your GitHub account
3. Upload the `jbr-website` folder or connect your repository
4. Deploy - it's live in minutes!

**Other Static Hosting Options:**
- **Netlify**: Drag and drop the folder on netlify.app
- **GitHub Pages**: Upload to a GitHub repository and enable Pages
- **Firebase Hosting**: `firebase deploy`
- **Surge.sh**: `npm install -g surge && surge`

### Option 2: Full-Stack Deployment

For the complete website with backend functionality:

**Heroku**
1. Create a Heroku app
2. Add environment variables in Settings > Config Vars
3. Deploy using Git or GitHub integration

**Railway**
1. Connect your GitHub repository
2. Add environment variables
3. Deploy automatically

**DigitalOcean App Platform**
1. Connect repository
2. Configure environment variables
3. Deploy

## 📱 Responsive Design

The website is fully responsive and works perfectly on:
- ✅ Desktop computers (1200px+)
- ✅ Tablets (768px - 1199px)
- ✅ Mobile phones (320px - 767px)

## 🎯 Performance Features

- **Optimized Images**: Proper image sizing and formats
- **Minified Code**: Clean, optimized CSS and JavaScript
- **Fast Loading**: Optimized fonts and external libraries
- **SEO Ready**: Proper meta tags and semantic HTML
- **Accessibility**: ARIA labels and keyboard navigation support

## 🔒 Security Features

- **Form Validation**: Both client-side and server-side validation
- **Rate Limiting**: Prevents spam and abuse
- **CORS Protection**: Secure cross-origin requests
- **Input Sanitization**: Clean and safe form data handling

## 🛠️ Customization

### Updating Company Information

1. **Logo**: Replace the image URLs in all HTML files:
   ```html
   <img src="YOUR_NEW_LOGO_URL" alt="JBR Logo" class="logo">
   ```

2. **Contact Information**: Update in `contact.html`:
   ```html
   <p>info@yourcompany.com</p>
   <p>+91 (XXX) XXX-XXXX</p>
   ```

3. **Services**: Modify the services content in `about.html`

4. **Colors**: Update the CSS variables in `css/styles.css`:
   ```css
   :root {
       --primary-bg: #your-color;
       --secondary-accent: #your-color;
       --brand-highlight: #your-color;
       --contrast-cta: #your-color;
   }
   ```

### Adding New Pages

1. Create a new HTML file following the same structure
2. Add navigation links in all pages
3. Update the mobile menu in `js/script.js`

## 📞 Support

For technical support or questions about this website:

1. **Documentation**: Check this README first
2. **Issues**: Create an issue if you find bugs
3. **Customization**: Contact for custom modifications

## 📋 Browser Support

- ✅ Chrome 60+
- ✅ Firefox 55+  
- ✅ Safari 12+
- ✅ Edge 79+
- ✅ Mobile browsers (iOS Safari, Chrome Mobile)

## 📈 Analytics Setup (Optional)

To add Google Analytics or other tracking:

1. Add the tracking code to the `<head>` section of all HTML files
2. Update privacy policy if collecting user data
3. Consider GDPR compliance for EU visitors

## 🚀 Performance Tips

1. **Images**: Use WebP format when possible
2. **CDN**: Consider using a CDN for faster loading
3. **Caching**: Enable browser caching on your server
4. **Compression**: Enable Gzip compression
5. **Monitoring**: Use Google PageSpeed Insights to monitor performance

## 📝 License

This website is created specifically for JourneyBeyondResults Private Limited. All rights reserved.

---

**Website Created**: 2024  
**Last Updated**: September 2024  
**Technology Stack**: HTML5, CSS3, JavaScript, AOS Library  
**Responsive Framework**: CSS Grid & Flexbox  
**Icons**: Font Awesome  
**Fonts**: Google Fonts (Inter)

For questions or support, please contact the development team.