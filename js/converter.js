document.addEventListener('DOMContentLoaded', () => {
    // Elements
    const urlInput = document.getElementById('url-input');
    const convertBtn = document.getElementById('convert-btn');
    const progressContainer = document.querySelector('.progress-container');
    const resultContainer = document.querySelector('.result-container');
    const progressBarFill = document.querySelector('.progress-fill');
    const statusText = document.querySelector('.status-text');
    const downloadBtn = document.getElementById('download-btn');
    const fileNameDisplay = document.querySelector('.file-name');
    const modeBtns = document.querySelectorAll('.mode-btn');

    let isConverting = false;

    // Mode switching (visual only for now, as backend simplifies to video->midi)
    modeBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            modeBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
        });
    });

    // Validar URL input
    urlInput.addEventListener('input', () => {
        const url = urlInput.value.trim();
        if (isValidYoutubeUrl(url)) {
            urlInput.style.borderColor = 'var(--neon-green)';
        } else {
            urlInput.style.borderColor = 'rgba(255, 255, 255, 0.1)';
        }
    });

    convertBtn.addEventListener('click', async () => {
        if (isConverting) return;

        const url = urlInput.value.trim();

        if (!url) {
            alert('Por favor, insira um link do YouTube.');
            return;
        }

        if (!isValidYoutubeUrl(url)) {
            alert('Por favor, insira um link válido do YouTube.');
            return;
        }

        startConversion(url);
    });

    function isValidYoutubeUrl(url) {
        return (url.includes('youtube.com') || url.includes('youtu.be'));
    }

    async function startConversion(url) {
        isConverting = true;

        // UI Updates
        convertBtn.disabled = true;
        convertBtn.classList.add('processing');
        convertBtn.querySelector('.btn-text').textContent = 'Processando...';

        document.querySelector('.converter-card').classList.add('processing');
        progressContainer.classList.remove('hidden');
        resultContainer.classList.add('hidden');

        // Reset progress
        progressBarFill.style.width = '0%';
        statusText.textContent = 'Iniciando servidor...';

        // Simulate progress for user feedback (since real progress is hard via simple fetch)
        let progress = 5;
        const progressInterval = setInterval(() => {
            if (progress < 90) {
                progress += Math.random() * 2;
                progressBarFill.style.width = `${Math.min(progress, 90)}%`;

                if (progress > 20 && progress < 40) statusText.textContent = 'Baixando vídeo...';
                else if (progress > 40 && progress < 70) statusText.textContent = 'Extraindo áudio...';
                else if (progress > 70) statusText.textContent = 'Transcrevendo com IA (pode demorar)...';
            }
        }, 1000);

        try {
            const response = await fetch('/api/convert', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ url: url })
            });

            const data = await response.json();

            clearInterval(progressInterval);
            progressBarFill.style.width = '100%';

            if (response.ok && data.success) {
                showSuccess(data);
            } else {
                showError(data.error || 'Erro desconhecido');
            }

        } catch (error) {
            clearInterval(progressInterval);
            showError('Erro de conexão com o servidor. Verifique se o server.py está rodando.');
            console.error(error);
        } finally {
            isConverting = false;
            convertBtn.disabled = false;
            convertBtn.classList.remove('processing');
            convertBtn.querySelector('.btn-text').textContent = 'Iniciar Conversão';
            document.querySelector('.converter-card').classList.remove('processing');
        }
    }

    function showSuccess(data) {
        statusText.textContent = 'Concluído!';
        setTimeout(() => {
            progressContainer.classList.add('hidden');
            resultContainer.classList.remove('hidden');

            fileNameDisplay.textContent = data.filename;

            // Setup download button
            downloadBtn.onclick = () => {
                window.location.href = data.download_url;
            };

            // Optional: Auto download or visual flair
        }, 500);
    }

    function showError(msg) {
        statusText.textContent = `Erro: ${msg}`;
        statusText.style.color = 'var(--neon-pink)';
        progressBarFill.style.backgroundColor = 'var(--neon-pink)';
    }
});
