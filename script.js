// ===================================
// GLOBAL VARIABLES
// ===================================
let currentScore = 0;
let currentDifficulty = 'medium';

// ===================================
// NAVBAR SCROLL EFFECT
// ===================================
window.addEventListener('scroll', () => {
    const navbar = document.getElementById('navbar');
    if (navbar) {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    }
});

// ===================================
// HAMBURGER MENU TOGGLE
// ===================================
const hamburger = document.getElementById('hamburger');
const navMenu = document.getElementById('navMenu');

if (hamburger) {
    hamburger.addEventListener('click', () => {
        navMenu.classList.toggle('active');
    });
}

// ===================================
// SMOOTH SCROLL FOR ANCHOR LINKS
// ===================================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        if (href !== '#' && document.querySelector(href)) {
            e.preventDefault();
            document.querySelector(href).scrollIntoView({
                behavior: 'smooth'
            });
        }
    });
});

// ===================================
// FADE IN ON SCROLL ANIMATION
// ===================================
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('fade-in');
        }
    });
}, observerOptions);

// Observe feature cards and other elements
document.querySelectorAll('.feature-card, .stat-card, .insight-item').forEach(el => {
    observer.observe(el);
});

// ===================================
// QUESTION ANALYZER - DIFFICULTY ANALYSIS
// ===================================
const analyzeBtn = document.getElementById('analyzeBtn');
const questionText = document.getElementById('questionText');
const resultContent = document.getElementById('resultContent');
const placeholderContent = document.getElementById('placeholderContent');
const suggestionBox = document.getElementById('suggestionBox');

if (analyzeBtn) {
    analyzeBtn.addEventListener('click', () => {
        const question = questionText.value.trim();

        if (!question) {
            alert('Please enter a question to analyze.');
            return;
        }

        // Show loading state
        analyzeBtn.innerHTML = '<div class="loading"></div> Analyzing...';
        analyzeBtn.disabled = true;

        // Simulate API call with timeout
        setTimeout(() => {
            analyzeQuestion(question);
            analyzeBtn.innerHTML = `
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M13 10V3L4 14H11L11 21L20 10L13 10Z" fill="currentColor"/>
                </svg>
                Analyze Difficulty
            `;
            analyzeBtn.disabled = false;
        }, 1500);
    });
}

// ===================================
// UPLOAD PDF/DOC BUTTON
// ===================================
const uploadBtn = document.querySelector('.btn-upload');

