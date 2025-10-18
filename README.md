# London Safety Routing System - Next.js Frontend

A modern, responsive web application for personalized safety routing in London, built with Next.js 14 and Tailwind CSS.

## Features

- 🗺️ Interactive route planning interface
- 👥 Find buddy system for safe travel
- ⚠️ Hazard reporting functionality
- 📍 Suggested safe routes
- 📱 Responsive design for mobile and desktop
- 🛡️ Professional shield logo design

## Prerequisites

Before you begin, ensure you have the following installed:
- [Node.js](https://nodejs.org/) (version 18 or higher)
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)

## Getting Started

1. **Clone the repository**
   ```bash
   git clone https://github.com/shalini78106502/london-safety-routing-nextjs.git
   cd london-safety-routing-nextjs
   ```

2. **Add the logo image**
   - Save the shield logo as `logo.png` in the `public/img/` directory
   - The logo should be in PNG format for best quality

3. **Install dependencies**
   ```bash
   npm install
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000) to see the application.

## Available Scripts

- `npm run dev` - Starts the development server
- `npm run build` - Builds the application for production
- `npm run start` - Starts the production server
- `npm run lint` - Runs the linter

## Project Structure

```
├── app/                    # Next.js 14 app directory
│   ├── find-buddy/        # Find buddy page
│   ├── hazard-reporting/  # Hazard reporting page
│   ├── suggested-routes/  # Suggested routes page
│   ├── layout.jsx         # Root layout
│   └── page.jsx          # Home page
├── components/            # Reusable React components
│   ├── Navbar.jsx        # Navigation component with logo
│   └── Footer.jsx        # Footer component with logo
├── public/               # Static assets
│   └── img/             # Images (logo.png goes here)
├── globals.css          # Global styles
└── tailwind.config.js   # Tailwind CSS configuration
```

## Logo Implementation

The shield logo is used in the following locations:
- **Navbar**: Top navigation bar
- **Footer**: Footer branding section
- **Favicon**: Browser tab icon
- **Open Graph**: Social media sharing

Make sure to save your logo as `public/img/logo.png` for proper display.

## Technologies Used

- **Next.js 14** - React framework with App Router
- **React 18** - JavaScript library for building user interfaces
- **Tailwind CSS** - Utility-first CSS framework
- **Lucide React** - Icon library

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License.

## Contact

For any questions or support, please contact the development team.
