# app.py

from flask import render_template, url_for, jsonify, redirect, session
import requests
import config

from models import Character, NonPlayerCharacter

app = config.connex_app
app.add_api(config.basedir / "swagger.yaml")
db = config.db

# Redirect base directory to route for home
@app.route('/')
def index():
    return redirect(url_for('home'))

# Add a Debug to show all the routes
@app.route("/routes")
def list_routes():
    routes = []
    for rule in config.connex_app.app.url_map.iter_rules():
        routes.append({
            "endpoint": rule.endpoint,
            "methods": list(rule.methods),
            "rule": str(rule)
        })
    return jsonify(routes)

@app.route('/home')
def home():  # put application's code here
    # Get a random non-player character via the random npc api
    if not ('npc_id' in session):
        npc_url = url_for('/api.routes_characters_read_random_npc', _external=True)
        npc_id_response = requests.get(npc_url)
        session['npc_id'] = npc_id_response.json().npc_id
    if not ('pc_id' in session):
        session['pc_id'] = 17
    npc_url = url_for('/api.routes_characters_read_one', character_id=session['npc_id'], _external=True)
    response = requests.get(npc_url)
    npc_data = response.json()
    pc_url = url_for('/api.routes_characters_read_one', character_id=session['pc_id'], _external=True)
    response = requests.get(pc_url)
    pc_data = response.json()
    return render_template("home.html", npc=npc_data, pc=pc_data)
    # return render_template("home.html")

@app.route('/npcs')
def npc_screen():
    # Get all npc data from the API.
    npc_url = url_for('/api.routes_characters_read_npcs', _external=True)
    response = requests.get(npc_url)
    data = response.json()
    return render_template("npcs.html", npcs=data)

# Route to display a single character card
@app.route('/character/<int:character_id>')
def character_card(character_id):
    char_card_url = url_for('/api.routes_characters_read_one', character_id=character_id, _external=True)
    response = requests.get(char_card_url)
    if response.ok:
        character_data = response.json()
        if character_data['type'] == 'player_character':
            return render_template("_pc_content.html", pc=character_data)
        elif character_data['type'] == 'non_player_character':
            return render_template("_npc_content.html", npc=character_data)
        else:
            return f"Unknown character type", 404
    else:
        return f"Character with id {character_id} not found", 404


if __name__ == '__main__':
    app.run(log_level='debug')