if (uploadBtn) {
    // Create a hidden file input
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = '.pdf,.doc,.docx';
    fileInput.style.display = 'none';
    document.body.appendChild(fileInput);

    uploadBtn.addEventListener('click', () => {
        fileInput.click();
    });

    fileInput.addEventListener('change', () => {
        const file = fileInput.files[0];
        if (!file) return;

        const allowedTypes = ['application/pdf', 'application/msword',
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
        const allowedExts = ['.pdf', '.doc', '.docx'];
        const ext = file.name.slice(file.name.lastIndexOf('.')).toLowerCase();

        if (!allowedTypes.includes(file.type) && !allowedExts.includes(ext)) {
            showToast('Please upload a valid PDF or DOC/DOCX file.', '#EF4444');
            return;
        }

        // Show extracting state on button
        uploadBtn.textContent = '\u23F3 Extracting...';
        uploadBtn.style.color = '#F59E0B';
        uploadBtn.disabled = true;

        setTimeout(() => {
            uploadBtn.textContent = '\u2713 ' + file.name;
            uploadBtn.style.color = '#10B981';
            uploadBtn.disabled = false;
            setTimeout(() => {
                uploadBtn.textContent = 'Upload PDF/DOC';
                uploadBtn.style.color = '';
            }, 4000);

            // Simulated questions extracted from the document
            // ==============================
// FILE INPUT HANDLER
// ==============================
document.getElementById("fileInput").addEventListener("change", function (e) {
    const file = e.target.files[0];
    if (!file) return;

    if (file.type === "application/pdf") {
        readPDF(file);
    } else {
        alert("Please upload a PDF file");
    }
});

// ==============================
// READ PDF
// ==============================
async function readPDF(file) {
    const reader = new FileReader();

    reader.onload = async function () {
        const typedarray = new Uint8Array(this.result);
        const pdf = await pdfjsLib.getDocument(typedarray).promise;

        let text = "";

        for (let i = 1; i <= pdf.numPages; i++) {
            let page = await pdf.getPage(i);
            let content = await page.getTextContent();

            content.items.forEach(item => {
                text += item.str + "\n"; // important
            });
        }

        const questions = extractQuestions(text);

        showExtractedQuestionsPanel(file.name, questions);

        showToast(
            questions.length + ' questions extracted from "' + file.name + '"!',
            '#10B981'
        );
    };

    reader.readAsArrayBuffer(file);
}

// ==============================
// EXTRACT QUESTIONS
// ==============================
function extractQuestions(text) {
    const lines = text.split("\n");

    let questions = [];
    let qNo = 1;

    lines.forEach(line => {
        line = line.trim();

        if (
            line.endsWith("?") ||
            /^\d+[\.\)]\s/.test(line)
        ) {
            questions.push({
                no: qNo++,
                text: line
            });
        }
    });

    return questions;
}

// ==============================
// HASH SCORE (FOR DIFFICULTY)
// ==============================
function hashScore(text) {
    let score = 0;
    for (let i = 0; i < text.length; i++) {
        score += text.charCodeAt(i);
    }
    return score % 100;
}

// ==============================
// DIFFICULTY
// ==============================
function getDifficultyInfo(score) {
    if (score <= 40) return { label: 'EASY', color: '#10B981', bg: 'rgba(16,185,129,0.12)' };
    if (score <= 75) return { label: 'MEDIUM', color: '#F59E0B', bg: 'rgba(245,158,11,0.12)' };
    return { label: 'HARD', color: '#EF4444', bg: 'rgba(239,68,68,0.12)' };
}

// ==============================
// SHOW PANEL
// ==============================
function showExtractedQuestionsPanel(fileName, questions) {
    var existing = document.getElementById('extractedPanel');
    if (existing) existing.remove();

    var questionTextEl = document.getElementById('questionText');

    var overlay = document.createElement('div');
    overlay.id = 'extractedPanel';
    overlay.style.cssText =
        'position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.65);z-index:50000;display:flex;align-items:center;justify-content:center;backdrop-filter:blur(4px);';

    var panel = document.createElement('div');
    panel.style.cssText =
        'background:#1E293B;border:1px solid #334155;border-radius:14px;width:700px;max-width:95vw;max-height:85vh;display:flex;flex-direction:column;box-shadow:0 25px 60px rgba(0,0,0,0.5);font-family:Inter,sans-serif;';

    // Header
    var header = document.createElement('div');
    header.style.cssText =
        'padding:18px 22px;border-bottom:1px solid #334155;display:flex;align-items:center;justify-content:space-between;';
    header.innerHTML =
        '<div><div style="font-size:15px;font-weight:700;color:#F1F5F9;">📄 Questions Extracted</div><div style="font-size:12px;color:#64748B;margin-top:2px;">' +
        fileName +
        ' · ' +
        questions.length +
        ' questions found</div></div><button id="closePanelBtn" style="background:none;border:none;cursor:pointer;color:#94A3B8;font-size:20px;">&times;</button>';
    panel.appendChild(header);

    // List
    var list = document.createElement('div');
    list.style.cssText =
        'overflow-y:auto;flex:1;padding:14px 16px;display:flex;flex-direction:column;gap:10px;';

    var bloomLevels = [
        { level: 'Remember', range: [0, 20] },
        { level: 'Understand', range: [21, 40] },
        { level: 'Apply', range: [41, 60] },
        { level: 'Analyze', range: [61, 80] },
        { level: 'Create', range: [81, 100] }
    ];

    questions.forEach(function (q) {
        var score = hashScore(q.text);
        var diff = getDifficultyInfo(score);
        var bloom = bloomLevels.find(b => score >= b.range[0] && score <= b.range[1]);

        var card = document.createElement('div');
        card.style.cssText =
            'background:#0F172A;border:1px solid #334155;border-radius:10px;padding:14px;';

        var loadBtn = document.createElement('button');
        loadBtn.textContent = 'Load';
        loadBtn.style.cssText =
            'background:#3B82F6;border:none;color:white;padding:6px 12px;border-radius:6px;cursor:pointer;';

        loadBtn.onclick = function () {
            if (questionTextEl) questionTextEl.value = q.text;
            overlay.remove();
        };

        card.innerHTML =
            `<div style="color:#E2E8F0;font-size:14px;margin-bottom:8px;"><b>Q${q.no}:</b> ${q.text}</div>
             <div style="font-size:12px;color:${diff.color};margin-bottom:4px;">Difficulty: ${diff.label}</div>
             <div style="font-size:12px;color:#94A3B8;margin-bottom:8px;">Bloom: ${bloom.level}</div>`;

        card.appendChild(loadBtn);
        list.appendChild(card);
    });

    panel.appendChild(list);
    overlay.appendChild(panel);
    document.body.appendChild(overlay);

    document.getElementById('closePanelBtn').onclick = () => overlay.remove();
}

// ==============================
// TOAST
// ==============================
function showToast(msg, color) {
    const toast = document.createElement("div");
    toast.textContent = msg;
    toast.style.cssText = `
        position:fixed;bottom:20px;right:20px;
        background:${color};color:white;
        padding:10px 16px;border-radius:6px;
        font-size:13px;z-index:99999;
    `;
    document.body.appendChild(toast);

    setTimeout(() => toast.remove(), 3000);
}

            showExtractedQuestionsPanel(file.name, extractedQuestions);
            showToast(extractedQuestions.length + ' questions extracted from "' + file.name + '"!', '#10B981');
        }, 1200);

        
    });
}

