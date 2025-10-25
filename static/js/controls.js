// static/js/controls.js

import { getDataFetch } from "./request.js";

export class fightControlForm {
    constructor() {
        // Finds the control form
        this.form = document.querySelector(".battle-controls");
        const findEnemyButton = this.form.querySelector("button[data-action='random-opponent']");
        const attackButton = this.form.querySelector("button[data-action='attack']");
        console.log(findEnemyButton)
        findEnemyButton.addEventListener(
            "click",
            this.handleFindEnemyClick.bind(this)
        );
    }

    // Event handler for finding enemy
    async handleFindEnemyClick(event) {
        if (event) {
          event.preventDefault();
        }

        // Make an API request to get a random NPC
        const endpoint = '/api/non_player_characters/random'
        await getDataFetch(endpoint, this.showResponse)
    }

    async showResponse(npc) {
        // Fetch the rendered HTML for the server

        const cardHtml = await fetch(`/character/${npc.id}`).then(res => res.text());
        const npcContentDiv = document.querySelector(".npc-content")
        if (npcContentDiv) npcContentDiv.innerHTML = cardHtml;
    }

    // async fetchRandomNPC() {
    //   try {
    //     const response = await fetch('/api/non_player_characters/random');
    //     if (!response.ok) {
    //         throw new Error(`HTTP error! Status: ${response.status}`);
    //     }
    //     const data = await response.json();
    //     console.log('Random NPC:', data);
    //   } catch (error) {
    //     console.error('Error fetching random NPC:', error);
    //   }
    // }

}