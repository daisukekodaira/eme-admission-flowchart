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