// ===================================
// EXTRACTED QUESTIONS PANEL
// ===================================
function getDifficultyInfo(score) {
    if (score <= 40) return { label: 'EASY', color: '#10B981', bg: 'rgba(16,185,129,0.12)' };
    if (score <= 75) return { label: 'MEDIUM', color: '#F59E0B', bg: 'rgba(245,158,11,0.12)' };
    return { label: 'HARD', color: '#EF4444', bg: 'rgba(239,68,68,0.12)' };
}

function showExtractedQuestionsPanel(fileName, questions) {
    var existing = document.getElementById('extractedPanel');
    if (existing) existing.remove();

    var questionTextEl = document.getElementById('questionText');

    var overlay = document.createElement('div');
    overlay.id = 'extractedPanel';
    overlay.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.65);z-index:50000;display:flex;align-items:center;justify-content:center;backdrop-filter:blur(4px);';

    var panel = document.createElement('div');
    panel.style.cssText = 'background:#1E293B;border:1px solid #334155;border-radius:14px;width:700px;max-width:95vw;max-height:85vh;display:flex;flex-direction:column;box-shadow:0 25px 60px rgba(0,0,0,0.5);font-family:Inter,sans-serif;';

    // Header
    var header = document.createElement('div');
    header.style.cssText = 'padding:18px 22px;border-bottom:1px solid #334155;display:flex;align-items:center;justify-content:space-between;';
    header.innerHTML = '<div><div style="font-size:15px;font-weight:700;color:#F1F5F9;">\uD83D\uDCC4 Questions Extracted</div><div style="font-size:12px;color:#64748B;margin-top:2px;">' + fileName + ' &nbsp;&middot;&nbsp; ' + questions.length + ' questions found</div></div><button id="closePanelBtn" style="background:none;border:none;cursor:pointer;color:#94A3B8;font-size:20px;line-height:1;padding:4px 8px;">&times;</button>';
    panel.appendChild(header);

    // Hint bar
    var hint = document.createElement('div');
    hint.style.cssText = 'padding:8px 22px;font-size:12px;color:#64748B;background:#0F172A;border-bottom:1px solid #1E3A5F;';
    hint.textContent = 'Each question below has been analyzed for difficulty. Click \u201CLoad\u201D to open it in the analyzer.';
    panel.appendChild(hint);

    // List
    var list = document.createElement('div');
    list.style.cssText = 'overflow-y:auto;flex:1;padding:14px 16px;display:flex;flex-direction:column;gap:10px;';

    var bloomLevels = [
        { level: 'Remember / Recall', range: [0, 20] },
        { level: 'Understand', range: [21, 40] },
        { level: 'Apply', range: [41, 60] },
        { level: 'Analyze / Evaluate', range: [61, 80] },
        { level: 'Synthesize / Create', range: [81, 100] }
    ];

    questions.forEach(function (q) {
        var score = hashScore(q.text);
        var diff = getDifficultyInfo(score);
        var bloom = bloomLevels.find(function (b) { return score >= b.range[0] && score <= b.range[1]; });

        var card = document.createElement('div');
        card.style.cssText = 'background:#0F172A;border:1px solid #334155;border-radius:10px;padding:14px 16px;display:flex;gap:12px;align-items:flex-start;transition:border-color 0.2s;';
        card.addEventListener('mouseenter', function () { card.style.borderColor = diff.color; });
        card.addEventListener('mouseleave', function () { card.style.borderColor = '#334155'; });

        var loadBtn = document.createElement('button');
        loadBtn.textContent = 'Load \u2197';
        loadBtn.style.cssText = 'background:#3B82F6;border:none;color:white;padding:7px 14px;border-radius:6px;font-size:12px;font-weight:600;cursor:pointer;white-space:nowrap;flex-shrink:0;transition:background 0.2s;';
        loadBtn.addEventListener('mouseenter', function () { loadBtn.style.background = '#2563EB'; });
        loadBtn.addEventListener('mouseleave', function () { loadBtn.style.background = '#3B82F6'; });
        loadBtn.addEventListener('click', function () {
            if (questionTextEl) questionTextEl.value = q.text;
            overlay.remove();
            showToast('Question loaded into analyzer!', '#3B82F6');
        });

        var numBadge = document.createElement('div');
        numBadge.style.cssText = 'min-width:28px;height:28px;background:' + diff.bg + ';border-radius:6px;display:flex;align-items:center;justify-content:center;font-size:12px;font-weight:700;color:' + diff.color + ';flex-shrink:0;';
        numBadge.textContent = 'Q' + q.no;

        var content = document.createElement('div');
        content.style.cssText = 'flex:1;min-width:0;';
        content.innerHTML = '<div style="font-size:13px;color:#CBD5E1;line-height:1.55;margin-bottom:8px;">' + q.text + '</div>'
            + '<div style="display:flex;align-items:center;gap:8px;flex-wrap:wrap;">'
            + '<span style="font-size:11px;font-weight:700;color:' + diff.color + ';background:' + diff.bg + ';padding:3px 9px;border-radius:20px;">' + diff.label + '</span>'
            + '<span style="font-size:11px;color:#64748B;">Score: <strong style="color:#94A3B8;">' + score + '/100</strong></span>'
            + '<span style="font-size:11px;color:#64748B;">Bloom\'s: <strong style="color:#94A3B8;">' + (bloom ? bloom.level : 'N/A') + '</strong></span>'
            + '</div>';

        card.appendChild(numBadge);
        card.appendChild(content);
        card.appendChild(loadBtn);
        list.appendChild(card);
    });

    panel.appendChild(list);

    // Footer
    var footer = document.createElement('div');
    footer.style.cssText = 'padding:12px 22px;border-top:1px solid #334155;display:flex;justify-content:flex-end;';
    var closeBtn2 = document.createElement('button');
    closeBtn2.textContent = 'Close';
    closeBtn2.style.cssText = 'background:#334155;border:none;color:#CBD5E1;padding:8px 20px;border-radius:8px;font-size:13px;font-weight:600;cursor:pointer;';
    closeBtn2.addEventListener('click', function () { overlay.remove(); });
    footer.appendChild(closeBtn2);
    panel.appendChild(footer);

    overlay.appendChild(panel);
    document.body.appendChild(overlay);

    document.getElementById('closePanelBtn').addEventListener('click', function () { overlay.remove(); });
    overlay.addEventListener('click', function (e) { if (e.target === overlay) overlay.remove(); });
}

