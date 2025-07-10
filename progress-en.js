// 進捗追跡とチェックボックス管理
document.addEventListener('DOMContentLoaded', function() {
    const checkboxes = document.querySelectorAll('.question-checkbox');
    const storageKey = 'tsukuba-admission-progress-en';
    
    // ページ読み込み時に保存された状態を復元
    loadProgress();
    
    // チェックボックスの変更を監視
    checkboxes.forEach(checkbox => {
        checkbox.addEventListener('change', function() {
            saveProgress();
            updateProgress();
        });
    });
    
    // オーバーレイのイベントリスナー
    setupOverlay();
    
    // 進捗を保存
    function saveProgress() {
        const progress = {};
        checkboxes.forEach(checkbox => {
            progress[checkbox.id] = checkbox.checked;
        });
        localStorage.setItem(storageKey, JSON.stringify(progress));
    }
    
    // 進捗を読み込み
    function loadProgress() {
        const saved = localStorage.getItem(storageKey);
        if (saved) {
            const progress = JSON.parse(saved);
            checkboxes.forEach(checkbox => {
                if (progress[checkbox.id]) {
                    checkbox.checked = true;
                }
            });
        }
        updateProgress();
    }
    
    // 進捗表示を更新
    function updateProgress() {
        const total = checkboxes.length;
        const completed = Array.from(checkboxes).filter(cb => cb.checked).length;
        
        // 進捗バーを表示するエリアがあれば更新
        const progressBar = document.querySelector('.progress-bar');
        if (progressBar) {
            const percentage = (completed / total) * 100;
            progressBar.style.width = percentage + '%';
        }
        
        // 進捗テキストを更新
        const progressText = document.querySelector('.progress-text');
        if (progressText) {
            progressText.textContent = `Progress: ${completed}/${total}`;
        }
    }
    
    // 進捗をリセットする機能
    window.resetProgress = function() {
        if (confirm('Reset progress?')) {
            checkboxes.forEach(checkbox => {
                checkbox.checked = false;
            });
            localStorage.removeItem(storageKey);
            updateProgress();
        }
    };
});

// 質問解説データ（英語版）
const explanations = {
    'q1': {
        title: 'Q1. Are you currently enrolled at a Japanese university?',
        content: `
            <p>This question confirms your current enrollment status.</p>
            
            <h4>If "Yes":</h4>
            <ul>
                <li>Currently enrolled at a Japanese university or graduate school</li>
                <li>Undergraduate, Master's, or Doctoral students</li>
                <li>"Yes" even if on leave of absence while still enrolled</li>
                <li>→ Proceed to Q2 (Enrollment period)</li>
            </ul>
            
            <h4>If "No":</h4>
            <ul>
                <li>Enrolled at an overseas university</li>
                <li>Already graduated from a Japanese university and currently unaffiliated</li>
                <li>Working as a professional</li>
                <li>→ Proceed to International Application Flow (Q4)</li>
            </ul>
            
            <p><strong>Note:</strong> Your application process will differ based on this choice, so please answer accurately.</p>
        `
    },
    'q2': {
        title: 'Q2. When do you plan to enroll?',
        content: `
            <p>The University of Tsukuba Graduate School offers two enrollment periods per year.</p>
            
            <h4>April Enrollment:</h4>
            <ul>
                <li>Enrollment aligned with the typical Japanese academic calendar</li>
                <li>Application period: Usually from August to January of the previous year</li>
                <li>Examination period: Usually from November to February of the previous year</li>
                <li>Popular choice among Japanese students</li>
            </ul>
            
            <h4>October Enrollment:</h4>
            <ul>
                <li>Enrollment aligned with the international academic calendar</li>
                <li>Application period: Usually from March to July of the same year</li>
                <li>Examination period: Usually from June to August of the same year</li>
                <li>Popular among international students</li>
            </ul>
            
            <p><strong>Either choice:</strong> You will receive the same educational content and research guidance. Choose based on your schedule.</p>
        `
    },
    'q3': {
        title: 'Q3. Have you decided on a supervisor?',
        content: `
            <p>Prior approval from a supervisor is required for graduate school admission.</p>
            
            <h4>If "Yes":</h4>
            <ul>
                <li>Already consulted with a specific faculty member about research topics</li>
                <li>Received informal consent for supervision from that faculty member</li>
                <li>→ Proceed to Q3-1 for formal approval confirmation</li>
            </ul>
            
            <h4>If "No":</h4>
            <ul>
                <li>Supervisor not yet determined</li>
                <li>Unsure which faculty member to consult</li>
                <li>→ Check the faculty list to review research fields and contact faculty members of interest</li>
            </ul>
            
            <h4>Key Points for Choosing a Supervisor:</h4>
            <ul>
                <li>Alignment of research fields and topics</li>
                <li>Review past papers and achievements</li>
                <li>Laboratory atmosphere and policies</li>
                <li>Alignment with future career paths</li>
            </ul>
        `
    },
    'q3-1': {
        title: 'Q3-1. Have you already received approval from your supervisor?',
        content: `
            <p>Information about formal approval confirmation from your supervisor.</p>
            
            <h4>If "Yes":</h4>
            <ul>
                <li>Received clear consent from the faculty member saying "I will supervise you"</li>
                <li>Formally confirmed through email or meeting</li>
                <li>Research topics also agreed upon</li>
                <li>→ You can proceed with the application process</li>
            </ul>
            
            <h4>If "No":</h4>
            <ul>
                <li>Formal consent not yet obtained</li>
                <li>Still in the "under consideration" or "under discussion" stage</li>
                <li>→ Need to contact the faculty member directly to seek formal approval</li>
            </ul>
            
            <h4>How to Contact for Approval:</h4>
            <ul>
                <li>Prepare a research plan and statement of purpose</li>
                <li>Organize your past learning and research experience</li>
                <li>Propose specific research topics</li>
                <li>Send a polite and specific email</li>
            </ul>
            
            <p><strong>Important:</strong> You cannot apply without approval, so be sure to obtain consent beforehand.</p>
        `
    },
    'q4': {
        title: 'Q4. Do you need a scholarship? (For International Applicants)',
        content: `
            <p>Information about scholarship options for international applicants.</p>
            
            <h4>If "Yes":</h4>
            <ul>
                <li>Financial support needed</li>
                <li>Seeking assistance with tuition and living expenses</li>
                <li>→ Check information on available scholarship programs</li>
            </ul>
            
            <h4>Major Scholarship Programs:</h4>
            <ul>
                <li><strong>MEXT Scholarship:</strong> Japanese Government (MEXT) Scholarship for international students</li>
                <li><strong>JASSO Scholarship:</strong> Support from Japan Student Services Organization</li>
                <li><strong>University of Tsukuba Scholarships:</strong> University-specific support programs</li>
                <li><strong>External Scholarships:</strong> Support from private foundations and organizations</li>
            </ul>
            
            <h4>If "No":</h4>
            <ul>
                <li>Self-funded study abroad is possible</li>
                <li>Support available from family or companies</li>
                <li>→ Proceed with application preparation</li>
            </ul>
            
            <p><strong>Note:</strong> Scholarship applications require separate procedures and selection is competitive. Early preparation is recommended.</p>
        `
    }
};

