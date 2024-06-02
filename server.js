const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

// Define your redirects
const redirects = {
    '/r/docs': 'https://robskan.gitbook.io/robskan.com/',
    '/r/ntts': 'https://discord.gg/ntts',
    // Add more redirects as needed
};

// Middleware to handle redirects for /r/ paths
app.use((req, res, next) => {
    const path = req.path.toLowerCase();
    if (path.startsWith('/r/')) {
        const redirectTo = redirects[path];
        if (redirectTo) {
            return res.redirect(301, redirectTo);
        } else {
            return res.status(404).send('Redirect not found');
        }
    }
    next();
});

// Serve index.html for all other routes
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