// dummy block open - intentionally left for syntax pairing
if (false) {
}

// ===================================
// RECENT QUESTIONS BUTTON
// ===================================
const recentQuestionsBtn = document.querySelector('.btn-link');

const recentQuestions = [
    {
        subject: 'Mathematics',
        text: 'Solve the differential equation dy/dx = 2x + 3y, given y(0) = 1, and interpret the solution geometrically.'
    },
    {
        subject: 'History',
        text: 'Evaluate the impact of the Industrial Revolution on urban development in 19th-century Europe, specifically focusing on the socio-economic shifts within major metropolitan areas.'
    },
    {
        subject: 'Physics',
        text: 'Explain the photoelectric effect and how it supports the particle theory of light. Include the role of threshold frequency.'
    },
    {
        subject: 'Biology',
        text: 'Describe the process of cellular respiration and compare aerobic and anaerobic pathways in terms of ATP yield.'
    },
    {
        subject: 'English',
        text: 'Analyze the use of symbolism in George Orwell\'s \'Animal Farm\' and discuss how it reflects real-world political ideologies.'
    }
];

if (recentQuestionsBtn) {
    // Create dropdown panel
    const dropdown = document.createElement('div');
    dropdown.id = 'recentQuestionsPanel';
    dropdown.style.cssText = `
        position: absolute;
        top: 100%;
        left: 0;
        right: 0;
        background: #1E293B;
        border: 1px solid #334155;
        border-radius: 10px;
        box-shadow: 0 10px 30px rgba(0,0,0,0.4);
        z-index: 1000;
        max-height: 280px;
        overflow-y: auto;
        margin-top: 6px;
        display: none;
    `;

    const panelHeader = document.createElement('div');
    panelHeader.style.cssText = 'padding: 10px 14px; font-size: 11px; font-weight: 600; color: #64748B; text-transform: uppercase; letter-spacing: 0.08em; border-bottom: 1px solid #334155;';
    panelHeader.textContent = 'Recent Questions';
    dropdown.appendChild(panelHeader);

    recentQuestions.forEach(q => {
        const item = document.createElement('div');
        item.style.cssText = `
            padding: 10px 14px;
            cursor: pointer;
            border-bottom: 1px solid #1E293B;
            transition: background 0.2s;
        `;
        item.innerHTML = `
            <div style="font-size:11px; color:#3B82F6; font-weight:600; margin-bottom:3px;">${q.subject}</div>
            <div style="font-size:13px; color:#CBD5E1; white-space:nowrap; overflow:hidden; text-overflow:ellipsis;">${q.text}</div>
        `;
        item.addEventListener('mouseenter', () => { item.style.background = '#0F172A'; });
        item.addEventListener('mouseleave', () => { item.style.background = ''; });
        item.addEventListener('click', () => {
            if (questionText) {
                questionText.value = q.text;
            }
            dropdown.style.display = 'none';
            showToast('Question loaded!', '#3B82F6');
        });
        dropdown.appendChild(item);
    });

    // Insert dropdown relative to the upload-section
    const uploadSection = recentQuestionsBtn.closest('.upload-section');
    if (uploadSection) {
        uploadSection.style.position = 'relative';
        uploadSection.appendChild(dropdown);
    }

    recentQuestionsBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        const isVisible = dropdown.style.display === 'block';
        dropdown.style.display = isVisible ? 'none' : 'block';
    });

    // Close when clicking outside
    document.addEventListener('click', () => {
        dropdown.style.display = 'none';
    });
}

