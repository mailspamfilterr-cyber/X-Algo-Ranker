const fetch = require('node-fetch');

exports.handler = async (event) => {
    if (event.httpMethod !== 'POST') {
        return { statusCode: 405, body: 'Method Not Allowed' };
    }

    const { post } = JSON.parse(event.body);
    const API_KEY = process.env.GROK_API_KEY; // Securely from env var

    try {
        const response = await fetch('https://api.x.ai/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${API_KEY}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                model: 'grok-4',
                messages: [
                    { role: 'system', content: 'You are an expert in X\'s open-source algorithm from https://github.com/xai-org/x-algorithm. Analyze the post for ranking/viral potential using the Phoenix transformer signals: predict probabilities for 15+ engagements like P(like), P(reply), P(repost), P(click), P(block), P(mute), etc. Factor in content features (questions, CTAs, urgency, controversy, length, emojis, hashtags, mentions). Output strictly: Score: <0-100 integer>\nRecommendations: ["rec1", "rec2", "rec3-5"]' },
                    { role: 'user', content: `Analyze this post: "${post}"` }
                ],
                temperature: 0.5,
                max_tokens: 200
            })
        });
        const data = await response.json();
        const output = data.choices[0].message.content.trim();

        // Parse
        const scoreMatch = output.match(/Score: (\d+)/);
        const recsMatch = output.match(/Recommendations: \[(.*?)\]/s);
        const score = scoreMatch ? parseInt(scoreMatch[1]) : 50;
        const recommendations = recsMatch ? recsMatch[1].split(/",\s*"/).map(r => r.replace(/"/g, '')) : ['Add engagement hooks like questions.'];

        return {
            statusCode: 200,
            body: JSON.stringify({ score, recommendations })
        };
    } catch (error) {
        console.error(error);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: 'Analysis failed' })
        };
    }
};