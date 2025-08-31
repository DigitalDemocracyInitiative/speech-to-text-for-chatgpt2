class NoirInjector {
    constructor() {
        this.prompts = [];
        this.textArea = null;
        this.init();
    }

    async init() {
        await this.loadPrompts();
        this.observeDOM();
    }

    async loadPrompts() {
        try {
            const url = chrome.runtime.getURL('src/prompts.json');
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error(`Failed to fetch prompts: ${response.statusText}`);
            }
            const data = await response.json();
            this.prompts = data.prompts;
            console.log("Hollywood Noir Extension: Prompts loaded successfully.");
        } catch (error) {
            console.error("Hollywood Noir Extension: Error loading prompts:", error);
        }
    }

    observeDOM() {
        const observer = new MutationObserver((mutations, obs) => {
            const promptTextArea = document.querySelector('#prompt-textarea');
            if (promptTextArea && !document.querySelector('#noir-injector-button')) {
                this.textArea = promptTextArea;
                this.addInjectionButton();
                // Once the button is added, we can stop observing if we want.
                // obs.disconnect();
            }
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    }

    addInjectionButton() {
        const button = document.createElement('button');
        button.id = 'noir-injector-button';
        button.className = 'flex h-9 min-w-8 items-center justify-center rounded-full border p-2 text-[13px] font-medium text-token-text-secondary border-token-border-light hover:bg-token-main-surface-secondary';
        button.type = 'button';
        button.setAttribute('aria-label', 'Inject Noir Prompt');
        button.title = 'Inject Noir Prompt';
        button.style.marginLeft = '8px';

        const buttonText = document.createElement('span');
        buttonText.textContent = 'Noir';
        button.appendChild(buttonText);

        button.addEventListener('click', () => this.injectRandomPrompt());

        const actionContainer = this.textArea.parentElement?.querySelector('.flex.items-center.gap-2');

        if (actionContainer) {
            actionContainer.prepend(button);
        } else {
            this.textArea.parentElement?.appendChild(button);
        }
    }

    injectRandomPrompt() {
        if (!this.textArea || this.prompts.length === 0) {
            return;
        }

        const randomPrompt = this.prompts[Math.floor(Math.random() * this.prompts.length)];

        this.textArea.textContent = randomPrompt;

        const inputEvent = new InputEvent('input', {
            bubbles: true,
            cancelable: true,
            inputType: 'insertText',
            data: randomPrompt,
        });
        this.textArea.dispatchEvent(inputEvent);

        this.textArea.focus();
        const selection = window.getSelection();
        if (selection) {
            const range = document.createRange();
            range.selectNodeContents(this.textArea);
            range.collapse(false);
            selection.removeAllRanges();
            selection.addRange(range);
        }
    }
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => new NoirInjector());
} else {
    new NoirInjector();
}
