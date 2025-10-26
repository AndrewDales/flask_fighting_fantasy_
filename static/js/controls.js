// static/js/controls.js

import {getDataFetch, sendJSONFetch} from "./request.js";
import { CharacterControl } from "./characters.js"

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
        const cardHtml = await fetch(`/character/${charId}`)
            .then(res => res.text());
        const charContentDiv = document.querySelector(location)
        // Add the HTML for the new card
        if (charContentDiv) charContentDiv.innerHTML = cardHtml;
        // Activate the card controls
        new CharacterControl(charContentDiv)
    }

    // async showPC(pc_id) {
    //     if (!pc_id) return;
    //     const cardHtml = await this.fetchCharacter(pc_id);
    // }

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
    }
    //
    // async fetchCharacter(charID) {
    //     return await fetch(`/character/${charID}`)
    //         .then(res => res.text());
    // }
}