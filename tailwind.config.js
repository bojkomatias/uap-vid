module.exports = {
    presets: [
        require('tailwindcss/defaultConfig'),
        require('./presets/fonts'),
        require('./presets/colors'),
    ],
    content: [
        './app/**/*.{js,ts,jsx,tsx}',
        './pages/**/*.{js,ts,jsx,tsx}',
        './components/**/*.{js,ts,jsx,tsx}',
    ],
    plugins: [
        require('@tailwindcss/typography'),
        // ...
    ],
}