// ===================================
// TOAST NOTIFICATION HELPER
// ===================================
function showToast(message, color = '#10B981') {
    const toast = document.createElement('div');
    toast.textContent = message;
    toast.style.cssText = `
        position: fixed;
        bottom: 24px;
        right: 24px;
        background: ${color};
        color: white;
        padding: 12px 20px;
        border-radius: 8px;
        font-size: 14px;
        font-weight: 500;
        box-shadow: 0 4px 12px rgba(0,0,0,0.3);
        z-index: 99999;
        animation: fadeIn 0.3s ease;
        max-width: 300px;
    `;
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 3000);
}

// ===================================
// DETERMINISTIC HASH SCORE (same question = same score always)
// ===================================
function hashScore(text) {
    let hash = 0;
    const normalized = text.trim().toLowerCase();
    for (let i = 0; i < normalized.length; i++) {
        hash = ((hash << 5) - hash) + normalized.charCodeAt(i);
        hash |= 0;
    }
    return Math.abs(hash) % 101; // 0-100
}

function analyzeQuestion(question) {
    // Deterministic score - same question always gives same result
    const score = hashScore(question);
    currentScore = score;

    // Determine difficulty level
    let difficulty, difficultyClass, circleColor;
    if (score <= 40) {
        difficulty = 'EASY DIFFICULTY';
        difficultyClass = 'badge-easy';
        circleColor = '#10B981';
    } else if (score <= 75) {
        difficulty = 'MEDIUM DIFFICULTY';
        difficultyClass = 'badge-medium';
        circleColor = '#F59E0B';
    } else {
        difficulty = 'HARD DIFFICULTY';
        difficultyClass = 'badge-hard';
        circleColor = '#EF4444';
    }

    currentDifficulty = difficulty.split(' ')[0].toLowerCase();

    // Determine Bloom's level
    const bloomLevels = [
        { level: 'Remember / Recall', desc: 'L1', range: [0, 20] },
        { level: 'Understand / Comprehend', desc: 'L2', range: [21, 40] },
        { level: 'Apply', desc: 'L3', range: [41, 60] },
        { level: 'Analyze / Evaluate', desc: 'L4', range: [61, 80] },
        { level: 'Synthesize / Create', desc: 'L5', range: [81, 100] }
    ];

    const bloomLevel = bloomLevels.find(b => score >= b.range[0] && score <= b.range[1]);

    // Generate AI confidence
    const confidence = (Math.random() * 5 + 95).toFixed(1);

    // Update UI
    document.getElementById('scoreValue').textContent = score;
    document.getElementById('difficultyBadge').textContent = difficulty;
    document.getElementById('difficultyBadge').className = `difficulty-badge ${difficultyClass}`;

    document.getElementById('complexityText').textContent = `${difficulty.split(' ')[0]} (${score}/100)`;
    document.getElementById('complexityProgress').style.width = `${score}%`;

    document.getElementById('bloomLevel').textContent = bloomLevel.level;
    document.getElementById('bloomDescription').textContent = bloomLevel.desc;

    document.getElementById('confidenceValue').textContent = `${confidence}% Match`;

    // Animate circular progress
    const circumference = 2 * Math.PI * 85;
    const offset = circumference - (score / 100) * circumference;
    const progressCircle = document.getElementById('scoreProgress');
    progressCircle.style.strokeDashoffset = offset;
    progressCircle.style.stroke = circleColor;

    // Generate suggestion
    const suggestions = {
        easy: "This question is well-suited for introductory assessments. Consider adding more context to increase engagement.",
        medium: "To reduce difficulty to 'Easy', consider simplifying sentence structure and reducing analytical depth. To increase to 'Hard', add multi-step reasoning requirements.",
        hard: "This question requires advanced cognitive skills. To make it more accessible, break it into smaller sub-questions or provide scaffolding hints."
    };

    document.getElementById('suggestionText').textContent = suggestions[currentDifficulty];

    // Show results
    placeholderContent.style.display = 'none';
    resultContent.classList.remove('hidden');
    suggestionBox.classList.remove('hidden');
}

// ===================================
// DASHBOARD - SIDEBAR TOGGLE
// ===================================
const sidebarToggle = document.getElementById('sidebarToggle');
const sidebar = document.getElementById('sidebar');

if (sidebarToggle) {
    sidebarToggle.addEventListener('click', () => {
        sidebar.classList.toggle('active');
    });
}

// ===================================
// DASHBOARD - THEME TOGGLE
// ===================================
const themeToggle = document.getElementById('themeToggle');

