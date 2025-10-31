// static/js/index.js

import { DebugForm } from "./debug.js";
import { nonPlayerCharacters } from "./characters.js"
import { PlayerCharacters } from "./characters.js";
import { DiceControl } from "./dice.js"
import { fightControlForm } from "./controls.js";

export const dice_pc = new DiceControl(document.querySelector(".pc-content"), 0.25)
export const dice_npc = new DiceControl(document.querySelector(".npc-content"), 0.25)

function main() {
    new nonPlayerCharacters()
    if (document.querySelector(".character-create-card")){
        new PlayerCharacters()
    }

    if (document.querySelector(".debug-card")) {
        const debug = new DebugForm();
        debug.showResponse("");
    }

    if (document.querySelector(".battle-controls")) {
        new fightControlForm()
    }

    if (document.querySelector(".tray")){
        dice_pc.roll([gsap.utils.random(1, 6, 1), gsap.utils.random(1, 6, 1)])
    }

    }

main();