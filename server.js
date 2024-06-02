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
    const requestPath = req.path.toLowerCase();
    
    // Prepare the payload for the webhook
    const payload = {
        content: `Page visited: ${requestPath}`
    };

    // Log the payload
    console.log('Payload:', payload);

    // Function to send the webhook request with retries
    const sendWebhook = async (retries = 3) => {
        try {
            const response = await axios.post(discordWebhookURL, payload);
            console.log('Webhook sent successfully:', response.data);
        } catch (error) {
            console.error('Error sending webhook:', error.response ? error.response.data : error.message);
            if (retries > 0) {
                console.log(`Retrying... Attempts left: ${retries}`);
                setTimeout(() => sendWebhook(retries - 1), 1000); // Retry after 1 second
            }
        }
    };

    // Send the webhook
    sendWebhook();

    next();
});

// Middleware to handle redirects for /r/ paths
app.use((req, res, next) => {
    const requestPath = req.path.toLowerCase();
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
