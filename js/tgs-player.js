class TgsPlayer extends HTMLElement {
    static get observedAttributes() {
        return ['src', 'once', 'onclick', 'autoplay', 'width', 'height'];
    }

    constructor() {
        super();
        this._loadTgSticker();
    }

    async _loadTgSticker() {
        if (!window.RLottie) {
            // Определяем базовый путь на основе текущего скрипта
            const currentScript = document.currentScript || (function() {
                const scripts = document.getElementsByTagName('script');
                return scripts[scripts.length - 1];
            })();
            const basePath = new URL('.', currentScript.src).href;
            
            // Сохраняем в window для использования в tgsticker.js
            window.__tgsBasePath = basePath;
            
            const script = document.createElement('script');
            script.src = basePath + 'tgsticker.js';
            script.async = false;
            await new Promise((resolve) => {
                script.onload = resolve;
                document.head.appendChild(script);
            });
        }
    }

    setSizeFromHost(picture) {
        const attrWidth = this.getAttribute('width');
        const attrHeight = this.getAttribute('height');
        
        if (attrWidth) {
            picture.setAttribute('width', attrWidth);
            picture.style.width = attrWidth.includes('%') ? attrWidth : attrWidth + 'px';
        }
        if (attrHeight) {
            picture.setAttribute('height', attrHeight);
            picture.style.height = attrHeight.includes('%') ? attrHeight : attrHeight + 'px';
        }

        if (!attrWidth || !attrHeight) {
            const rect = this.getBoundingClientRect();
            if (rect.width > 0 && !attrWidth) {
                picture.setAttribute('width', Math.round(rect.width));
                picture.style.width = rect.width + 'px';
            }
            if (rect.height > 0 && !attrHeight) {
                picture.setAttribute('height', Math.round(rect.height));
                picture.style.height = rect.height + 'px';
            }
        }
    }

    // if exist onclick attribute, set the onclick event
    setPlayOnClick(picture) {
        if (this.hasAttribute('onclick')) {
            picture.onclick = () => {
                RLottie.playOnce(picture);
            };
        }
    }

    // Преобразуем относительный путь в абсолютный URL
    resolveUrl(relPath) {
        return new URL(relPath, window.location.href).href;
    }

    connectedCallback() {
        const picture = document.createElement('picture');
        
        const source = document.createElement('source');
        source.type = 'application/x-tgsticker';
        
        // Разрешаем путь относительно текущей страницы
        const srcPath = this.getAttribute('src') || '';
        source.srcset = this.resolveUrl(srcPath);
        
        picture.appendChild(source);
        this.appendChild(picture);
        this.setSizeFromHost(picture);
        this.setPlayOnClick(picture);

        // init RLottie after loading the script
        this._loadTgSticker().then(() => {
            RLottie.init(picture, {
                maxDeviceRatio: 2,
                cachingModulo: 3,
                noAutoPlay: !this.hasAttribute('autoplay'),
                playOnce: this.hasAttribute('once'),
            });
        });
    }
}

customElements.define('tgs-player', TgsPlayer);