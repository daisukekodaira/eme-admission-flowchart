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
            progressText.textContent = `進捗: ${completed}/${total}`;
        }
    }
    
    // 進捗をリセットする機能
    window.resetProgress = function() {
        if (confirm('進捗をリセットしますか？')) {
            checkboxes.forEach(checkbox => {
                checkbox.checked = false;
            });
            localStorage.removeItem(storageKey);
            updateProgress();
        }
    };
});

// 質問解説データ
const explanations = {
    'q1': {
        title: 'Q1. 現在、日本の大学に所属していますか？',
        content: `
            <p>この質問では、あなたの現在の学籍状況を確認します。</p>
            
            <h4>「Yes」の場合：</h4>
            <ul>
                <li>現在、日本国内の大学・大学院に在籍している</li>
                <li>学部生、修士課程、博士課程問わず</li>
                <li>休学中でも在籍していれば「Yes」</li>
                <li>→ Q2（入学時期）へ進みます</li>
            </ul>
            
            <h4>「No」の場合：</h4>
            <ul>
                <li>海外の大学に在籍している</li>
                <li>日本の大学を卒業済みで現在無所属</li>
                <li>社会人として働いている</li>
                <li>→ 海外出願フロー（Q4）へ進みます</li>
            </ul>
            
            <p><strong>注意：</strong> この選択により出願プロセスが異なりますので、正確に答えてください。</p>
        `
    },
    'q2': {
        title: 'Q2. 入学時期はいつですか？',
        content: `
            <p>筑波大学大学院では年2回の入学機会があります。</p>
            
            <h4>4月入学：</h4>
            <ul>
                <li>一般的な日本の学事暦に合わせた入学</li>
                <li>出願時期：通常前年の8月〜1月頃</li>
                <li>入試時期：前年の11月〜2月頃</li>
                <li>多くの日本人学生が選択</li>
            </ul>
            
            <h4>10月入学：</h4>
            <ul>
                <li>国際的な学事暦に合わせた入学</li>
                <li>出願時期：通常同年の3月〜7月頃</li>
                <li>入試時期：同年の6月〜8月頃</li>
                <li>海外からの留学生に人気</li>
            </ul>
            
            <p><strong>どちらを選んでも：</strong> 同じ教育内容・研究指導を受けられます。スケジュールに合わせて選択してください。</p>
        `
    },
    'q3': {
        title: 'Q3. 指導教員は決まっていますか？',
        content: `
            <p>大学院入学には指導教員の事前承諾が必要です。</p>
            
            <h4>「Yes」の場合：</h4>
            <ul>
                <li>既に特定の教員と研究テーマについて相談済み</li>
                <li>その教員から指導承諾の内諾を得ている</li>
                <li>→ Q3-1で正式な許諾確認へ進みます</li>
            </ul>
            
            <h4>「No」の場合：</h4>
            <ul>
                <li>まだ指導教員が決まっていない</li>
                <li>どの教員に相談すべきか分からない</li>
                <li>→ 教員リストで研究分野を確認し、興味のある教員に連絡</li>
            </ul>
            
            <h4>教員選びのポイント：</h4>
            <ul>
                <li>研究分野・テーマの一致</li>
                <li>過去の論文・業績を確認</li>
                <li>研究室の雰囲気・方針</li>
                <li>将来のキャリアパスとの整合性</li>
            </ul>
        `
    },
    'q3-1': {
        title: 'Q3-1. 既に教員から許諾をもらっていますか？',
        content: `
            <p>指導教員からの正式な許諾確認について説明します。</p>
            
            <h4>「Yes」の場合：</h4>
            <ul>
                <li>教員から「指導します」という明確な承諾を得ている</li>
                <li>メールや面談で正式に確約されている</li>
                <li>研究テーマについても合意済み</li>
                <li>→ 出願手続きに進むことができます</li>
            </ul>
            
            <h4>「No」の場合：</h4>
            <ul>
                <li>まだ正式な承諾を得ていない</li>
                <li>「検討中」「相談中」の段階</li>
                <li>→ 教員に直接連絡して正式な許諾を求める必要があります</li>
            </ul>
            
            <h4>許諾を得るための連絡方法：</h4>
            <ul>
                <li>研究計画書や志望理由を準備</li>
                <li>これまでの学習・研究経験を整理</li>
                <li>具体的な研究テーマの提案</li>
                <li>丁寧で具体的なメールを送信</li>
            </ul>
            
            <p><strong>重要：</strong> 許諾なしでは出願できませんので、必ず事前に承諾を得てください。</p>
        `
    },
    'q4': {
        title: 'Q4. 奨学金は必要ですか？（海外出願者用）',
        content: `
            <p>海外からの出願者向けの奨学金情報について説明します。</p>
            
            <h4>「Yes」の場合：</h4>
            <ul>
                <li>経済的支援が必要</li>
                <li>学費・生活費の援助を希望</li>
                <li>→ 利用可能な奨学金制度の情報を確認</li>
            </ul>
            
            <h4>主な奨学金制度：</h4>
            <ul>
                <li><strong>MEXT奨学金：</strong> 文部科学省による国費留学生制度</li>
                <li><strong>JASSO奨学金：</strong> 日本学生支援機構による支援</li>
                <li><strong>筑波大学独自奨学金：</strong> 大学による支援制度</li>
                <li><strong>外部奨学金：</strong> 民間財団等による支援</li>
            </ul>
            
            <h4>「No」の場合：</h4>
            <ul>
                <li>自費での留学が可能</li>
                <li>家族・企業等からの支援がある</li>
                <li>→ 出願準備を進める</li>
            </ul>
            
            <p><strong>注意：</strong> 奨学金申請には別途手続きが必要で、採用は選考制です。早めの準備をお勧めします。</p>
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
