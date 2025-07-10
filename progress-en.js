// 進捗追跡とチェックボックス管理
document.addEventListener('DOMContentLoaded', function() {
    const checkboxes = document.querySelectorAll('.question-checkbox');
    const storageKey = 'tsukuba-admission-progress';
    
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
            <p>This question checks your current academic status.</p>
            
            <h4>If "Yes":</h4>
            <ul>
                <li>Currently enrolled at a Japanese university/graduate school</li>
                <li>Undergraduate, master's, or doctoral student</li>
                <li>On leave of absence but still enrolled counts as "Yes"</li>
                <li>→ Proceed to Q2 (enrollment period)</li>
            </ul>
            
            <h4>If "No":</h4>
            <ul>
                <li>Enrolled at an overseas university</li>
                <li>Graduated from a Japanese university and currently unaffiliated</li>
                <li>Working as a professional</li>
                <li>→ Proceed to International Application Flow (Q4)</li>
            </ul>
            
            <p><strong>Note:</strong> Your answer determines the application process, so please answer accurately.</p>
        `
    },
    'q2': {
        title: 'Q2. When do you plan to enroll?',
        content: `
            <p>University of Tsukuba Graduate School offers two enrollment opportunities per year.</p>
            
            <h4>April Enrollment:</h4>
            <ul>
                <li>Aligned with the standard Japanese academic calendar</li>
                <li>Application period: Usually August to January of the previous year</li>
                <li>Entrance exam period: November to February of the previous year</li>
                <li>Popular choice among Japanese students</li>
            </ul>
            
            <h4>October Enrollment:</h4>
            <ul>
                <li>Aligned with the international academic calendar</li>
                <li>Application period: Usually March to July of the same year</li>
                <li>Entrance exam period: June to August of the same year</li>
                <li>Popular among international students</li>
            </ul>
            
            <p><strong>Either choice:</strong> You will receive the same educational content and research supervision. Choose based on your schedule.</p>
        `
    },
    'q3': {
        title: 'Q3. Have you decided on a supervisor?',
        content: `
            <p>Prior approval from a supervisor is required for graduate school admission.</p>
            
            <h4>If "Yes":</h4>
            <ul>
                <li>Already consulted with a specific faculty member about research topics</li>
                <li>Received informal approval for supervision from that faculty member</li>
                <li>→ Proceed to Q3-1 for formal approval confirmation</li>
            </ul>
            
            <h4>If "No":</h4>
            <ul>
                <li>Supervisor not yet determined</li>
                <li>Unsure which faculty member to consult</li>
                <li>→ Check faculty list to review research fields and contact faculty of interest</li>
            </ul>
            
            <h4>Tips for choosing a supervisor:</h4>
            <ul>
                <li>Match in research field/theme</li>
                <li>Review past papers and achievements</li>
                <li>Laboratory atmosphere and policies</li>
                <li>Alignment with future career path</li>
            </ul>
        `
    },
    'q3-1': {
        title: 'Q3-1. Have you already received approval from your supervisor?',
        content: `
            <p>Explanation about formal approval confirmation from your supervisor.</p>
            
            <h4>If "Yes":</h4>
            <ul>
                <li>Received clear approval saying "I will supervise you" from the faculty member</li>
                <li>Formally confirmed via email or interview</li>
                <li>Research theme also agreed upon</li>
                <li>→ You can proceed with the application process</li>
            </ul>
            
            <h4>If "No":</h4>
            <ul>
                <li>Formal approval not yet obtained</li>
                <li>Still in "under consideration" or "in consultation" stage</li>
                <li>→ Need to contact the faculty member directly to seek formal approval</li>
            </ul>
            
            <h4>How to obtain approval:</h4>
            <ul>
                <li>Prepare research proposal and statement of purpose</li>
                <li>Organize your past academic and research experience</li>
                <li>Propose specific research themes</li>
                <li>Send a polite and specific email</li>
            </ul>
            
            <p><strong>Important:</strong> You cannot apply without approval, so be sure to obtain consent in advance.</p>
        `
    },
    'q4': {
        title: 'Q4. Do you need a scholarship? (For International Applicants)',
        content: `
            <p>Information about scholarships for international applicants.</p>
            
            <h4>If "Yes":</h4>
            <ul>
                <li>Financial support needed</li>
                <li>Seeking assistance with tuition and living expenses</li>
                <li>→ Check information on available scholarship programs</li>
            </ul>
            
            <h4>Main scholarship programs:</h4>
            <ul>
                <li><strong>MEXT Scholarship:</strong> Government scholarship program by Ministry of Education</li>
                <li><strong>JASSO Scholarship:</strong> Support by Japan Student Services Organization</li>
                <li><strong>University of Tsukuba Scholarships:</strong> University-specific support programs</li>
                <li><strong>External Scholarships:</strong> Support from private foundations, etc.</li>
            </ul>
            
            <h4>If "No":</h4>
            <ul>
                <li>Self-funded study abroad possible</li>
                <li>Support available from family or company</li>
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
function showExplanation(questionId) {
    const overlay = document.getElementById('overlay');
    const title = document.getElementById('overlay-title');
    const text = document.getElementById('overlay-text');
    
    const explanation = explanations[questionId];
    if (explanation) {
        title.textContent = explanation.title;
        text.innerHTML = explanation.content;
        overlay.style.display = 'block';
        document.body.style.overflow = 'hidden'; // スクロールを無効化
    }
}

// オーバーレイを閉じる
function closeOverlay() {
    const overlay = document.getElementById('overlay');
    overlay.style.display = 'none';
    document.body.style.overflow = 'auto'; // スクロールを再有効化
}
