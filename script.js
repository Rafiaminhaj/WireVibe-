document.addEventListener('DOMContentLoaded', () => {
    // --- Canvas Setup ---
    const canvas = document.getElementById('drawing-canvas');
    const ctx = canvas.getContext('2d');
    const container = document.querySelector('.canvas-container');

    // Resize canvas to fit container
    function resizeCanvas() {
        canvas.width = container.clientWidth;
        canvas.height = container.clientHeight;
        // Set default background
        ctx.fillStyle = "rgba(255, 255, 255, 0.0)";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
    }
    
    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();

    // --- Drawing State ---
    let isDrawing = false;
    let currentMode = 'draw'; // 'draw' or 'erase'
    let brushSize = document.getElementById('brush-size').value;

    // --- Drawing Events ---
    function startPosition(e) {
        isDrawing = true;
        draw(e);
    }

    function endPosition() {
        isDrawing = false;
        ctx.beginPath();
    }

    function getMousePos(evt) {
        const rect = canvas.getBoundingClientRect();
        const scaleX = canvas.width / rect.width;
        const scaleY = canvas.height / rect.height;
        
        let clientX = evt.clientX;
        let clientY = evt.clientY;
        
        if (evt.touches && evt.touches.length > 0) {
            clientX = evt.touches[0].clientX;
            clientY = evt.touches[0].clientY;
        }

        return {
            x: (clientX - rect.left) * scaleX,
            y: (clientY - rect.top) * scaleY
        };
    }

    function draw(e) {
        if (!isDrawing) return;
        
        e.preventDefault(); // Prevent scrolling on touch
        const pos = getMousePos(e);

        ctx.lineWidth = brushSize;
        ctx.lineCap = 'round';
        
        if (currentMode === 'draw') {
            ctx.strokeStyle = document.getElementById('brush-color').value;
            ctx.globalCompositeOperation = 'source-over';
        } else if (currentMode === 'erase') {
            ctx.globalCompositeOperation = 'destination-out';
            ctx.lineWidth = brushSize * 8; // Make eraser FAT for quick rubbing
        }

        ctx.lineTo(pos.x, pos.y);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(pos.x, pos.y);
    }

    // Mouse events
    canvas.addEventListener('mousedown', startPosition);
    canvas.addEventListener('mouseup', endPosition);
    canvas.addEventListener('mousemove', draw);
    canvas.addEventListener('mouseout', endPosition);

    // Touch events for mobile
    canvas.addEventListener('touchstart', startPosition, {passive: false});
    canvas.addEventListener('touchend', endPosition);
    canvas.addEventListener('touchmove', draw, {passive: false});

    // --- Tools ---
    const btnDraw = document.getElementById('btn-draw');
    const btnErase = document.getElementById('btn-erase');
    const btnClear = document.getElementById('btn-clear');
    const brushSizeInput = document.getElementById('brush-size');

    btnDraw.addEventListener('click', () => {
        currentMode = 'draw';
        btnDraw.classList.add('active');
        btnErase.classList.remove('active');
    });

    btnErase.addEventListener('click', () => {
        currentMode = 'erase';
        btnErase.classList.add('active');
        btnDraw.classList.remove('active');
    });

    btnClear.addEventListener('click', () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
    });

    brushSizeInput.addEventListener('input', (e) => {
        brushSize = e.target.value;
    });

    // Download Feature
    const btnDownload = document.getElementById('btn-download');
    btnDownload.addEventListener('click', () => {
        // Create a temporary canvas to add a background color (since main canvas is transparent)
        const tempCanvas = document.createElement('canvas');
        tempCanvas.width = canvas.width;
        tempCanvas.height = canvas.height;
        const tempCtx = tempCanvas.getContext('2d');
        
        // Fill dark background
        tempCtx.fillStyle = '#0b0615';
        tempCtx.fillRect(0, 0, tempCanvas.width, tempCanvas.height);
        
        // Draw the original canvas over it
        tempCtx.drawImage(canvas, 0, 0);
        
        const dataURL = tempCanvas.toDataURL('image/png');
        const link = document.createElement('a');
        link.download = 'wirevibe-sketch.png';
        link.href = dataURL;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    });

    // Image Upload Feature
    const btnUpload = document.getElementById('btn-upload');
    const imageUploadInput = document.getElementById('image-upload');
    const botMessage = document.getElementById('vibebot-message');

    btnUpload.addEventListener('click', () => {
        imageUploadInput.click();
    });

    imageUploadInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (event) => {
                const img = new Image();
                img.onload = () => {
                    ctx.clearRect(0, 0, canvas.width, canvas.height);
                    // Draw image scaled to fit canvas
                    const scale = Math.min(canvas.width / img.width, canvas.height / img.height);
                    const x = (canvas.width / 2) - (img.width / 2) * scale;
                    const y = (canvas.height / 2) - (img.height / 2) * scale;
                    ctx.drawImage(img, x, y, img.width * scale, img.height * scale);
                    if(botMessage) botMessage.textContent = "Ooh, nice upload! That looks complicated. Click Vibe It when ready!";
                };
                img.src = event.target.result;
            };
            reader.readAsDataURL(file);
        }
    });

    // --- Flip & Generate Logic (Hackathon Demo Mode) ---
    const btnVibe = document.getElementById('btn-vibe');
    const btnBack = document.getElementById('btn-back');
    const btnCopy = document.getElementById('btn-copy');
    const card = document.getElementById('vibe-card');
    const scanOverlay = document.getElementById('scan-overlay');
    const generatedCodeElement = document.getElementById('generated-code');

    const fakeCodeResult = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Generated UI</title>
  <style>
    body {
      background: #111;
      color: #fff;
      font-family: system-ui;
      display: flex;
      justify-content: center;
      align-items: center;
      height: 100vh;
    }
    .card {
      background: rgba(255,255,255,0.1);
      padding: 2rem;
      border-radius: 12px;
      backdrop-filter: blur(10px);
      box-shadow: 0 4px 30px rgba(0,0,0,0.5);
    }
    .btn {
      background: #9d4edd;
      color: #fff;
      border: none;
      padding: 10px 20px;
      border-radius: 5px;
      cursor: pointer;
    }
  </style>
