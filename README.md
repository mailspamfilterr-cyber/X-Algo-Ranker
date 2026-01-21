<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>X Post Composer & Grader</title>
    <style>
        /* BASE & LAYOUT */
        body { background-color: #000; color: #fff; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; margin: 0; padding: 20px; display: flex; justify-content: center; min-height: 100vh; }
        .container { display: grid; grid-template-columns: 1fr 1fr; gap: 40px; max-width: 1000px; width: 100%; }
        @media (max-width: 768px) { .container { grid-template-columns: 1fr; } }

        /* EDITOR COLUMN (Left) */
        .editor-col { background: #16181c; padding: 25px; border-radius: 16px; border: 1px solid #2f3336; height: fit-content; }
        h2 { font-size: 20px; margin-top: 0; margin-bottom: 20px; color: #e7e9ea; }
        
        label { display: block; font-size: 12px; color: #71767b; font-weight: 700; margin-bottom: 8px; text-transform: uppercase; letter-spacing: 0.5px; }
        
        textarea { width: 100%; height: 150px; background: #000; border: 1px solid #333; color: #fff; padding: 15px; border-radius: 12px; font-size: 16px; font-family: inherit; resize: none; outline: none; box-sizing: border-box; margin-bottom: 15px; }
        textarea:focus { border-color: #1d9bf0; }

        /* TOOLS ROW */
        .tools { display: flex; gap: 10px; margin-bottom: 20px; }
        .tool-btn { background: #2f3336; color: #fff; border: none; padding: 8px 12px; border-radius: 6px; cursor: pointer; font-size: 13px; font-weight: 600; transition: 0.2s; }
        .tool-btn:hover { background: #1d9bf0; }

        .file-upload { position: relative; overflow: hidden; display: inline-block; }
        .file-upload input[type=file] { font-size: 100px; position: absolute; left: 0; top: 0; opacity: 0; cursor: pointer; }
        
        /* ALGO TOGGLES */
        .toggles { display: flex; gap: 20px; margin-bottom: 25px; border-top: 1px solid #333; padding-top: 20px; }
        .toggle-item { display: flex; align-items: center; font-size: 14px; cursor: pointer; }
        .toggle-item input { margin-right: 8px; accent-color: #00ba7c; width: 16px; height: 16px; }

        /* PREVIEW COLUMN (Right) */
        .preview-col { position: relative; }
        
        /* PHONE MOCKUP */
        .tweet-card { background: #000; border: 1px solid #2f3336; border-radius: 16px; padding: 16px; max-width: 400px; margin: 0 auto; box-shadow: 0 0 50px rgba(255,255,255,0.05); }
        
        /* Header */
        .tweet-header { display: flex; gap: 12px; margin-bottom: 4px; }
        .avatar { width: 40px; height: 40px; background: #333; border-radius: 50%; overflow: hidden; }
        .avatar img { width: 100%; height: 100%; object-fit: cover; }
        .user-info { display: flex; flex-direction: column; justify-content: center; }
        .name-row { display: flex; align-items: center; gap: 4px; }
        .display-name { font-weight: 700; font-size: 15px; color: #e7e9ea; }
        .blue-check { width: 16px; height: 16px; fill: #1d9bf0; display: none; } /* Hidden by default */
        .handle { color: #71767b; font-size: 15px; }

        /* Content */
        .tweet-content { font-size: 17px; line-height: 1.4; color: #e7e9ea; white-space: pre-wrap; margin-bottom: 12px; margin-top: 5px; }
        .tweet-image { width: 100%; border-radius: 16px; border: 1px solid #2f3336; margin-top: 12px; display: none; }
        
        /* Metrics */
        .tweet-metrics { border-top: 1px solid #2f3336; margin-top: 12px; padding-top: 12px; display: flex; justify-content: space-between; color: #71767b; font-size: 13px; }

        /* SCORE DASHBOARD */
        .score-board { margin-top: 30px; background: #191b1f; border-radius: 12px; padding: 20px; border: 1px solid #333; text-align: center; }
        .score-val { font-size: 42px; font-weight: 900; color: #71767b; }
        .score-label { font-size: 12px; color: #555; letter-spacing: 1px; margin-bottom: 10px; display: block; }
        .feedback-list { text-align: left; margin-top: 15px; font-size: 13px; display: flex; flex-direction: column; gap: 8px; }
        .fb-item { display: flex; align-items: center; gap: 8px; color: #888; }
        .fb-icon { font-size: 16px; }

        /* MONETIZATION */
        .affiliate-banner { margin-top: 20px; background: linear-gradient(90deg, #1d9bf0, #1689d6); color: white; padding: 15px; border-radius: 8px; text-align: center; font-weight: bold; font-size: 14px; text-decoration: none; display: block; transition: transform 0.2s; }
        .affiliate-banner:hover { transform: translateY(-2px); }

    </style>
</head>
<body>

<div class="container">
    
    <div class="editor-col">
        <h2>📝 Composer & Grader</h2>
        
        <label>Draft Your Tweet</label>
        <textarea id="input" placeholder="What is happening?! (Type here to see preview)"></textarea>

        <div class="tools">
            <button class="tool-btn" onclick="formatText('bold')">𝐁old</button>
            <button class="tool-btn" onclick="formatText('italic')">𝐼talic</button>
            <div class="file-upload tool-btn">
                <span>📷 Upload Media</span>
                <input type="file" id="mediaUpload" accept="image/*,video/*">
            </div>
        </div>

        <label>Configuration</label>
        <div class="toggles">
            <label class="toggle-item">
                <input type="checkbox" id="checkPremium" onchange="update()"> 
                Verified (Blue Check)
            </label>
            <label class="toggle-item">
                <input type="checkbox" id="checkReply" onchange="update()"> 
                Will Reply to Comments
            </label>
        </div>

        <div class="score-board">
            <span class="score-label">PREDICTED ALGO SCORE</span>
            <div class="score-val" id="score">0</div>
            <div class="feedback-list" id="feedback">
                </div>
        </div>

        <a href="https://tweethunter.io/?via=javier-fernandez" class="affiliate-banner" target="_blank">
            🚀 Schedule this Banger with Tweet Hunter
        </a>
    </div>

    <div class="preview-col">
        <div style="text-align:center; color:#555; margin-bottom:10px; font-size:12px;">LIVE PREVIEW (Mobile)</div>
        
        <div class="tweet-card">
            <div class="tweet-header">
                <div class="avatar">
                    <img src="https://abs.twimg.com/sticky/default_profile_images/default_profile_400x400.png" id="pfp">
                </div>
                <div class="user-info">
                    <div class="name-row">
                        <span class="display-name">You</span>
                        <svg class="blue-check" id="badge" viewBox="0 0 22 22"><g><path d="M20.396 11c-.018-.646-.215-1.275-.57-1.816-.354-.54-.852-.972-1.438-1.246.223-.607.27-1.264.14-1.897-.131-.634-.437-1.218-.882-1.687-.47-.445-1.053-.75-1.687-.882-.633-.13-1.29-.083-1.897.14-.273-.587-.704-1.086-1.245-1.44S11.647 1.62 11 1.604c-.646.017-1.273.213-1.813.568s-.969.854-1.24 1.44c-.608-.223-1.267-.272-1.902-.14-.635.13-1.22.436-1.687.882-.445.47-.749 1.055-.878 1.688-.13.633-.08 1.29.144 1.896-.587.274-1.087.705-1.443 1.245-.356.54-.555 1.17-.574 1.817.02.647.218 1.276.574 1.817.356.54.856.972 1.443 1.245-.224.606-.274 1.263-.144 1.896.13.634.433 1.218.877 1.688.47.443 1.054.753 1.687.883.635.132 1.294.083 1.902-.14.27.585.7.1.087 1.24.442s1.167.55 1.813.568c.647-.018 1.275-.214 1.816-.568.54-.356.972-.856 1.245-1.442.604.223 1.26.27 1.897.14.634-.13 1.217-.433 1.687-.883.445-.47.75-1.054.882-1.687.13-.633.083-1.29-.14-1.896.586-.274 1.084-.705 1.438-1.245.354-.54.55-1.17.57-1.816zM9.662 14.85l-3.429-3.428 1.293-1.302 2.072 2.072 4.4-4.794 1.347 1.246z"></path></g></svg>
                    </div>
                    <span class="handle">@username</span>
                </div>
            </div>

            <div class="tweet-content" id="previewText">Start typing...</div>
            <img id="previewImage" class="tweet-image">

            <div class="tweet-metrics">
                <span>5:30 PM · Jan 20, 2026</span>
                <span><b>0</b> Views</span>
            </div>
        </div>
    </div>
</div>

<script>
    // ELEMENTS
    const input = document.getElementById('input');
    const previewText = document.getElementById('previewText');
    const previewImage = document.getElementById('previewImage');
    const mediaUpload = document.getElementById('mediaUpload');
    const checkPremium = document.getElementById('checkPremium');
    const checkReply = document.getElementById('checkReply');
    const badge = document.getElementById('badge');
    const scoreDisplay = document.getElementById('score');
    const feedbackList = document.getElementById('feedback');

    let hasMedia = false;
    let isVideo = false;

    // 1. REAL-TIME PREVIEW
    input.addEventListener('input', () => {
        previewText.innerText = input.value || "Start typing...";
        calculateScore();
    });

    // 2. MEDIA UPLOADER PREVIEW
    mediaUpload.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(e) {
                previewImage.src = e.target.result;
                previewImage.style.display = 'block';
                hasMedia = true;
                isVideo = file.type.startsWith('video');
                calculateScore();
            }
            reader.readAsDataURL(file);
        }
    });

    // 3. TEXT FORMATTER (Banger Feature)
    const maps = {
        bold: { "a":"𝐚","b":"𝐛","c":"𝐜","d":"𝐝","e":"𝐞","f":"𝐟","g":"𝐠","h":"𝐡","i":"𝐢","j":"𝐣","k":"𝐤","l":"𝐥","m":"𝐦","n":"𝐧","o":"𝐨","p":"𝐩","q":"𝐪","r":"𝐫","s":"𝐬","t":"𝐭","u":"𝐮","v":"𝐯","w":"𝐰","x":"𝐱","y":"𝐲","z":"𝐳","A":"𝐀","B":"𝐁","C":"𝐂","D":"𝐃","E":"𝐄","F":"𝐅","G":"𝐆","H":"𝐇","I":"𝐈","J":"𝐉","K":"𝐊","L":"𝐋","M":"𝐌","N":"𝐍","O":"𝐎","P":"𝐏","Q":"𝐐","R":"𝐑","S":"𝐒","T":"𝐓","U":"𝐔","V":"𝐕","W":"𝐖","X":"𝐗","Y":"𝐘","Z":"𝐙" },
        italic: { "a":"𝑎","b":"𝑏","c":"𝑐","d":"𝑑","e":"𝑒","f":"𝑓","g":"𝑔","h":"ℎ","i":"𝑖","j":"𝑗","k":"𝑘","l":"𝑙","m":"𝑚","n":"𝑛","o":"𝑜","p":"𝑝","q":"𝑞","r":"𝑟","s":"𝑠","t":"𝑡","u":"𝑢","v":"𝑣","w":"𝑤","x":"𝑥","y":"𝑦","z":"𝑧","A":"𝐴","B":"𝐵","C":"𝐶","D":"𝐷","E":"𝐸","F":"𝐹","G":"𝐺","H":"𝐻","I":"𝐼","J":"𝐽","K":"𝐾","L":"𝐿","M":"𝑀","N":"𝑁","O":"𝑂","P":"𝑃","Q":"𝑄","R":"𝑅","S":"𝑆","T":"𝑇","U":"𝑈","V":"𝑉","W":"𝑊","X":"𝑋","Y":"𝑌","Z":"𝑍" }
    };

    function formatText(type) {
        const start = input.selectionStart;
        const end = input.selectionEnd;
        const text = input.value;
        const selected = text.substring(start, end);
        
        if (!selected) return;

        const converted = selected.split('').map(char => maps[type][char] || char).join('');
        input.value = text.substring(0, start) + converted + text.substring(end);
        input.dispatchEvent(new Event('input')); // Trigger preview update
    }

    // 4. ALGORITHM SCORING LOGIC
    function calculateScore() {
        let score = 50; // Base score
        let feedback = [];
        const text = input.value;

        // Premium Check
        if (checkPremium.checked) {
            badge.style.display = 'block';
            score *= 1.5;
            feedback.push({icon: "🔹", text: "Verified Boost Active (+50%)"});
        } else {
            badge.style.display = 'none';
        }

        // Link Detection (Penalty)
        if (text.includes('http')) {
            score *= 0.1; // 90% Penalty
            feedback.push({icon: "🚩", text: "Link Detected! Reach crushed (-90%)"});
            scoreDisplay.style.color = "#f4212e";
        }

        // Media Logic
        if (hasMedia) {
            if (isVideo) {
                score *= 4.5;
                feedback.push({icon: "📹", text: "Video Detected (High Dwell Time)"});
            } else {
                score *= 2.0;
                feedback.push({icon: "🖼️", text: "Image Boost (+100%)"});
            }
        } else {
            feedback.push({icon: "⚠️", text: "Text Only (Low Engagement Probability)"});
        }

        // Reply Logic
        if (checkReply.checked) {
            score *= 1.5;
            feedback.push({icon: "💬", text: "Conversation Mode (+50%)"});
        }

        // Final Rendering
        const finalScore = Math.round(score);
        scoreDisplay.innerText = finalScore;
        
        if (finalScore > 500) scoreDisplay.style.color = "#00ba7c"; // Green
        else if (finalScore < 100) scoreDisplay.style.color = "#f4212e"; // Red
        else scoreDisplay.style.color = "#e7e9ea"; // White

        feedbackList.innerHTML = feedback.map(f => `
            <div class="fb-item">
                <span class="fb-icon">${f.icon}</span>
                <span>${f.text}</span>
            </div>
        `).join('');
    }

    function update() { calculateScore(); }
</script>

</body>
</html>
        
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