if (themeToggle) {
    themeToggle.addEventListener('click', () => {
        document.body.classList.toggle('dark-theme');

        // Update icon
        const icon = themeToggle.querySelector('svg path');
        if (document.body.classList.contains('dark-theme')) {
            icon.setAttribute('d', 'M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z');
        } else {
            icon.setAttribute('d', 'M12 2v2m0 16v2M4.93 4.93l1.41 1.41m11.32 11.32l1.41 1.41M2 12h2m16 0h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41');
        }
    });
}

// ===================================
// SETTINGS BUTTON FUNCTIONALITY
// ===================================
const settingsButtons = document.querySelectorAll('.icon-btn[title="Settings"]');

settingsButtons.forEach(settingsBtn => {
    settingsBtn.addEventListener('click', () => {
        // Create settings modal/notification
        const settingsInfo = `
Settings Panel
━━━━━━━━━━━━━━━━━━━━
✓ Theme: ${document.body.classList.contains('dark-theme') ? 'Dark' : 'Light'}
✓ Language: English
✓ AI Model: GPT-4 Enhanced
✓ Analysis Depth: Standard

Click the theme toggle to switch between light/dark modes.
        `.trim();

        alert(settingsInfo);
    });
});

// ===================================
// DASHBOARD - CHART.JS DONUT CHART
// ===================================
const difficultyChart = document.getElementById('difficultyChart');

if (difficultyChart) {
    const ctx = difficultyChart.getContext('2d');

    new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: ['Easy', 'Medium', 'Hard', 'Expert'],
            datasets: [{
                data: [25, 45, 20, 10],
                backgroundColor: [
                    '#10B981',
                    '#3B82F6',
                    '#F59E0B',
                    '#EF4444'
                ],
                borderWidth: 0,
                borderRadius: 8,
                spacing: 4
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            cutout: '70%',
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    backgroundColor: '#1E293B',
                    titleColor: '#F1F5F9',
                    bodyColor: '#CBD5E1',
                    borderColor: '#334155',
                    borderWidth: 1,
                    padding: 12,
                    cornerRadius: 8,
                    displayColors: true,
                    callbacks: {
                        label: function (context) {
                            return context.label + ': ' + context.parsed + '%';
                        }
                    }
                }
            }
        },
        plugins: [{
            beforeDraw: function (chart) {
                const width = chart.width;
                const height = chart.height;
                const ctx = chart.ctx;
                ctx.restore();

                const fontSize = (height / 80).toFixed(2);
                ctx.font = `800 ${fontSize}em Inter, sans-serif`;
                ctx.textBaseline = 'middle';
                ctx.fillStyle = '#F1F5F9';

                const text = '1.2k';
                const textX = Math.round((width - ctx.measureText(text).width) / 2);
                const textY = height / 2 - 10;

                ctx.fillText(text, textX, textY);

                ctx.font = `600 ${fontSize * 0.4}em Inter, sans-serif`;
                ctx.fillStyle = '#94A3B8';
                const subtext = 'TOTAL ITEMS';
                const subtextX = Math.round((width - ctx.measureText(subtext).width) / 2);
                const subtextY = height / 2 + 20;

                ctx.fillText(subtext, subtextX, subtextY);
                ctx.save();
            }
        }]
    });
}

// ===================================
// ANIMATED COUNTER FOR STATS
// ===================================
function animateCounter(element, target, duration = 2000) {
    const start = 0;
    const increment = target / (duration / 16);
    let current = start;

    const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
            element.textContent = target.toLocaleString();
            clearInterval(timer);
        } else {
            element.textContent = Math.floor(current).toLocaleString();
        }
    }, 16);
}

// Animate stat values on page load
window.addEventListener('load', () => {
    const statValues = document.querySelectorAll('.stat-value');
    statValues.forEach(stat => {
        const text = stat.textContent;
        const number = parseFloat(text.replace(/,/g, ''));
        if (!isNaN(number) && number > 0) {
            stat.textContent = '0';
            setTimeout(() => {
                animateCounter(stat, number);
            }, 300);
        }
    });
});

// ===================================
// TYPING EFFECT FOR HERO TEXT (OPTIONAL)
// ===================================
function typeWriter(element, text, speed = 50) {
    let i = 0;
    element.textContent = '';

    function type() {
        if (i < text.length) {
            element.textContent += text.charAt(i);
            i++;
            setTimeout(type, speed);
        }
    }

    type();
}

// Uncomment to enable typing effect on hero title
// const heroTitle = document.querySelector('.hero-title');
// if (heroTitle) {
//     const originalText = heroTitle.textContent;
//     typeWriter(heroTitle, originalText, 30);
// }

// ===================================
// FORM VALIDATION
// ===================================
const forms = document.querySelectorAll('form');

