/**
 * BaitAware — script.js
 * Quiz engine: scenario rendering, answer handling, score tracking, results
 */

/* ══════════════════════════════════════════
   SCENARIO DATA
   Each scenario has:
   - type: 'email' | 'sms' | 'web' | 'social'
   - label: short display label
   - answer: 'phishing' | 'safe'
   - mock: HTML string rendered inside .scenario-mock
   - explanation: brief explanation shown after
   - clues: array of { text, good } objects
══════════════════════════════════════════ */
const scenarios = [

  /* ── 1. Phishing Email: Fake PayPal ── */
  {
    type: 'email',
    label: 'Email',
    answer: 'phishing',
    mock: `
      <div class="mock-email">
        <div class="mock-email-header">
          <div class="mock-email-field"><span class="lbl">From:</span><span class="val">security@paypa1-alerts.com</span></div>
          <div class="mock-email-field"><span class="lbl">To:</span><span class="val">you@example.com</span></div>
          <div class="mock-email-subject">🔴 Urgent: Your PayPal account has been limited</div>
        </div>
        <div class="mock-email-body">
          <p>Dear Valued Customer,</p>
          <p>We have detected unusual activity on your PayPal account. Your account access has been <strong>temporarily limited</strong>. To restore full access, please verify your information immediately.</p>
          <p><a class="mock-link">Click here: http://paypa1-secure-login.xyz/verify</a></p>
          <p><span class="mock-btn" style="background:#003087;color:#fff;">Restore My Account</span></p>
          <p>Failure to verify within 24 hours will result in permanent suspension.</p>
          <p>PayPal Security Team</p>
        </div>
      </div>`,
    explanation: 'This is a phishing email impersonating PayPal to steal your credentials.',
    clues: [
      { text: 'Sender domain is "paypa1-alerts.com" — note the number "1" instead of letter "l"', good: false },
      { text: 'Link points to "paypa1-secure-login.xyz" — not paypal.com', good: false },
      { text: 'Creates artificial urgency with "24-hour suspension" threat', good: false },
      { text: 'Legitimate PayPal emails always come from @paypal.com', good: true },
    ]
  },

  /* ── 2. Safe Email: GitHub security alert ── */
  {
    type: 'email',
    label: 'Email',
    answer: 'safe',
    mock: `
      <div class="mock-email">
        <div class="mock-email-header">
          <div class="mock-email-field"><span class="lbl">From:</span><span class="val">noreply@github.com</span></div>
          <div class="mock-email-field"><span class="lbl">To:</span><span class="val">you@example.com</span></div>
          <div class="mock-email-subject">[GitHub] A new public key was added to your account</div>
        </div>
        <div class="mock-email-body">
          <p>Hey there,</p>
          <p>A new public key was added to your GitHub account. If this was you, no action is needed.</p>
          <p>If you did NOT add this key, please <a class="mock-link">review your SSH keys</a> and remove any unrecognized ones.</p>
          <p>Visit github.com/settings/keys to manage your keys.</p>
          <p>— The GitHub Team</p>
        </div>
      </div>`,
    explanation: 'This is a legitimate GitHub security notification — no threats, no suspicious links.',
    clues: [
      { text: 'Sender is "noreply@github.com" — official GitHub domain', good: true },
      { text: 'No urgency or threats — just an informational notice', good: true },
      { text: 'Directs you to github.com (not a suspicious domain)', good: true },
      { text: 'No request for passwords, credit cards, or personal info', good: true },
    ]
  },

  /* ── 3. Phishing SMS: Fake delivery ── */
  {
    type: 'sms',
    label: 'SMS',
    answer: 'phishing',
    mock: `
      <div class="mock-sms">
        <div class="mock-sms-header">
          <div class="mock-sms-avatar"><i class="fa-solid fa-box"></i></div>
          <div>
            <div class="mock-sms-sender">FedEx Delivery</div>
            <div class="mock-sms-time">+1 (555) 284-9921 · Just now</div>
          </div>
        </div>
        <div class="mock-sms-bubble">
          FEDEX: Your package #FX8821 is on hold due to incomplete address. Update now to avoid return: <span class="mock-link">http://fedex-pkg-update.cc/track</span> — Reply STOP to opt out.
        </div>
      </div>`,
    explanation: 'This is a smishing (SMS phishing) attack pretending to be FedEx.',
    clues: [
      { text: 'Link domain is "fedex-pkg-update.cc" — not fedex.com', good: false },
      { text: 'Message came from a random mobile number, not a short code', good: false },
      { text: 'Uses urgency — "avoid return" pressure tactic', good: false },
      { text: 'Real FedEx notifications come from short codes or fedex.com domains', good: true },
    ]
  },

  /* ── 4. Phishing Web: Fake bank login ── */
  {
    type: 'web',
    label: 'Login Page',
    answer: 'phishing',
    mock: `
      <div class="mock-web">
        <div class="mock-browser-bar">
          <div class="mock-browser-dots"><span></span><span></span><span></span></div>
          <div class="mock-browser-url">
            <i class="fa-solid fa-triangle-exclamation lock-icon unsafe"></i>
            http://secure-bankofamerica-login.net/signin
          </div>
        </div>
        <div class="mock-web-content">
          <div class="mock-web-logo" style="color:#e31837;">Bank of America</div>
          <div class="mock-web-subtitle">Sign in to Online Banking</div>
          <div class="mock-form">
            <input type="text" placeholder="Online ID" readonly />
            <input type="password" placeholder="Password" readonly />
            <div class="form-btn" style="background:#e31837;color:#fff;text-align:center;border-radius:6px;padding:9px;font-weight:700;font-size:.85rem;cursor:default;">Sign In</div>
          </div>
        </div>
      </div>`,
    explanation: 'This fake Bank of America page is designed to steal your banking credentials.',
    clues: [
      { text: 'URL is "secure-bankofamerica-login.net" — not bankofamerica.com', good: false },
      { text: 'No HTTPS padlock — browser shows a warning triangle', good: false },
      { text: 'Domain uses a hyphenated trick to look legitimate', good: false },
      { text: 'Real banking sites always use their official domain (bankofamerica.com)', good: true },
    ]
  },

  /* ── 5. Safe Web: Real Google login ── */
  {
    type: 'web',
    label: 'Login Page',
    answer: 'safe',
    mock: `
      <div class="mock-web">
        <div class="mock-browser-bar">
          <div class="mock-browser-dots"><span></span><span></span><span></span></div>
          <div class="mock-browser-url">
            <i class="fa-solid fa-lock lock-icon safe"></i>
            accounts.google.com/signin/v2/identifier
          </div>
        </div>
        <div class="mock-web-content">
          <div class="mock-web-logo" style="color:#4285f4;">Google</div>
          <div class="mock-web-subtitle">Sign in to your Google Account</div>
          <div class="mock-form">
            <input type="email" placeholder="Email or phone" readonly />
            <div class="form-btn" style="background:#1a73e8;color:#fff;text-align:center;border-radius:4px;padding:9px;font-weight:500;font-size:.85rem;cursor:default;">Next</div>
          </div>
        </div>
      </div>`,
    explanation: 'This is a legitimate Google sign-in page with proper HTTPS and the correct domain.',
    clues: [
      { text: 'Domain is "accounts.google.com" — official Google subdomain', good: true },
      { text: 'HTTPS padlock is present — connection is secure', good: true },
      { text: 'Clean, consistent Google branding with no misspellings', good: true },
      { text: 'Only asks for email first — Google\'s standard 2-step flow', good: true },
    ]
  },

  /* ── 6. Phishing Email: Microsoft 365 ── */
  {
    type: 'email',
    label: 'Email',
    answer: 'phishing',
    mock: `
      <div class="mock-email">
        <div class="mock-email-header">
          <div class="mock-email-field"><span class="lbl">From:</span><span class="val">admin@microsoft365-support-center.com</span></div>
          <div class="mock-email-field"><span class="lbl">To:</span><span class="val">employee@yourcompany.com</span></div>
          <div class="mock-email-subject">Action Required: Your Microsoft 365 subscription expires today</div>
        </div>
        <div class="mock-email-body">
          <p>Dear User,</p>
          <p>Your Microsoft 365 Business license is set to expire <strong>TODAY</strong>. All your emails, files, and Teams meetings will be inaccessible unless you renew now.</p>
          <p><span class="mock-btn" style="background:#0078d4;color:#fff;">Renew Now — $9.99/month</span></p>
          <p>Click the button above and enter your payment details to continue uninterrupted service.</p>
        </div>
      </div>`,
    explanation: 'Phishing email pretending to be Microsoft to capture payment details.',
    clues: [
      { text: '"microsoft365-support-center.com" is not a Microsoft domain', good: false },
      { text: 'Pressing "Renew Now" would lead to a fake payment page', good: false },
      { text: 'Microsoft never cold-emails you to renew and request immediate payment', good: false },
      { text: 'Legitimate Microsoft renewals are managed through admin.microsoft.com', good: true },
    ]
  },

  /* ── 7. Phishing Social: Fake Facebook prize ── */
  {
    type: 'social',
    label: 'Social Media',
    answer: 'phishing',
    mock: `
      <div class="mock-social">
        <div class="mock-social-header">
          <span>f Facebook</span>
          <i class="fa-solid fa-ellipsis" style="color:#fff;"></i>
        </div>
        <div class="mock-social-body">
          <div class="mock-social-post">
            <div class="mock-social-poster">
              <div class="mock-social-avatar">f</div>
              <div>
                <div class="mock-social-name">Facebook Lottery Department 🏆</div>
                <div class="mock-social-time">Sponsored · 2 min ago</div>
              </div>
            </div>
            <div class="mock-social-text">
              🎉 CONGRATULATIONS! You've been randomly selected to WIN $1,000 Facebook Cash Prize!<br><br>
              To claim your prize, click the link below and verify your identity. Offer expires in 1 hour!<br><br>
              <span class="mock-link">http://fb-prize-claim.tk/winner?id=88821</span>
            </div>
          </div>
        </div>
      </div>`,
    explanation: 'There is no "Facebook Lottery Department" — this is a classic social media scam.',
    clues: [
      { text: 'Facebook does not have a "Lottery Department" — this page is fake', good: false },
      { text: 'Link uses ".tk" domain (free domain often used by scammers)', good: false },
      { text: '"Expires in 1 hour" — classic artificial urgency tactic', good: false },
      { text: 'Prize notification should always be verified through the platform\'s official interface', good: true },
    ]
  },

  /* ── 8. Safe SMS: Bank 2FA code ── */
  {
    type: 'sms',
    label: 'SMS',
    answer: 'safe',
    mock: `
      <div class="mock-sms">
        <div class="mock-sms-header">
          <div class="mock-sms-avatar"><i class="fa-solid fa-university"></i></div>
          <div>
            <div class="mock-sms-sender">ABSA Bank</div>
            <div class="mock-sms-time">Short code 32551 · Just now</div>
          </div>
        </div>
        <div class="mock-sms-bubble">
          ABSA: Your one-time PIN is <strong>847 291</strong>. Valid for 5 minutes. Never share this code with anyone. If you didn't request this, call 0800 111 155.
        </div>
      </div>`,
    explanation: 'This is a legitimate two-factor authentication SMS from ABSA Bank.',
    clues: [
      { text: 'Sent from an official registered short code (32551)', good: true },
      { text: 'Explicitly warns "Never share this code" — not asking you to share it', good: true },
      { text: 'No suspicious links or demands — just delivers a code you requested', good: true },
      { text: 'Provides official callback number for verification', good: true },
    ]
  },

  /* ── 9. Phishing Email: IT password reset ── */
  {
    type: 'email',
    label: 'Email',
    answer: 'phishing',
    mock: `
      <div class="mock-email">
        <div class="mock-email-header">
          <div class="mock-email-field"><span class="lbl">From:</span><span class="val">it-helpdesk@yourcompany-it-support.org</span></div>
          <div class="mock-email-field"><span class="lbl">To:</span><span class="val">you@yourcompany.com</span></div>
          <div class="mock-email-subject">⚠️ Mandatory Password Reset — Action Required</div>
        </div>
        <div class="mock-email-body">
          <p>Dear Employee,</p>
          <p>Our security systems have flagged your password as <strong>compromised</strong>. You must reset it within the next 2 hours to maintain system access.</p>
          <p>Please use your <strong>current username and password</strong> to log in and reset:</p>
          <p><a class="mock-link">http://corp-password-reset.net/employee/login</a></p>
          <p>IT Support Team</p>
        </div>
      </div>`,
    explanation: 'A spear phishing email targeting employees — asking for current credentials on an external site.',
    clues: [
      { text: 'Sender domain "yourcompany-it-support.org" is external — not the company\'s domain', good: false },
      { text: 'Asking you to enter CURRENT credentials — IT never does this', good: false },
      { text: 'Link goes to "corp-password-reset.net" — a third-party credential harvester', good: false },
      { text: 'Password resets within a company always use internal IT systems', good: true },
    ]
  },

  /* ── 10. Safe Email: Dropbox file share ── */
  {
    type: 'email',
    label: 'Email',
    answer: 'safe',
    mock: `
      <div class="mock-email">
        <div class="mock-email-header">
          <div class="mock-email-field"><span class="lbl">From:</span><span class="val">no-reply@dropbox.com</span></div>
          <div class="mock-email-field"><span class="lbl">To:</span><span class="val">you@example.com</span></div>
          <div class="mock-email-subject">Sarah Johnson shared "Q3 Report.pdf" with you</div>
        </div>
        <div class="mock-email-body">
          <p>Sarah Johnson (sarah@example.com) shared a file with you on Dropbox.</p>
          <p><strong>Q3 Report.pdf</strong></p>
          <p><span class="mock-btn" style="background:#0061ff;color:#fff;">Open in Dropbox</span></p>
          <p style="color:#6b7280;font-size:.8rem;">You're receiving this because sarah@example.com shared a Dropbox file with you. Manage notifications at dropbox.com/account.</p>
        </div>
      </div>`,
    explanation: 'This is a legitimate Dropbox file sharing notification from an official Dropbox address.',
    clues: [
      { text: 'Sender is "no-reply@dropbox.com" — official Dropbox domain', good: true },
      { text: 'Shows the specific file name and the sender\'s real email address', good: true },
      { text: 'No urgency, no threats, no request for credentials', good: true },
      { text: 'Footer provides clear opt-out/manage link via dropbox.com', good: true },
    ]
  },
];

