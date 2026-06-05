/**
 * ============================================================
 * WireVibe — AI-Powered Wireframe to Code Generator
 * ============================================================
 * Author: Rafia Minhaj (@Rafiaminhaj)
 * License: MIT
 * Built for: Elite Coders Open Source Hackathon 2026
 * 
 * Architecture:
 * ┌─────────────────────────────────────────────┐
 * │  Module 1: Canvas Engine (Drawing System)   │
 * │  Module 2: Tool Manager (Brush/Eraser/Clear)│
 * │  Module 3: File I/O (Upload/Download)       │
 * │  Module 4: AI Engine (Gemini Vision API)    │
 * │  Module 5: Preview System (Tabs/Devices)    │
 * │  Module 6: Settings Manager (BYOK API Key)  │
 * └─────────────────────────────────────────────┘
 * ============================================================
 */

document.addEventListener('DOMContentLoaded', () => {

    // =========================================================
    // MODULE 1: CANVAS ENGINE
    // Handles all drawing operations, canvas sizing, and
    // coordinate mapping for both mouse and touch inputs.
    // =========================================================

    const canvas = document.getElementById('drawing-canvas');
    const ctx = canvas.getContext('2d');
    const container = document.querySelector('.canvas-container');

    /**
     * Resizes the canvas to match its container dimensions.
     * Called on initial load and window resize events.
     */
    function resizeCanvas() {
        canvas.width = container.clientWidth;
        canvas.height = container.clientHeight;
        ctx.fillStyle = "rgba(255, 255, 255, 0.0)";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
    }
    
    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();

    // Drawing state machine
    let isDrawing = false;
    let currentMode = 'draw'; // 'draw' | 'erase'
    let brushSize = document.getElementById('brush-size').value;

    /**
     * Maps raw mouse/touch event coordinates to canvas pixel coordinates.
     * Accounts for CSS scaling and canvas resolution differences.
     * @param {Event} evt - Mouse or Touch event
     * @returns {{x: number, y: number}} Canvas-space coordinates
     */
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

    function startPosition(e) {
        isDrawing = true;
        draw(e);
    }

    function endPosition() {
        isDrawing = false;
        ctx.beginPath();
    }

    /**
     * Core drawing function. Renders strokes on each pointer move.
     * Supports two modes:
     *   - 'draw': Standard brush with selected color
     *   - 'erase': Uses destination-out composite for transparent erasing
     * @param {Event} e - Mouse or Touch move event
     */
    function draw(e) {
        if (!isDrawing) return;
        
        e.preventDefault(); // Prevent scrolling on touch devices
        const pos = getMousePos(e);

        ctx.lineWidth = brushSize;
        ctx.lineCap = 'round';
        
        if (currentMode === 'draw') {
            ctx.strokeStyle = document.getElementById('brush-color').value;
            ctx.globalCompositeOperation = 'source-over';
        } else if (currentMode === 'erase') {
            ctx.globalCompositeOperation = 'destination-out';
            ctx.lineWidth = brushSize * 8; // 8x multiplier for fast erasing
        }

        ctx.lineTo(pos.x, pos.y);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(pos.x, pos.y);
    }

    // Mouse event bindings
    canvas.addEventListener('mousedown', startPosition);
    canvas.addEventListener('mouseup', endPosition);
    canvas.addEventListener('mousemove', draw);
    canvas.addEventListener('mouseout', endPosition);

    // Touch event bindings (mobile support)
    canvas.addEventListener('touchstart', startPosition, {passive: false});
    canvas.addEventListener('touchend', endPosition);
    canvas.addEventListener('touchmove', draw, {passive: false});


    // =========================================================
    // MODULE 2: TOOL MANAGER
    // Controls drawing tool state (brush, eraser, clear canvas)
    // and brush size adjustments.
    // =========================================================

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


    // =========================================================
    // MODULE 3: FILE I/O
    // Handles sketch download (PNG export with background) and
    // image upload (drawing existing wireframes onto canvas).
    // =========================================================

    const btnDownload = document.getElementById('btn-download');
    const botMessage = document.getElementById('vibebot-message');

    /**
     * Exports the canvas as a PNG with a dark background.
     * Creates a temporary offscreen canvas, composites the
     * background color with the drawing, then triggers download.
     */
    btnDownload.addEventListener('click', () => {
        const tempCanvas = document.createElement('canvas');
        tempCanvas.width = canvas.width;
        tempCanvas.height = canvas.height;
        const tempCtx = tempCanvas.getContext('2d');
        
        // Composite: dark background + user drawing
        tempCtx.fillStyle = '#0b0615';
        tempCtx.fillRect(0, 0, tempCanvas.width, tempCanvas.height);
        tempCtx.drawImage(canvas, 0, 0);
        
        const dataURL = tempCanvas.toDataURL('image/png');
        const link = document.createElement('a');
        link.download = 'wirevibe-sketch.png';
        link.href = dataURL;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    });

    // Image upload handling
    const btnUpload = document.getElementById('btn-upload');
    const imageUploadInput = document.getElementById('image-upload');

    btnUpload.addEventListener('click', () => {
        imageUploadInput.click();
    });

    /**
     * Processes uploaded images: scales them to fit the canvas
     * while maintaining aspect ratio (contain-fit algorithm).
     */
    imageUploadInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (event) => {
                const img = new Image();
                img.onload = () => {
                    ctx.clearRect(0, 0, canvas.width, canvas.height);
                    // Contain-fit scaling algorithm
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


    // =========================================================
    // MODULE 4: AI ENGINE (Gemini Vision API Integration)
    // Core intelligence layer. Captures canvas as base64 image,
    // sends to Google Gemini 1.5 Flash Vision API, and receives
    // production-ready HTML/CSS code in response.
    // Supports BYOK (Bring Your Own Key) and Demo Mode fallback.
    // =========================================================

    const btnVibe = document.getElementById('btn-vibe');
    const btnBack = document.getElementById('btn-back');
    const btnCopy = document.getElementById('btn-copy');
    const card = document.getElementById('vibe-card');
    const scanOverlay = document.getElementById('scan-overlay');
    const generatedCodeElement = document.getElementById('generated-code');

    // Demo mode fallback code (shown when no API key is configured)
    const DEMO_CODE_TEMPLATE = `<!DOCTYPE html>
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

    let currentCodeResult = DEMO_CODE_TEMPLATE;

    /**
     * AI Generation Pipeline:
     * 1. Capture canvas as base64 JPEG
     * 2. Send to Gemini 1.5 Flash Vision API with system prompt
     * 3. Parse response and clean markdown formatting
     * 4. Display generated code with syntax highlighting
     * 5. Update live preview iframe
     * Falls back to Demo Mode if no API key is configured.
     */
    btnVibe.addEventListener('click', async () => {
        scanOverlay.classList.add('active');
        btnVibe.disabled = true;
        btnVibe.innerHTML = "Processing...";
        
        const apiKey = localStorage.getItem('wirevibe_gemini_key');
        
        if (apiKey) {
            // === BYOK Mode: Real AI Generation ===
            if(botMessage) botMessage.textContent = "API Key found! Connecting to Gemini Vision API... (BYOK Mode)";
            
            try {
                const base64Image = canvas.toDataURL('image/jpeg', 0.8).split(',')[1];
                
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
                
                // Strip markdown code fences if present
                generatedText = generatedText.replace(/^```(html)?\n/, '').replace(/\n```$/, '');
                
                currentCodeResult = generatedText.trim();
                if(botMessage) botMessage.textContent = "Success! Code generated perfectly.";
                
            } catch (error) {
                console.error('[WireVibe AI Engine]', error);
                if(botMessage) botMessage.textContent = "Error connecting to AI. Using Demo Mode instead. Check your API Key!";
                currentCodeResult = DEMO_CODE_TEMPLATE;
            }
        } else {
            // === Demo Mode: Simulated Generation ===
            if(botMessage) botMessage.textContent = "Analyzing pixels... generating HTML structure... wait for it... (Demo Mode)";
            currentCodeResult = DEMO_CODE_TEMPLATE;
            await new Promise(resolve => setTimeout(resolve, 2000));
        }

        // Flip card to reveal generated code
        scanOverlay.classList.remove('active');
        card.classList.add('is-flipped');
        
        // Syntax highlighting via Highlight.js
        generatedCodeElement.textContent = currentCodeResult;
        hljs.highlightElement(generatedCodeElement);
        
        // Inject into live preview iframe
        const iframe = document.getElementById('preview-frame');
        if (iframe) {
            iframe.srcdoc = currentCodeResult;
        }

        // Reset button state
        setTimeout(() => {
            btnVibe.disabled = false;
            btnVibe.innerHTML = `<span class="btn-text">✨ Vibe It</span>`;
        }, 500);
    });

    btnBack.addEventListener('click', () => {
        card.classList.remove('is-flipped');
    });

    // Clipboard copy with visual feedback
    btnCopy.addEventListener('click', () => {
        navigator.clipboard.writeText(currentCodeResult).then(() => {
            const originalText = btnCopy.textContent;
            btnCopy.textContent = "✅ Copied!";
            setTimeout(() => {
                btnCopy.textContent = originalText;
            }, 2000);
        });
    });

    // HTML file download with confetti celebration 🎉
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
            
            // Confetti celebration animation
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


    // =========================================================
    // MODULE 5: PREVIEW SYSTEM
    // Tab-based view switching between Code and Live Preview.
    // Includes responsive device toggles (Desktop/Tablet/Mobile)
    // to simulate different viewport widths.
    // =========================================================

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
        
        previewFrame.srcdoc = currentCodeResult;
        if(botMessage) botMessage.textContent = "Wow! Look at that UI! You can toggle devices up top.";
    });

    // Device viewport presets (standard breakpoints)
    const DEVICE_WIDTHS = {
        desktop: '100%',
        tablet: '768px',
        mobile: '375px'
    };

    btnDesktop.addEventListener('click', () => {
        btnDesktop.classList.add('active');
        btnTablet.classList.remove('active');
        btnMobile.classList.remove('active');
        previewFrame.style.width = DEVICE_WIDTHS.desktop;
    });

    btnTablet.addEventListener('click', () => {
        btnTablet.classList.add('active');
        btnDesktop.classList.remove('active');
        btnMobile.classList.remove('active');
        previewFrame.style.width = DEVICE_WIDTHS.tablet;
    });

    btnMobile.addEventListener('click', () => {
        btnMobile.classList.add('active');
        btnDesktop.classList.remove('active');
        btnTablet.classList.remove('active');
        previewFrame.style.width = DEVICE_WIDTHS.mobile;
    });


    // =========================================================
    // MODULE 6: SETTINGS MANAGER (BYOK API Key)
    // Secure client-side API key management using localStorage.
    // Keys never leave the browser — zero server-side exposure.
    // =========================================================

    const btnSettings = document.getElementById('btn-settings');
    const settingsModal = document.getElementById('settings-modal');
    const btnCloseModal = document.getElementById('btn-close-modal');
    const btnSaveKey = document.getElementById('btn-save-key');
    const apiKeyInput = document.getElementById('api-key-input');

    // Restore saved key on startup
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

}); // End DOMContentLoaded