forms.forEach(form => {
    form.addEventListener('submit', (e) => {
        e.preventDefault();

        const inputs = form.querySelectorAll('input[required], textarea[required]');
        let isValid = true;

        inputs.forEach(input => {
            if (!input.value.trim()) {
                isValid = false;
                input.style.borderColor = '#EF4444';
            } else {
                input.style.borderColor = '';
            }
        });

        if (isValid) {
            // Form is valid, submit
            console.log('Form submitted successfully');
        }
    });
});

// ===================================
// LOADING ANIMATION
// ===================================
function showLoading(button) {
    const originalContent = button.innerHTML;
    button.innerHTML = '<div class="loading"></div> Loading...';
    button.disabled = true;

    return () => {
        button.innerHTML = originalContent;
        button.disabled = false;
    };
}

// ===================================
// TOOLTIP FUNCTIONALITY
// ===================================
const tooltipElements = document.querySelectorAll('[data-tooltip]');

tooltipElements.forEach(element => {
    element.addEventListener('mouseenter', (e) => {
        const tooltip = document.createElement('div');
        tooltip.className = 'tooltip';
        tooltip.textContent = element.getAttribute('data-tooltip');
        document.body.appendChild(tooltip);

        const rect = element.getBoundingClientRect();
        tooltip.style.position = 'absolute';
        tooltip.style.top = `${rect.top - tooltip.offsetHeight - 8}px`;
        tooltip.style.left = `${rect.left + (rect.width - tooltip.offsetWidth) / 2}px`;
    });

    element.addEventListener('mouseleave', () => {
        const tooltip = document.querySelector('.tooltip');
        if (tooltip) {
            tooltip.remove();
        }
    });
});

// ===================================
// KEYBOARD SHORTCUTS
// ===================================
document.addEventListener('keydown', (e) => {
    // Ctrl/Cmd + K for search
    if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        const searchInput = document.querySelector('.search-box input');
        if (searchInput) {
            searchInput.focus();
        }
    }

    // Escape to close modals/menus
    if (e.key === 'Escape') {
        const activeMenu = document.querySelector('.nav-menu.active');
        if (activeMenu) {
            activeMenu.classList.remove('active');
        }
    }
});

// ===================================
// LOCAL STORAGE FOR THEME PREFERENCE
// ===================================
const savedTheme = localStorage.getItem('theme');
if (savedTheme === 'dark') {
    document.body.classList.add('dark-theme');
}

if (themeToggle) {
    themeToggle.addEventListener('click', () => {
        if (document.body.classList.contains('dark-theme')) {
            localStorage.setItem('theme', 'dark');
        } else {
            localStorage.setItem('theme', 'light');
        }
    });
}

// ===================================
// EXPORT TABLE DATA (UI ONLY)
// ===================================
const exportBtn = document.querySelector('.card-actions .btn-secondary:last-child');

if (exportBtn) {
    exportBtn.addEventListener('click', () => {
        alert('Export functionality would download the table data as CSV/Excel file.');
    });
}

// ===================================
// FILTER TABLE (UI ONLY)
// ===================================
const filterBtn = document.querySelector('.card-actions .btn-secondary:first-child');

if (filterBtn) {
    filterBtn.addEventListener('click', () => {
        alert('Filter panel would appear to filter questions by subject, difficulty, date, etc.');
    });
}

// ===================================
// COPY TO CLIPBOARD FUNCTIONALITY
// ===================================
function copyToClipboard(text) {
    navigator.clipboard.writeText(text).then(() => {
        // Show success message
        const toast = document.createElement('div');
        toast.className = 'toast';
        toast.textContent = 'Copied to clipboard!';
        toast.style.cssText = `
            position: fixed;
            bottom: 20px;
            right: 20px;
            background: #10B981;
            color: white;
            padding: 12px 24px;
            border-radius: 8px;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
            z-index: 10000;
            animation: fadeIn 0.3s ease;
        `;
        document.body.appendChild(toast);

        setTimeout(() => {
            toast.remove();
        }, 2000);
    });
}

// ===================================
// CONSOLE WELCOME MESSAGE
// ===================================
console.log('%c🎓 EduAI - AI Difficulty Analyzer Tool', 'color: #3B82F6; font-size: 20px; font-weight: bold;');
console.log('%cBuilt with ❤️ for better education', 'color: #6B7280; font-size: 12px;');
console.log('%cVersion 2.4.1', 'color: #9CA3AF; font-size: 10px;');

// ===================================
// PERFORMANCE MONITORING
// ===================================
window.addEventListener('load', () => {
    const loadTime = performance.timing.domContentLoadedEventEnd - performance.timing.navigationStart;
    console.log(`Page loaded in ${loadTime}ms`);
});

// ===================================
// ERROR HANDLING
// ===================================
window.addEventListener('error', (e) => {
    console.error('An error occurred:', e.error);
});

