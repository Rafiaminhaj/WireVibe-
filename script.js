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
            ctx.strokeStyle = '#ffd700'; // Gold color for drawing
            ctx.globalCompositeOperation = 'source-over';
        } else if (currentMode === 'erase') {
            ctx.globalCompositeOperation = 'destination-out';
            ctx.lineWidth = brushSize * 2; // Make eraser bigger
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

    btnVibe.addEventListener('click', () => {
        // Show scan overlay
        scanOverlay.classList.add('active');
        btnVibe.disabled = true;
        btnVibe.innerHTML = "Processing...";

        // Fake processing delay for dramatic effect
        setTimeout(() => {
            scanOverlay.classList.remove('active');
            card.classList.add('is-flipped');
            
            // Set code and highlight
            generatedCodeElement.textContent = fakeCodeResult;
            hljs.highlightElement(generatedCodeElement);

            // Reset button
            setTimeout(() => {
                btnVibe.disabled = false;
                btnVibe.innerHTML = `<span class="btn-text">✨ Vibe It</span>`;
            }, 500);

        }, 2500);
    });

    btnBack.addEventListener('click', () => {
        card.classList.remove('is-flipped');
    });

    btnCopy.addEventListener('click', () => {
        navigator.clipboard.writeText(fakeCodeResult).then(() => {
            const originalText = btnCopy.textContent;
            btnCopy.textContent = "✅ Copied!";
            setTimeout(() => {
                btnCopy.textContent = originalText;
            }, 2000);
        });
    });
});
