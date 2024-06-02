const express = require('express');
const path = require('path');
const axios = require('axios');
const dotenv = require('dotenv');

// Load environment variables from .env file
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Define your redirects
const redirects = {
    '/r/docs': 'https://robskan.gitbook.io/robskan.com/',
    '/r/ntts': 'https://discord.gg/ntts',
    // Add more redirects as needed
};

// Get the Discord webhook URL from environment variables
const discordWebhookURL = process.env.DISCORD_WEBHOOK_URL;

// Middleware to log all requests and send to Discord
app.use((req, res, next) => {
    const path = req.path.toLowerCase();
    
    // Prepare the payload for the webhook
    const payload = {
        content: `Page visited: ${path}`
    };

    // Send the webhook request
    axios.post(discordWebhookURL, payload)
        .then(response => {
            console.log('Webhook sent successfully:', response.data);
        })
        .catch(error => {
            console.error('Error sending webhook:', error);
        });
    
    next();
});

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