/* ══════════════════════════════════════════
   STATE
══════════════════════════════════════════ */
let currentIndex = 0;
let score = 0;
let answers = []; // { correct: bool, label: string }

/* ══════════════════════════════════════════
   DOM REFERENCES
══════════════════════════════════════════ */
const splashScreen   = document.getElementById('splash');
const quizScreen     = document.getElementById('quiz');
const resultsScreen  = document.getElementById('results');

const startBtn       = document.getElementById('startBtn');
const progressBar    = document.getElementById('progressBar');
const progressLabel  = document.getElementById('progressLabel');
const liveScore      = document.getElementById('liveScore');

const categoryBadge  = document.getElementById('categoryBadge');
const categoryIcon   = document.getElementById('categoryIcon');
const categoryLabel  = document.getElementById('categoryLabel');
const scenarioMock   = document.getElementById('scenarioMock');
const questionText   = document.getElementById('questionText');

const safeBtn        = document.getElementById('safeBtn');
const phishBtn       = document.getElementById('phishBtn');
const feedbackPanel  = document.getElementById('feedbackPanel');
const feedbackIcon   = document.getElementById('feedbackIcon');
const feedbackResult = document.getElementById('feedbackResult');
const feedbackExplanation = document.getElementById('feedbackExplanation');
const feedbackClues  = document.getElementById('feedbackClues');
const nextBtn        = document.getElementById('nextBtn');

