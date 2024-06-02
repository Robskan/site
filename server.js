const express = require('express');
const path = require('path');
const axios = require('axios');
const app = express();
const PORT = process.env.PORT || 3000;

// Define your redirects
const redirects = {
    '/r/docs': 'https://robskan.gitbook.io/robskan.com/',
    '/r/ntts': 'https://discord.gg/ntts',
    // Add more redirects as needed
};

// Discord webhook URL
const discordWebhookURL = 'https://discord.com/api/webhooks/1246878907894861929/laQIVR5taSn3PomULkupTyEfBPDIHigYryZmAY-pKo7qQiTEY36GkM6TrnFN09z0FciO';

// Middleware to log all requests and send to Discord
app.use((req, res, next) => {
    const requestPath = req.path.toLowerCase();  // Change variable name to avoid conflict with 'path' module
    
    // Prepare the payload for the webhook
    const payload = {
        content: `Page visited: ${requestPath}`
    };

    // Send the webhook request
    axios.post(discordWebhookURL, payload)
        .then(response => {
            console.log('Webhook sent successfully:', response.data);
        })
        .catch(error => {
            if (error.response) {
                // The request was made and the server responded with a status code
                // that falls out of the range of 2xx
                console.error('Error response from Discord:', error.response.data);
            } else if (error.request) {
                // The request was made but no response was received
                console.error('No response received from Discord:', error.request);
            } else {
                // Something happened in setting up the request that triggered an Error
                console.error('Error setting up webhook request:', error.message);
            }
        });
    
    next();
});

// Middleware to handle redirects for /r/ paths
app.use((req, res, next) => {
    const requestPath = req.path.toLowerCase();  // Change variable name to avoid conflict with 'path' module
    if (requestPath.startsWith('/r/')) {
        const redirectTo = redirects[requestPath];
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
