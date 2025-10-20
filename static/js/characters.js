// static/js/characters.js

import {sendJSONFetch} from "./request.js";

export class nonPlayerCharacters {
    constructor() {
        // Finds all the NPC cards and activates the controls (delete button) on the card
        this.allNpcCards = document.querySelectorAll(".npc-card");
        this.activateNpcControls();

        // If there is an NPC creation card on the page - activate it
        if (document.querySelector(".npc-create-card")) {
            this.activateCreateNPCForm();
        }

    }

    activateCreateNPCForm () {
        const npcForm = document.querySelector(".npc-create-card form");
        new CreateNPCForm(npcForm);
    }

    activateNpcControls () {
        this.allNpcCards.forEach((npcCard) =>{
            new CharacterControl(npcCard)
        });
    }
}

export class PlayerCharacters {
    constructor() {
        this.activateCreatePCForm();
    }

    activateCreatePCForm (){
        const pcForm = document.querySelector(".character-create-card form")
        new CreatePCForm(pcForm)
    }
}

class CreateCharacterForm {
    constructor(el) {
        this.form = el;
        this.createButton = el.querySelector("button[data-action='create_character']");
        this.createButton.addEventListener(
            "click",
            this.handleCreateClick.bind(this)
        );
    }

    // Base case method that subclass should override
    handleCreateClick(event) {
        console.warn("handleCreateClick() not implemented in subclass.")
    }

    getFormData(event) {
        event.preventDefault();

        // Get the name from the form
        const formData = new FormData(this.form);
        const characterData = Object.fromEntries(formData)

        if (!this.validateForm(characterData)) return

                // Parse specific fields to numbers
        if (characterData.skill) characterData.skill = parseInt(characterData.skill, 10);
        if (characterData.stamina) characterData.stamina = parseInt(characterData.stamina, 10);


        // Put data in JSON format
        return JSON.stringify(characterData);
    }

    validateForm(characterData) {
        if (!characterData.name || characterData.name.length < 3) {
            console.error("Name must be at least 3 characters")
            return false
        }
        return true
    }
}

class CreatePCForm extends CreateCharacterForm{

    handleCreateClick(event) {
        const jsonData = super.getFormData(event)
        if (!jsonData) return

        // Send name as JSON to the api endpoint which will roll up a new PC
        sendJSONFetch(jsonData, "POST", "/api/player_characters", this.addCharacterToList);
        this.form.reset();
  }

    async addCharacterToList(newCharacter) {
        // Remove other characters
        document.querySelectorAll(".pc-card").forEach(el => el.remove())

        // Fetch the rendered HTML for the server
        const cardHtml = await fetch(`/character/${newCharacter.id}`).then(res => res.text());

        // Add the new card into the first element with class "pc-content"
        const pc_div = document.querySelector(".pc-content");
        pc_div.insertAdjacentHTML("afterbegin", cardHtml);

        // Activate the new form
        const newForm = document.querySelector(`div[data-id='${newCharacter.id}']`);
        new CharacterControl(newForm)
    }
}

class CreateNPCForm extends CreateCharacterForm {

    handleCreateClick(event) {
        // Gets data from form, validates it and puts it into JSON form
        const jsonData = super.getFormData(event)
        if (!jsonData) return

        // Send the data as JSON to the api endpoint, send the return data to addNPCToList
        sendJSONFetch(jsonData, "POST", "api/non_player_characters", this.addNPCToList);

        this.form.reset();
    }

    validateForm(characterData) {
        if (!super.validateForm(characterData)) return false;

        if (characterData.skill && characterData.stamina) {
            return true
        }
        else {
            console.error("Skill and Stamina are required entries")
            return false
        }
    }

    async addNPCToList(newCharacter) {
        // Fetch the rendered HTML for the server
        const cardHtml = await fetch(`/character/${newCharacter.id}`).then(res => res.text());

        // Add the new card into the first element with class "npc-list"
        const npc_list = document.querySelector(".npc-list");
        npc_list.insertAdjacentHTML("beforeend", cardHtml);

        // Activate the new form
        const newForm = document.querySelector(`div[data-id='${newCharacter.id}']`);
        new CharacterControl(newForm)
    }
}



class CharacterControl {
    constructor(el) {
        this.characterCard = el;
        this.characterID = this.characterCard.getAttribute("data-id")
        this.deleteButton = el.querySelector("button[data-action='delete_character']");
        this.deleteButton.addEventListener(
            "click",
            this.handleDeleteClick.bind(this)
        );
    }

    handleDeleteClick(event) {
        event.preventDefault()
        const endpoint = `/api/characters/${this.characterID}`
        // Call the API with the endpoint and method DELETE
        fetch(endpoint, {method: "DELETE"} ).then(response=>{
            if (!response.ok) {
              throw new Error(`Response status: ${response.status}`);
            }
            this.characterCard.remove();
        })
            .catch(error => {
                console.error("Failed to delete NPC:", error);
            })
    }
}