const finalScore     = document.getElementById('finalScore');
const scoreArc       = document.getElementById('scoreArc');
const scoreTitle     = document.getElementById('scoreTitle');
const scoreMessage   = document.getElementById('scoreMessage');
const reviewList     = document.getElementById('reviewList');
const retryBtn       = document.getElementById('retryBtn');
const shareBtn       = document.getElementById('shareBtn');

/* ══════════════════════════════════════════
   CATEGORY CONFIG
══════════════════════════════════════════ */
const categoryConfig = {
  email:  { icon: 'fa-envelope',           label: 'Email' },
  sms:    { icon: 'fa-mobile-screen-button', label: 'SMS' },
  web:    { icon: 'fa-lock',               label: 'Login Page' },
  social: { icon: 'fa-thumbs-up',          label: 'Social Media' },
};

/* ══════════════════════════════════════════
   SCREEN HELPERS
══════════════════════════════════════════ */
function showScreen(screen) {
  [splashScreen, quizScreen, resultsScreen].forEach(s => {
    s.classList.remove('active');
    s.style.display = 'none';
  });
  screen.style.display = 'flex';
  // force reflow for animation
  void screen.offsetWidth;
  screen.classList.add('active');
}

/* ══════════════════════════════════════════
   QUIZ RENDER
══════════════════════════════════════════ */
function renderScenario() {
  const s = scenarios[currentIndex];

  // Progress
  const pct = ((currentIndex) / scenarios.length) * 100;
  progressBar.style.width = pct + '%';
  progressLabel.textContent = `${currentIndex + 1} / ${scenarios.length}`;

  // Category badge
  const cat = categoryConfig[s.type];
  categoryIcon.className = `fa-solid ${cat.icon}`;
  categoryLabel.textContent = cat.label;

  // Mock
  scenarioMock.innerHTML = s.mock;

  // Question
  questionText.textContent = 'Is this communication safe or a phishing attempt?';

  // Reset feedback
  feedbackPanel.classList.add('hidden');
  safeBtn.disabled  = false;
  phishBtn.disabled = false;
  safeBtn.style.opacity  = '1';
  phishBtn.style.opacity = '1';

  // Reset card animation
  const card = document.getElementById('scenarioCard');
  card.style.animation = 'none';
  void card.offsetWidth;
  card.style.animation = 'cardIn .35s ease';
}

