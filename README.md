<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>X Open Source Algo Analyzer</title>
    <style>
        body { background-color: #000; color: #e7e9ea; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; display: flex; flex-direction: column; align-items: center; min-height: 100vh; margin: 0; padding: 20px; }
        .container { max-width: 480px; width: 100%; }
        
        /* MONETIZATION: ADSENSE HEADER */
        .ad-banner { width: 100%; height: 90px; background: #16181c; border: 1px dashed #333; display: flex; align-items: center; justify-content: center; margin-bottom: 20px; color: #555; font-size: 11px; letter-spacing: 1px; }

        /* ANALYZER UI */
        .card { background: #000; border: 1px solid #2f3336; border-radius: 16px; padding: 20px; box-shadow: 0 10px 40px -10px rgba(29,155,240,0.1); }
        h1 { font-size: 20px; margin: 0 0 5px 0; text-align: center; color: #fff; }
        .badge { background: #1d9bf0; color: #fff; font-size: 10px; padding: 2px 6px; border-radius: 4px; vertical-align: middle; margin-left: 5px; }
        .subtitle { color: #71767b; text-align: center; font-size: 13px; margin-bottom: 25px; }

        .input-group { margin-bottom: 20px; }
        label { display: block; color: #71767b; font-size: 13px; margin-bottom: 8px; font-weight: 500; }
        select, input { width: 100%; background: #000; border: 1px solid #333; color: #fff; padding: 12px; border-radius: 8px; font-size: 15px; outline: none; transition: 0.2s; box-sizing: border-box; }
        select:focus, input:focus { border-color: #1d9bf0; }

        .toggle-row { display: flex; justify-content: space-between; align-items: center; padding: 10px 0; border-bottom: 1px solid #16181c; }
        .toggle-label { font-size: 14px; color: #d6d9db; }
        input[type="checkbox"] { width: 20px; height: 20px; accent-color: #1d9bf0; }

        button { width: 100%; background: #fff; color: #000; border: none; padding: 14px; border-radius: 30px; font-weight: 700; font-size: 16px; cursor: pointer; margin-top: 25px; transition: transform 0.1s; }
        button:hover { background: #d6d9db; }
        button:active { transform: scale(0.98); }

        /* RESULTS SECTION */
        .result-box { margin-top: 25px; padding-top: 25px; border-top: 1px solid #2f3336; display: none; }
        .score-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-bottom: 15px; }
        .mini-stat { background: #16181c; padding: 10px; border-radius: 8px; text-align: center; }
        .mini-label { font-size: 11px; color: #71767b; }
        .mini-val { font-size: 16px; font-weight: bold; color: #1d9bf0; }
        
        .final-score { text-align: center; margin: 15px 0; }
        .score-val { font-size: 52px; font-weight: 900; line-height: 1; }
        .score-msg { font-size: 14px; margin-top: 10px; color: #71767b; }

        /* MONETIZATION: AFFILIATE (Tweet Hunter Style) */
        .affiliate { margin-top: 30px; background: linear-gradient(135deg, #16181c, #1d1f23); padding: 20px; border-radius: 12px; text-align: center; border: 1px solid #333; }
        .affiliate h3 { color: #fff; font-size: 16px; margin: 0 0 10px 0; }
        .affiliate p { color: #888; font-size: 13px; line-height: 1.4; margin-bottom: 15px; }
        .aff-btn { display: inline-block; background: #00ba7c; color: #000; padding: 10px 24px; border-radius: 20px; text-decoration: none; font-size: 14px; font-weight: bold; transition: 0.2s; box-shadow: 0 4px 12px rgba(0, 186, 124, 0.2); }
        .aff-btn:hover { background: #009e69; transform: translateY(-2px); }

    </style>
</head>
<body>

<div class="container">
    
    <div class="ad-banner" style="display:none">AD SPACE (728x90)</div>

    <div class="card">
        <h1>X Algo Ranker <span class="badge">v2026.1</span></h1>
        <p class="subtitle">Based on xai-org/x-algorithm source code</p>

        <div class="input-group">
            <label>Content Format</label>
            <select id="format">
                <option value="text">Standard Text</option>
                <option value="image">Image / GIF</option>
                <option value="video">Native Video (High Dwell Time)</option>
                <option value="link">External Link (Reach Penalty)</option>
            </select>
        </div>

        <div class="toggle-row">
            <span class="toggle-label">Are you Verified? (Premium)</span>
            <input type="checkbox" id="isPremium">
        </div>
        
        <div class="toggle-row">
            <span class="toggle-label">Are you in the user's "Network"?</span>
            <input type="checkbox" id="inNetwork" checked>
        </div>

        <div class="toggle-row">
            <span class="toggle-label">Will you reply to comments?</span>
            <input type="checkbox" id="willReply">
        </div>

        <button onclick="calculateRank()">Run Simulation</button>

        <div id="result" class="result-box">
            <div class="score-grid">
                <div class="mini-stat">
                    <div class="mini-label">REPUTATION</div>
                    <div class="mini-val" id="repScore">-</div>
                </div>
                <div class="mini-stat">
                    <div class="mini-label">MEDIA WEIGHT</div>
                    <div class="mini-val" id="mediaScore">-</div>
                </div>
            </div>

            <div class="final-score">
                <div style="font-size: 12px; color: #555; margin-bottom:5px;">PREDICTED RANKING SCORE</div>
                <div class="score-val" id="finalScore">0</div>
                <div class="score-msg" id="msg"></div>
            </div>
        </div>
    </div>

    <div class="affiliate">
        <h3>⚡ Hack the "Consistency" Algorithm</h3>
        <p>The code proves that <b>Author Mass</b> is critical. You need to post daily to build mass. Use the tool top creators use to automate it.</p>
        
        <a href="https://tweethunter.io/?via=javier-fernandez" class="aff-btn" target="_blank">Try Tweet Hunter Free</a>
    </div>

</div>

<script>
    // --- REAL ALGORITHM WEIGHTS (From GitHub) ---
    const WEIGHTS = {
        like: 0.5,
        retweet: 1.0,
        reply: 1.0, 
        reply_author_response: 75.0, // HUGE boost if author replies back
        image_weight: 2.0,
        video_weight: 4.5,           // Weighted by dwell time in the source
        link_penalty: 0.1,           // Reduces score by 90%
        premium_boost: 4.0,          // "Blue Verified" multiplier
        out_of_network_penalty: 0.5  // Penalty for being unknown to user
    };

    function calculateRank() {
        // 1. Get Inputs
        const format = document.getElementById('format').value;
        const isPremium = document.getElementById('isPremium').checked;
        const inNetwork = document.getElementById('inNetwork').checked;
        const willReply = document.getElementById('willReply').checked;

        // 2. Base Score (The "Heavy Ranker" simulation)
        let score = 100;

        // 3. Apply Format Multipliers
        let mediaMult = 1.0;
        if (format === 'image') mediaMult = WEIGHTS.image_weight;
        if (format === 'video') mediaMult = WEIGHTS.video_weight; 
        if (format === 'link') mediaMult = WEIGHTS.link_penalty;
        
        score = score * mediaMult;

        // 4. Apply Author Mass / Premium
        let repMult = isPremium ? WEIGHTS.premium_boost : 1.0;
        if (!inNetwork) repMult = repMult * WEIGHTS.out_of_network_penalty;
        
        score = score * repMult;

        // 5. The "Conversation" Boost
        if (willReply) {
            score = score * 1.5; 
        }

        // Display
        const final = Math.round(score);
        document.getElementById('finalScore').innerText = final;
        document.getElementById('repScore').innerText = repMult + "x";
        document.getElementById('mediaScore').innerText = mediaMult + "x";
        document.getElementById('result').style.display = "block";

        // Logic Feedback
        const msg = document.getElementById('msg');
        if (format === 'link') {
            msg.innerText = "⚠️ The algo penalizes external links. Put them in the comments.";
            msg.style.color = "#f4212e";
        } else if (willReply && format === 'video') {
            msg.innerText = "🔥 VIRAL COMBO: High Dwell Time + Conversation Boost!";
            msg.style.color = "#00ba7c";
        } else {
            msg.innerText = "✅ Optimized for Standard Distribution.";
            msg.style.color = "#71767b";
        }
    }
</script>

</body>
</html>

