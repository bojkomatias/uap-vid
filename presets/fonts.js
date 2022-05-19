const defaultTheme = require('tailwindcss/defaultTheme')
module.exports = {
    presets: [],
    theme: {
        fontFamily: {
            sans: ['Roboto', ...defaultTheme.fontFamily.sans],
            serif: [...defaultTheme.fontFamily.serif],
            mono: ['Syne Mono', ...defaultTheme.fontFamily.mono],
        },
    },
}