// オーバーレイの設定
function setupOverlay() {
    const overlay = document.getElementById('overlay');
    const closeBtn = document.querySelector('.close-btn');
    
    // 閉じるボタンのクリック
    closeBtn.addEventListener('click', closeOverlay);
    
    // オーバーレイ背景のクリック
    overlay.addEventListener('click', function(e) {
        if (e.target === overlay) {
            closeOverlay();
        }
    });
    
    // ESCキーで閉じる
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && overlay.style.display === 'block') {
            closeOverlay();
        }
    });
}

// 解説を表示
// オーバーレイの動的配置機能
function showExplanation(questionId) {
    const overlay = document.getElementById('overlay');
    const title = document.getElementById('overlay-title');
    const text = document.getElementById('overlay-text');
    const overlayContent = document.querySelector('.overlay-content');
    const explanation = explanations[questionId];
    
    if (explanation) {
        title.textContent = explanation.title;
        text.innerHTML = explanation.content;
        overlay.style.display = 'flex';
        // スクロールを有効のまま維持
    }
}

// 全質問アイコンにイベントリスナー追加
document.addEventListener('DOMContentLoaded', () => {
    const overlay = document.querySelector('.overlay');
    const overlayContent = document.querySelector('.overlay-content');
    const closeBtn = document.querySelector('.close-btn');

    // 全質問アイコンにイベントリスナー追加
    document.querySelectorAll('.question-icon').forEach(icon => {
        icon.addEventListener('click', (e) => {
            const rect = e.target.getBoundingClientRect();
            const questionId = e.target.getAttribute('data-question');
            
            // オーバーレイ内容を設定
            if (questionId && explanations[questionId]) {
                const explanation = explanations[questionId];
                document.getElementById('overlay-title').textContent = explanation.title;
                document.getElementById('overlay-text').innerHTML = explanation.content;
            }

            // アイコンの位置に基づいてオーバーレイを配置
            overlayContent.style.top = `${rect.bottom + window.scrollY + 10}px`;
            overlayContent.style.left = `${rect.left + rect.width / 2}px`;
            overlayContent.style.transform = 'translateX(-50%)';

            // 画面外にはみ出さないよう調整
            const contentRect = overlayContent.getBoundingClientRect();
            if (rect.left + rect.width / 2 - contentRect.width / 2 < 10) {
                overlayContent.style.left = '10px';
                overlayContent.style.transform = 'none';
            } else if (rect.left + rect.width / 2 + contentRect.width / 2 > window.innerWidth - 10) {
                overlayContent.style.left = `${window.innerWidth - contentRect.width - 10}px`;
                overlayContent.style.transform = 'none';
            }

            overlay.style.display = 'flex';
            // スクロールを有効のまま維持
        });
    });

    // 閉じるボタン処理
    if (closeBtn) {
        closeBtn.addEventListener('click', () => {
            overlay.style.display = 'none';
        });
    }

    // オーバーレイ背景クリックで閉じる
    overlay.addEventListener('click', (e) => {
        if (e.target === overlay) {
            overlay.style.display = 'none';
        }
    });

    // ESCキーで閉じる
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && overlay.style.display === 'flex') {
            overlay.style.display = 'none';
        }
    });

    // ウィンドウリサイズ時にも位置調整
    window.addEventListener('resize', () => {
        if (overlay.style.display === 'flex') {
            overlay.style.display = 'none';
        }
    });
});

// オーバーレイを閉じる
function closeOverlay() {
    const overlay = document.getElementById('overlay');
    overlay.style.display = 'none';
}
