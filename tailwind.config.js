/** @type {import('tailwindcss').Config} */
module.exports = {
    darkMode: ["class"],
    content: ["app/**/*.{ts,tsx}", "components/**/*.{ts,tsx}", "./index.html", "./src/**/*.{vue,js,ts,jsx,tsx}"],
    theme: {
        extend: {
            colors: {
                border: "hsl(var(--border))",
                input: "hsl(var(--input))",
                ring: "hsl(var(--ring))",
                background: "hsl(var(--background))",
                foreground: "hsl(var(--foreground))",
                primary: {
                    DEFAULT: "hsl(var(--primary))",
                    foreground: "hsl(var(--primary-foreground))",
                },
                secondary: {
                    DEFAULT: "hsl(var(--secondary))",
                    foreground: "hsl(var(--secondary-foreground))",
                },
                destructive: {
                    DEFAULT: "hsl(var(--destructive))",
                    foreground: "hsl(var(--destructive-foreground))",
                },
                muted: {
                    DEFAULT: "hsl(var(--muted))",
                    foreground: "hsl(var(--muted-foreground))",
                },
                accent: {
                    DEFAULT: "hsl(var(--accent))",
                    foreground: "hsl(var(--accent-foreground))",
                },
                popover: {
                    DEFAULT: "hsl(var(--popover))",
                    foreground: "hsl(var(--popover-foreground))",
                },
                card: {
                    DEFAULT: "hsl(var(--card))",
                    foreground: "hsl(var(--card-foreground))",
                },
                tomato: {
                    DEFAULT: "#ff6b6b",
                    dark: "#ee5a52",
                },
                orange: {
                    DEFAULT: "#ff9f43",
                    light: "#ffa94d",
                },
                avocado: {
                    DEFAULT: "#26de81",
                    dark: "#20bf6b",
                },
                lemon: "#fed330",
                pepper: "#fd7272",
                cream: "#fff5e6",
                dark: "#2d3436",
                gray: {
                    DEFAULT: "#636e72",
                    light: "#dfe6e9",
                },
            },
            borderRadius: {
                lg: "var(--radius)",
                md: "calc(var(--radius) - 2px)",
                sm: "calc(var(--radius) - 4px)",
                xl: "2rem",
            },
            boxShadow: {
                sm: "0 2px 8px rgba(0, 0, 0, 0.08)",
                md: "0 4px 16px rgba(0, 0, 0, 0.12)",
                lg: "0 8px 32px rgba(0, 0, 0, 0.16)",
            },
            keyframes: {
                fadeIn: {
                    from: {
                        opacity: "0",
                        transform: "translateY(10px)",
                    },
                    to: {
                        opacity: "1",
                        transform: "translateY(0)",
                    },
                },
                pulse: {
                    "0%, 100%": {
                        opacity: "1",
                    },
                    "50%": {
                        opacity: "0.5",
                    },
                },
                bounce: {
                    "0%, 100%": {
                        transform: "translateY(0)",
                    },
                    "50%": {
                        transform: "translateY(-10px)",
                    },
                },
            },
            animation: {
                "fade-in": "fadeIn 0.3s ease-out",
                pulse: "pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite",
                bounce: "bounce 1s infinite",
            },
        },
    },
    plugins: [require("tailwindcss-animate")],
}
