export default async function handler(req, res) {
    // CORS setup to allow calls from portable HTML file or any origin
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
    res.setHeader(
        'Access-Control-Allow-Headers',
        'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
    );

    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const { title, category, priority, app } = req.body;
    const webhookUrl = process.env.TEAMS_WEBHOOK_URL;

    if (!webhookUrl) {
        return res.status(500).json({ error: 'Server Configuration Error: Missing TEAMS_WEBHOOK_URL env var' });
    }

    // Construct Adaptive Card Payload
    const payload = {
        "type": "message",
        "attachments": [
            {
                "contentType": "application/vnd.microsoft.card.adaptive",
                "content": {
                    "type": "AdaptiveCard",
                    "body": [
                        { "type": "TextBlock", "text": "📦 DHL WorkPulse Update", "weight": "Bolder", "color": "Attention" },
                        { "type": "TextBlock", "text": "พี่โจ๊กบันทึกงานใหม่แล้ว!", "size": "Large" },
                        {
                            "type": "FactSet",
                            "facts": [
                                { "title": "Task:", "value": title || "No Title" },
                                { "title": "Category:", "value": category || "General" },
                                // Adding Priority and App as helpful context, reusing the user's requested structure
                                { "title": "Priority:", "value": priority || "-" },
                                { "title": "App:", "value": app || "-" }
                            ]
                        }
                    ],
                    "$schema": "http://adaptivecards.io/schemas/adaptive-card.json",
                    "version": "1.0"
                }
            }
        ]
    };

    try {
        const response = await fetch(webhookUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        if (!response.ok) {
            const text = await response.text();
            throw new Error(`Teams Webhook Error (${response.status}): ${text}`);
        }

        return res.status(200).json({ success: true, message: 'Notification sent to Teams' });
    } catch (error) {
        console.error('Teams Send Error:', error);
        return res.status(500).json({ error: error.message });
    }
}