/* ══════════════════════════════════════════
   ANSWER HANDLING
══════════════════════════════════════════ */
function handleAnswer(choice) {
  const s = scenarios[currentIndex];
  const correct = (choice === s.answer);

  if (correct) score++;
  liveScore.textContent = score;

  answers.push({ correct, label: s.label + ' #' + (currentIndex + 1) });

  // Disable buttons
  safeBtn.disabled  = true;
  phishBtn.disabled = true;

  // Dim the wrong choice
  if (choice === 'safe') {
    phishBtn.style.opacity = '0.35';
  } else {
    safeBtn.style.opacity  = '0.35';
  }

  // Feedback icon
  feedbackIcon.textContent = correct ? '✅' : '❌';

  // Result label
  feedbackResult.textContent  = correct ? '✓ Correct!' : '✗ Wrong';
  feedbackResult.className    = 'feedback-result ' + (correct ? 'correct' : 'wrong');

  // Explanation
  feedbackExplanation.textContent = s.explanation;

  // Clues
  feedbackClues.innerHTML = '';
  s.clues.forEach(c => {
    const li = document.createElement('li');
    li.className = c.good ? 'clue-good' : 'clue-bad';
    li.innerHTML = `<i class="fa-solid ${c.good ? 'fa-check' : 'fa-triangle-exclamation'}"></i><span>${c.text}</span>`;
    feedbackClues.appendChild(li);
  });

  // Show feedback
  feedbackPanel.classList.remove('hidden');

  // Update next button label
  nextBtn.innerHTML = currentIndex < scenarios.length - 1
    ? 'Next <i class="fa-solid fa-arrow-right"></i>'
    : 'See Results <i class="fa-solid fa-flag-checkered"></i>';
}