</head>
<body>
  <div class="card">
    <h1>Hello WireVibe!</h1>
    <p>This UI was generated from your sketch.</p>
    <button class="btn">Click Me</button>
  </div>
</body>
</html>`;

    let currentCodeResult = fakeCodeResult;

    btnVibe.addEventListener('click', async () => {
        // Show scan overlay
        scanOverlay.classList.add('active');
        btnVibe.disabled = true;
        btnVibe.innerHTML = "Processing...";
        
        const apiKey = localStorage.getItem('wirevibe_gemini_key');
        if (apiKey) {
            if(botMessage) botMessage.textContent = "API Key found! Connecting to Gemini Vision API... (BYOK Mode)";
            
            try {
                // 1. Get base64 image from canvas
                const base64Image = canvas.toDataURL('image/jpeg', 0.8).split(',')[1];
                
                // 2. Call Gemini API
                const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        contents: [{
                            parts: [
                                { text: "You are an expert frontend web developer. Look at this wireframe/sketch and write production-ready HTML and CSS to recreate it. Use modern styling, glassmorphism, flexbox, and nice colors. Return ONLY raw HTML code (with embedded CSS in <style>). Do NOT wrap the response in markdown backticks (like ```html)." },
                                { inlineData: { mimeType: "image/jpeg", data: base64Image } }
                            ]
                        }]
                    })
                });

                if (!response.ok) {
                    throw new Error(`API Error: ${response.status} - Invalid Key or Server Error`);
                }

                const data = await response.json();
                let generatedText = data.candidates[0].content.parts[0].text;
                
                // Clean markdown if present
                generatedText = generatedText.replace(/^```(html)?\n/, '').replace(/\n```$/, '');
                
                currentCodeResult = generatedText.trim();
                if(botMessage) botMessage.textContent = "Success! Code generated perfectly.";
                
            } catch (error) {
                console.error(error);
                if(botMessage) botMessage.textContent = "Error connecting to AI. Using Demo Mode instead. Check your API Key!";
                currentCodeResult = fakeCodeResult;
            }
        } else {
            if(botMessage) botMessage.textContent = "Analyzing pixels... generating HTML structure... wait for it... (Demo Mode)";
            currentCodeResult = fakeCodeResult;
            // Fake delay for demo mode
            await new Promise(resolve => setTimeout(resolve, 2000));
        }

        // Show result
        scanOverlay.classList.remove('active');
        card.classList.add('is-flipped');
        
        // Set code and highlight
        generatedCodeElement.textContent = currentCodeResult;
        hljs.highlightElement(generatedCodeElement);
        
        // Update live preview iframe if it exists
        const iframe = document.getElementById('preview-frame');
        if (iframe) {
            iframe.srcdoc = currentCodeResult;
        }

        // Reset button
        setTimeout(() => {
            btnVibe.disabled = false;
            btnVibe.innerHTML = `<span class="btn-text">✨ Vibe It</span>`;
        }, 500);
    });

    btnBack.addEventListener('click', () => {
        card.classList.remove('is-flipped');
    });

    btnCopy.addEventListener('click', () => {
        navigator.clipboard.writeText(currentCodeResult).then(() => {
            const originalText = btnCopy.textContent;
            btnCopy.textContent = "✅ Copied!";
            setTimeout(() => {
                btnCopy.textContent = originalText;
            }, 2000);
        });
    });

    const btnDownloadHTML = document.getElementById('btn-download-html');
    if (btnDownloadHTML) {
        btnDownloadHTML.addEventListener('click', () => {
            const blob = new Blob([currentCodeResult], { type: "text/html" });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = "wirevibe-generated.html";
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
            
            // Fire Confetti! 🎉
            if (typeof confetti === 'function') {
                confetti({
                    particleCount: 100,
                    spread: 70,
                    origin: { y: 0.6 },
                    colors: ['#9d4edd', '#ff9e00', '#00e5ff']
                });
            }
            
            const originalText = btnDownloadHTML.textContent;
            btnDownloadHTML.textContent = "✅ Downloaded!";
            setTimeout(() => {
                btnDownloadHTML.textContent = originalText;
            }, 2000);
        });
    }

    // --- Tabs & Preview Logic ---
    const tabCode = document.getElementById('tab-code');
    const tabPreview = document.getElementById('tab-preview');
    const codeView = document.getElementById('code-view');
    const previewView = document.getElementById('preview-view');
    const previewFrame = document.getElementById('preview-frame');
    const deviceToggles = document.getElementById('device-toggles');
    const btnDesktop = document.getElementById('device-desktop');
    const btnTablet = document.getElementById('device-tablet');
    const btnMobile = document.getElementById('device-mobile');

    tabCode.addEventListener('click', () => {
        tabCode.classList.add('active');
        tabPreview.classList.remove('active');
        codeView.style.display = 'block';
        previewView.style.display = 'none';
        deviceToggles.style.display = 'none';
    });

    tabPreview.addEventListener('click', () => {
        tabPreview.classList.add('active');
        tabCode.classList.remove('active');
        codeView.style.display = 'none';
        previewView.style.display = 'flex';
        deviceToggles.style.display = 'flex';
        
        // Inject fake result into iframe
        previewFrame.srcdoc = fakeCodeResult;
        if(botMessage) botMessage.textContent = "Wow! Look at that UI! You can toggle devices up top.";
    });

    btnDesktop.addEventListener('click', () => {
        btnDesktop.classList.add('active');
        btnTablet.classList.remove('active');
        btnMobile.classList.remove('active');
        previewFrame.style.width = '100%';
    });

    btnTablet.addEventListener('click', () => {
        btnTablet.classList.add('active');
        btnDesktop.classList.remove('active');
        btnMobile.classList.remove('active');
        previewFrame.style.width = '768px';
    });

    btnMobile.addEventListener('click', () => {
        btnMobile.classList.add('active');
        btnDesktop.classList.remove('active');
        btnTablet.classList.remove('active');
        previewFrame.style.width = '375px';
    });

    // --- Settings Modal & API Key Logic ---
    const btnSettings = document.getElementById('btn-settings');
    const settingsModal = document.getElementById('settings-modal');
    const btnCloseModal = document.getElementById('btn-close-modal');
    const btnSaveKey = document.getElementById('btn-save-key');
    const apiKeyInput = document.getElementById('api-key-input');

    // Load saved key on startup
    const savedKey = localStorage.getItem('wirevibe_gemini_key');
    if (savedKey && apiKeyInput) {
        apiKeyInput.value = savedKey;
    }

    if(btnSettings) {
        btnSettings.addEventListener('click', () => {
            settingsModal.classList.add('active');
        });
    }

    if(btnCloseModal) {
        btnCloseModal.addEventListener('click', () => {
            settingsModal.classList.remove('active');
        });
    }

    if(btnSaveKey) {
        btnSaveKey.addEventListener('click', () => {
            const key = apiKeyInput.value.trim();
            if (key) {
                localStorage.setItem('wirevibe_gemini_key', key);
                btnSaveKey.textContent = "Saved!";
                setTimeout(() => {
                    btnSaveKey.textContent = "Save Key";
                    settingsModal.classList.remove('active');
                }, 1000);
            } else {
                localStorage.removeItem('wirevibe_gemini_key');
                btnSaveKey.textContent = "Cleared!";
                setTimeout(() => {
                    btnSaveKey.textContent = "Save Key";
                    settingsModal.classList.remove('active');
                }, 1000);
            }
        });
    }
});