// ===================================
// LOGIN MODAL
// ===================================
(function () {
    const loginBtn = document.getElementById('loginBtn');
    const loginModal = document.getElementById('loginModal');
    const closeLoginModal = document.getElementById('closeLoginModal');
    const loginForm = document.getElementById('loginForm');

    function openLogin() {
        if (!loginModal) return;
        loginModal.style.display = 'flex';
        document.body.style.overflow = 'hidden';
    }
    function closeLogin() {
        if (!loginModal) return;
        loginModal.style.display = 'none';
        document.body.style.overflow = '';
    }

    if (loginBtn) loginBtn.addEventListener('click', openLogin);
    if (closeLoginModal) closeLoginModal.addEventListener('click', closeLogin);
    if (loginModal) {
        loginModal.addEventListener('click', (e) => { if (e.target === loginModal) closeLogin(); });
    }
    if (loginForm) {
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const email = document.getElementById('loginEmail').value.trim();
            closeLogin();
            showToast('Welcome back, ' + (email.split('@')[0] || 'User') + '! 🎉', '#3B82F6');
        });
    }
})();

// ===================================
// DEMO MODAL
// ===================================
(function () {
    const viewDemoBtn = document.getElementById('viewDemoBtn');
    const demoModal = document.getElementById('demoModal');
    const closeDemoModal = document.getElementById('closeDemoModal');
    const runDemoBtn = document.getElementById('runDemoBtn');
    const demoResult = document.getElementById('demoResult');

    function openDemo() {
        if (!demoModal) return;
        // Reset result state when reopening
        if (demoResult) demoResult.style.display = 'none';
        if (runDemoBtn) { runDemoBtn.textContent = '⚡ Run Demo Analysis'; runDemoBtn.disabled = false; }
        demoModal.style.display = 'flex';
        document.body.style.overflow = 'hidden';
    }
    function closeDemo() {
        if (!demoModal) return;
        demoModal.style.display = 'none';
        document.body.style.overflow = '';
    }

    if (viewDemoBtn) viewDemoBtn.addEventListener('click', openDemo);
    if (closeDemoModal) closeDemoModal.addEventListener('click', closeDemo);
    if (demoModal) {
        demoModal.addEventListener('click', (e) => { if (e.target === demoModal) closeDemo(); });
    }

    if (runDemoBtn) {
        runDemoBtn.addEventListener('click', () => {
            runDemoBtn.textContent = '⏳ Analyzing...';
            runDemoBtn.disabled = true;

            setTimeout(() => {
                const sampleQ = document.getElementById('demoQuestion').textContent.trim();
                // Reuse the same hash scoring function
                let hash = 0;
                const norm = sampleQ.toLowerCase();
                for (let i = 0; i < norm.length; i++) {
                    hash = ((hash << 5) - hash) + norm.charCodeAt(i);
                    hash |= 0;
                }
                const score = Math.abs(hash) % 101;

                let diffLabel, diffColor;
                if (score <= 40) { diffLabel = 'EASY'; diffColor = '#10B981'; }
                else if (score <= 75) { diffLabel = 'MEDIUM'; diffColor = '#F59E0B'; }
                else { diffLabel = 'HARD'; diffColor = '#EF4444'; }

                const blooms = [
                    { level: 'Remember / Recall', range: [0, 20] },
                    { level: 'Understand', range: [21, 40] },
                    { level: 'Apply', range: [41, 60] },
                    { level: 'Analyze / Evaluate', range: [61, 80] },
                    { level: 'Synthesize / Create', range: [81, 100] }
                ];
                const bloom = blooms.find(b => score >= b.range[0] && score <= b.range[1]);

                const suggestions = {
                    EASY: 'This question is suitable for introductory-level assessments. Consider adding more analytical depth.',
                    MEDIUM: "To reduce difficulty, simplify sentence structure. To increase, add multi-step reasoning.",
                    HARD: 'This requires advanced cognitive skills. Consider breaking into sub-questions for broader accessibility.'
                };

                document.getElementById('demoScore').textContent = score;
                document.getElementById('demoScore').style.color = diffColor;
                document.getElementById('demoDifficulty').textContent = diffLabel;
                document.getElementById('demoDifficulty').style.color = diffColor;
                document.getElementById('demoBlooms').textContent = bloom ? bloom.level : 'N/A';
                document.getElementById('demoSuggestion').textContent = suggestions[diffLabel];

                demoResult.style.display = 'block';
                runDemoBtn.textContent = '✓ Analysis Complete';
                runDemoBtn.style.background = 'rgba(16,185,129,0.2)';
                runDemoBtn.style.border = '1px solid #10B981';
                runDemoBtn.style.color = '#10B981';
            }, 1800);
        });
    }
})();

// ===================================
// SERVICE WORKER REGISTRATION (OPTIONAL)
// ===================================
// if ('serviceWorker' in navigator) {
//     navigator.serviceWorker.register('/sw.js')
//         .then(reg => console.log('Service Worker registered'))
//         .catch(err => console.log('Service Worker registration failed'));
// }
