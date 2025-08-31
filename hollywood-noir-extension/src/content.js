class NoirGameManager {
    constructor() {
        this.textArea = null;
        this.actionButton = null;
        this.init();
    }

    init() {
        this.observeDOM();
        this.setupMessageListener();
    }

    observeDOM() {
        const observer = new MutationObserver((mutations, obs) => {
            const promptTextArea = document.querySelector('#prompt-textarea');
            if (promptTextArea && !document.querySelector('#noir-action-button')) {
                this.textArea = promptTextArea;
                this.addActionButton();
            }
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    }

    addActionButton() {
        const button = document.createElement('button');
        button.id = 'noir-action-button';
        button.className = 'flex h-9 min-w-8 items-center justify-center rounded-full border p-2 text-[13px] font-medium text-token-text-secondary border-token-border-light hover:bg-token-main-surface-secondary';
        button.type = 'button';
        button.title = 'Send your next action to Marlowe';
        button.style.marginLeft = '8px';

        const buttonText = document.createElement('span');
        buttonText.textContent = 'Send Action';
        button.appendChild(buttonText);

        button.addEventListener('click', () => this.sendUserAction());
        this.actionButton = button;

        const actionContainer = this.textArea.parentElement?.querySelector('.flex.items-center.gap-2');
        if (actionContainer) {
            actionContainer.prepend(button);
        }
    }

    sendUserAction() {
        if (!this.textArea) return;

        const userText = this.textArea.textContent;
        if (userText.trim()) {
            chrome.runtime.sendMessage({ action: 'user_action', text: userText });
            this.clearInput();
        }
    }

    injectPrompt(text) {
        if (!this.textArea) return;

        this.textArea.textContent = text;

        const inputEvent = new InputEvent('input', {
            bubbles: true,
            cancelable: true,
            inputType: 'insertText',
            data: text,
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

    clearInput() {
        if (!this.textArea) return;
        this.textArea.textContent = '';
        const inputEvent = new InputEvent('input', { bubbles: true, cancelable: true });
        this.textArea.dispatchEvent(inputEvent);
    }

    setupMessageListener() {
        chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
            if (request.action === 'inject_prompt') {
                this.injectPrompt(request.text);
                sendResponse({ status: 'prompt injected' });
            } else if (request.action === 'end_game') {
                this.injectPrompt(request.message);
                if (this.actionButton) {
                    this.actionButton.disabled = true;
                    this.actionButton.textContent = 'Game Over';
                }
                sendResponse({ status: 'game ended' });
            }
            return true;
        });
    }
}

new NoirGameManager();
