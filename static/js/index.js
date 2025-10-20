// static/js/index.js

import { DebugForm } from "./debug.js";
import { nonPlayerCharacters } from "./characters.js"
import { PlayerCharacters } from "./characters.js";

function main() {
    new nonPlayerCharacters()
    if (document.querySelector(".character-create-card")){
        new PlayerCharacters()
    }

    if (document.querySelector(".debug-card")) {
        const debug = new DebugForm();
        // debug.handleSendClick(null)
        debug.showResponse("");
    }
    }

main();