// --- STATE AND TIMER MANAGEMENT ---
let gameState = 'not_started'; // 'not_started', 'playing', 'ended'
let gameTimer = null;
const GAME_DURATION_MS = 20 * 60 * 1000; // 20 minutes

function startGameTimer() {
  if (gameTimer) clearTimeout(gameTimer);
  gameTimer = setTimeout(() => endGame('timer_expired'), GAME_DURATION_MS);
}

function endGame(reason) {
  gameState = 'ended';
  if (gameTimer) {
    clearTimeout(gameTimer);
    gameTimer = null;
  }
  sendMessageToContentScript({
    action: 'end_game',
    reason: reason,
    message: 'The case is closed, pal. Another night in LA.'
  });
  console.log(`Game ended. Reason: ${reason}`);
}

// --- NARRATIVE AND GAME LOGIC ---
let initialPrompt = '';

async function loadInitialPrompt() {
    try {
        const url = chrome.runtime.getURL('src/prompts.json');
        const response = await fetch(url);
        const data = await response.json();
        initialPrompt = data.narrative.start;
        return initialPrompt;
    } catch (error) {
        console.error("Error loading initial prompt:", error);
        return null;
    }
}

function generateFollowUpPrompt(userInput) {
    // This template is based on the user's instructions.
    return `Continue the story in Philip Marlowe’s voice, adhering to the rules in the initial prompt. User’s response: ${userInput}. End with a dilemma or question.`;
}

// --- COMMUNICATION ---
function sendMessageToContentScript(message) {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        if (tabs[0] && tabs[0].id) {
            chrome.tabs.sendMessage(tabs[0].id, message, (response) => {
                if (chrome.runtime.lastError) {
                    console.log('Could not send message to content script:', chrome.runtime.lastError.message);
                } else {
                    console.log('Message sent, response:', response);
                }
            });
        }
    });
}

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'startGame') {
    if (gameState !== 'playing') {
      console.log('Starting game...');
      gameState = 'playing';
      startGameTimer();
      loadInitialPrompt().then(startPrompt => {
        if (startPrompt) {
          sendMessageToContentScript({ action: 'inject_prompt', text: startPrompt });
          sendResponse({ status: 'game started' });
        } else {
          sendResponse({ status: 'error', message: 'Failed to load initial prompt.'});
          endGame('prompt_load_failed');
        }
      });
    } else {
      sendResponse({ status: 'game already in progress' });
    }
    return true; // Indicates async response
  }
  else if (request.action === 'user_action') {
    if (gameState === 'playing') {
        const followUpPrompt = generateFollowUpPrompt(request.text);
        sendMessageToContentScript({ action: 'inject_prompt', text: followUpPrompt });
        sendResponse({ status: 'follow-up prompt sent' });
    } else {
        sendResponse({ status: 'error', message: 'Game not in play.' });
    }
    return true;
  }
  else if (request.action === 'getGameState') {
    sendResponse({ state: gameState });
  }
  else if (request.action === 'resetGame') {
    console.log('Resetting game...');
    gameState = 'not_started';
    if (gameTimer) {
      clearTimeout(gameTimer);
      gameTimer = null;
    }
    sendResponse({ status: 'game reset' });
  }
  return true;
});

chrome.runtime.onInstalled.addListener(() => {
  console.log('Hollywood Noir Extension background script loaded.');
});
