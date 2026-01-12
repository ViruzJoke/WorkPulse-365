export default async function handler(req, res) {
    // CORS setup
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

    const { title, category, priority, app, impact, updates } = req.body;
    const ACCESS_TOKEN = process.env.LINE_ACCESS_TOKEN;
    const USER_ID = process.env.LINE_USER_ID;

    if (!ACCESS_TOKEN || !USER_ID) {
        return res.status(500).json({ error: 'Server Config Error: Missing LINE Env Vars' });
    }

    // Construct Flex Message
    const flexMessage = {
        "type": "flex",
        "altText": `WorkPulse Update: ${title}`,
        "contents": {
            "type": "bubble",
            "size": "giga",
            "header": {
                "type": "box",
                "layout": "vertical",
                "backgroundColor": "#D40511",
                "paddingAll": "20px",
                "contents": [
                    {
                        "type": "text",
                        "text": "DHL WorkPulse 365",
                        "color": "#FFCC00",
                        "weight": "bold",
                        "size": "sm",
                        "style": "italic"
                    },
                    {
                        "type": "text",
                        "text": "WORKLOG UPDATE",
                        "color": "#FFFFFF",
                        "weight": "heavy",
                        "size": "xl",
                        "margin": "sm"
                    }
                ]
            },
            "body": {
                "type": "box",
                "layout": "vertical",
                "backgroundColor": "#FFFFFF",
                "paddingAll": "20px",
                "spacing": "md",
                "contents": [
                    {
                        "type": "text",
                        "text": title || "No Title",
                        "weight": "bold",
                        "size": "xl",
                        "wrap": true,
                        "color": "#333333"
                    },
                    {
                        "type": "box",
                        "layout": "horizontal",
                        "spacing": "sm",
                        "contents": [
                            {
                                "type": "text",
                                "text": priority || "Normal",
                                "size": "xs",
                                "color": "#FFFFFF",
                                "weight": "bold",
                                "backgroundColor": (priority === 'P1' || priority === 'P2') ? "#D40511" : "#FFCC00",
                                "paddingAll": "4px",
                                "cornerRadius": "sm",
                                "flex": 0
                            },
                            {
                                "type": "text",
                                "text": category || "General",
                                "size": "xs",
                                "color": "#666666",
                                "weight": "regular",
                                "backgroundColor": "#F1F5F9",
                                "paddingAll": "4px",
                                "cornerRadius": "sm",
                                "flex": 0
                            }
                        ]
                    },
                    {
                        "type": "separator",
                        "margin": "lg",
                        "color": "#EEEEEE"
                    },
                    {
                        "type": "box",
                        "layout": "vertical",
                        "margin": "lg",
                        "spacing": "sm",
                        "contents": [
                            {
                                "type": "box",
                                "layout": "baseline",
                                "contents": [
                                    { "type": "text", "text": "App", "color": "#aaaaaa", "size": "sm", "flex": 2 },
                                    { "type": "text", "text": app || "-", "weight": "bold", "color": "#333333", "size": "sm", "flex": 5 }
                                ]
                            },
                            {
                                "type": "box",
                                "layout": "baseline",
                                "contents": [
                                    { "type": "text", "text": "Impact", "color": "#aaaaaa", "size": "sm", "flex": 2 },
                                    { "type": "text", "text": impact || "-", "color": "#333333", "size": "sm", "flex": 5, "wrap": true }
                                ]
                            }
                        ]
                    }
                ]
            },
            "footer": {
                "type": "box",
                "layout": "vertical",
                "contents": [
                    {
                        "type": "text",
                        "text": "Sent via WorkPulse 365 (DHL)",
                        "size": "xxs",
                        "color": "#bbbbbb",
                        "align": "center"
                    }
                ]
            }
        }
    };

    try {
        const response = await fetch('https://api.line.me/v2/bot/message/push', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${ACCESS_TOKEN}`
            },
            body: JSON.stringify({
                to: USER_ID,
                messages: [flexMessage]
            })
        });

        if (!response.ok) {
            const text = await response.text();
            throw new Error(`Line API Error (${response.status}): ${text}`);
        }

        return res.status(200).json({ success: true });
    } catch (error) {
        console.error('Line Send Error:', error);
        return res.status(500).json({ error: error.message });
    }
}