/* ══════════════════════════════════════════
   RESULTS
══════════════════════════════════════════ */
function showResults() {
  showScreen(resultsScreen);

  finalScore.textContent = score;

  // Animate score arc (circumference = 2πr = 2 * π * 52 ≈ 326.7)
  const circumference = 326.7;
  const pct = score / scenarios.length;
  setTimeout(() => {
    scoreArc.style.strokeDashoffset = circumference * (1 - pct);
    // Set colour based on score
    const colour = pct >= 0.8 ? '#4ade80' : pct >= 0.5 ? '#fb4b4e' : '#d10000';
    scoreArc.style.stroke = colour;
  }, 200);

  // Title & message
  const msgs = [
    { min: 9, title: '🎣 Phishing Expert!',    msg: 'Outstanding! You spotted nearly every trap. Your team is lucky to have you.' },
    { min: 7, title: '🛡️ Well Defended!',       msg: 'Great job! You caught most attacks. Review the ones you missed to stay sharp.' },
    { min: 5, title: '⚠️ Getting There...',     msg: 'Not bad, but attackers are counting on those mistakes. Brush up on the clues you missed.' },
    { min: 0, title: '🚨 Stay Alert!',          msg: 'Phishers would love to meet you! Study the explanations and try again.' },
  ];
  const m = msgs.find(x => score >= x.min);
  scoreTitle.textContent   = m.title;
  scoreMessage.textContent = m.msg;

  // Review list
  reviewList.innerHTML = '';
  answers.forEach((a, i) => {
    const div = document.createElement('div');
    div.className = 'review-item';
    div.innerHTML = `
      <span class="ri-num">${i + 1}</span>
      <span class="ri-label">${a.label}</span>
      <span class="ri-result ${a.correct ? 'correct' : 'wrong'}">${a.correct ? '✓ Correct' : '✗ Wrong'}</span>`;
    reviewList.appendChild(div);
  });
}

