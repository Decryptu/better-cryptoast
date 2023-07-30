// Function to apply the theme
function applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
}

// Check if a theme is saved in localStorage
if (localStorage.getItem('data-theme')) {
    // Apply saved theme
    applyTheme(localStorage.getItem('data-theme'));
} else {
    // Check for system dark mode setting
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
        // User has dark mode enabled
        applyTheme('dark');
    } else {
        // User has light mode enabled
        applyTheme('light');
    }
}

// Listen for changes
window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => {
    const newTheme = e.matches ? 'dark' : 'light';
    applyTheme(newTheme);
});
