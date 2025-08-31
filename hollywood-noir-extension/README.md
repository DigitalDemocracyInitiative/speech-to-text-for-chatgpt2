# "Hollywood Noir" Voice-Controlled Adventure Game

Step into the rain-slicked streets of 1940s Los Angeles in this voice-controlled, generative adventure game. You are Philip Marlowe, a cynical private eye with a code of his own. Navigate a world of shadows, dames, and double-crosses where your choices, spoken aloud, shape the story.

## How to Play

This extension is a "sidecar" that works alongside a base speech-to-text plugin. You will need to install both.

1.  **Install the Base Plugin:**
    *   Download the `speech-to-text-for-chatgpt` plugin from its GitHub repository: [https://github.com/zubyj/speech-to-text-for-chatgpt](https://github.com/zubyj/speech-to-text-for-chatgpt)
    *   Follow the installation instructions in that repository to load it as an unpacked extension in your Chrome or Edge browser.

2.  **Install the "Hollywood Noir" Extension:**
    *   Clone or download this repository (`hollywood-noir-extension`).
    *   In your browser's extension management page (`chrome://extensions`), ensure "Developer mode" is enabled.
    *   Click "Load unpacked" and select the `hollywood-noir-extension` folder.

3.  **Start the Game:**
    *   Navigate to [https://chat.openai.com/](https://chat.openai.com/).
    *   The "Send Action" button will appear near the chat input. Click it to send your typed commands to Marlowe.
    *   To play by voice, use the base plugin's microphone to dictate your actions into the text box, then click "Send Action".

## Gameplay

This is an open-world, generative narrative experience. There are no pre-defined choices.

*   **You are the Director:** You tell Philip Marlowe what to do next. Type your action in the chat box (e.g., "Check the dame's purse for a clue") and click "Send Action".
*   **Marlowe is the Narrator:** The game will respond with a new prompt, narrated by Marlowe in his signature first-person, cynical style.
*   **The Clock is Ticking:** You have **20 minutes** to unravel the mystery. When the timer runs out, the case goes cold and the game ends.

## Development

This extension is built with a "sidecar" architecture and a "no-compile" philosophy.

*   **Sidecar Architecture:** It is designed to run alongside the base `speech-to-text-for-chatgpt` plugin without modifying its code. It interacts with the web page's DOM, just like the base plugin does.
*   **No-Compile Approach:** The project uses plain JavaScript and standard web APIs. There is no build step or compilation required, making it easy to modify and experiment with. All logic is contained within the `src` directory.

## License

This project is licensed under the MIT License. See the `LICENSE` file for details.
