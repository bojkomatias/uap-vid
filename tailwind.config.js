const colors = require('tailwindcss/colors')

module.exports = {
    presets: [require('tailwindcss/defaultConfig')],
    content: ['./src/**/*.{js,ts,jsx,tsx}'],
    theme: {
        fontFamily: {
            sans: ['var(--font-sans)'],
        },
        colors: {
            current: 'currentColor',
            base: colors.neutral,
            primary: {
                DEFAULT: '#003C71',
            },
            gray: colors.gray,
            white: colors.white,
            black: colors.black,
            error: colors.rose,
            success: colors.teal,
            warning: colors.amber
        },
        extend: {
            borderRadius: { DEFAULT: '0.5rem' },
        },
    },
    plugins: [
        require('@tailwindcss/typography'),
        require('@tailwindcss/forms'),
        // ...
    ],
}
