// static/js/controls.js

import {getDataFetch, sendJSONFetch} from "./request.js";
import { CharacterControl } from "./characters.js"
import { dice_pc, dice_npc } from "./index.js"

export class fightControlForm {
    constructor() {
        // Finds the control form
        this.form = document.querySelector(".battle-controls");
        const findEnemyButton = this.form.querySelector("button[data-action='random-opponent']");
        const attackButton = this.form.querySelector("button[data-action='attack']");
        findEnemyButton.addEventListener(
            "click",
            this.handleFindEnemyClick.bind(this)
        );
        attackButton.addEventListener(
            "click",
            this.handleAttack.bind(this)
        )
    }

    // Event handler for finding enemy
    async handleFindEnemyClick(event) {
        if (event) {
          event.preventDefault();
        }

        // Make an API request to get a random NPC
        const endpoint = '/api/non_player_characters/random'
        // Function will fetch the data from the api and send it as a parameter to the showNPC function
        await getDataFetch(endpoint, (npc) => this.showChar(npc.npc_id))
    }

    async showChar(charId, location=".npc-content") {
        // Fetch the rendered HTML for the server
        if (!charId) return;
        const response = await fetch(`/character/${charId}`)
        if (!response.ok) {
            throw new Error(`Character with id ${charId} not found`)
        }
        const cardHtml = await response.text()

        // Find the required location and add the HTML for the new card
        const charContentDiv = document.querySelector(location)
        if (charContentDiv) charContentDiv.innerHTML = cardHtml;
        // Activate the card controls
        new CharacterControl(charContentDiv)
    }

    async handleAttack(event) {
        if (event) {
            event.preventDefault()
        }

        // Make an API request to fight - no payload is needed as this will be picked up from the session dictionary
        const endpoint = '/api/fight_round'
        await sendJSONFetch(JSON.stringify({}), "POST", endpoint,
            (results) => this.showCombatResults(results))
    }

    async showCombatResults(roundResults) {
        console.log(roundResults)
        if (roundResults.result === "won" || roundResults.result === "draw"){
            await this.showChar(roundResults.defender_id, ".npc-content")
        }
        if (roundResults.result === "lost" || roundResults.result === "draw") {
            await this.showChar(roundResults.attacker_id, ".pc-content")
        }

        dice_pc.roll([3, 4])

        const response = await fetch('/battle_round', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(roundResults)
        });
        if (!response.ok) {
            throw new Error('Battle Round report not generated')
        }

        const reportHTML = await response.text()

        const report_el = document.querySelector(".battle-report")
        report_el.insertAdjacentHTML("beforeend", reportHTML)
        report_el.scrollTop = report_el.scrollHeight
        console.log(reportHTML)
    }
}