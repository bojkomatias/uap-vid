module.exports = {
    presets: [
        require('tailwindcss/defaultConfig'),
        require('./presets/fonts'),
        require('./presets/colors'),
        require('./presets/border'),
    ],
    content: [
        './pages/**/*.{js,ts,jsx,tsx}',
        './components/**/*.{js,ts,jsx,tsx}',
    ],
}