/* ══════════════════════════════════════════
   EVENT LISTENERS
══════════════════════════════════════════ */
startBtn.addEventListener('click', () => {
  currentIndex = 0;
  score        = 0;
  answers      = [];
  liveScore.textContent = '0';
  showScreen(quizScreen);
  renderScenario();
});

safeBtn.addEventListener('click', () => handleAnswer('safe'));
phishBtn.addEventListener('click', () => handleAnswer('phishing'));

nextBtn.addEventListener('click', () => {
  currentIndex++;
  if (currentIndex < scenarios.length) {
    renderScenario();
    // Scroll card into view on mobile
    document.getElementById('scenarioCard').scrollIntoView({ behavior: 'smooth', block: 'start' });
  } else {
    showResults();
  }
});

retryBtn.addEventListener('click', () => {
  currentIndex = 0;
  score        = 0;
  answers      = [];
  liveScore.textContent = '0';
  progressBar.style.width = '0%';
  showScreen(quizScreen);
  renderScenario();
});

shareBtn.addEventListener('click', () => {
  const text = `I scored ${score}/10 on BaitAware — the phishing detection quiz! Can you beat me? 🎣 #BaitAware #CyberSecurity`;
  if (navigator.share) {
    navigator.share({ title: 'BaitAware', text });
  } else {
    navigator.clipboard.writeText(text).then(() => {
      shareBtn.innerHTML = '<i class="fa-solid fa-check"></i> Copied!';
      setTimeout(() => {
        shareBtn.innerHTML = '<i class="fa-solid fa-share-nodes"></i> Share Score';
      }, 2000);
    });
  }
});

/* ══════════════════════════════════════════
   INIT
══════════════════════════════════════════ */
// Show splash on load
showScreen(splashScreen);
