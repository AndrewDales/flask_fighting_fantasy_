# fights.py
"""Contains the routes triggered by api calls relating to characters"""
from flask import request, jsonify, session

from config import db, app
from services.combat import Fight
import models as m

def fight_round():
    # Check firstly if the request data contains 'attacker_id' and 'defender_id'
    data = request.get_json(silent=True) or {}
    if data and data["attacker_id"] and data["defender_id"]:
        attacker_id = data["attacker_id"]
        defender_id = data["defender_id"]
    # if not check if 'pc_id' and 'npc_id' exist in the session
    elif session['pc_id'] and session['npc_id']:
        attacker_id = session['pc_id']
        defender_id = session['npc_id']
    else:
        return jsonify({"message": "Attacker or Defender id not found"}), 400

    # Retrieve attacker and defender objects from the database
    attacker = db.session.get(m.Character, attacker_id)
    defender = db.session.get(m.Character, defender_id)

    # Validate that both characters exist
    if not attacker or not defender:
        return jsonify({"message": "Attacker or Defender not found"}), 404

    # Set up and resolve a round of fighting between the attack and the defender
    fight = Fight(attacker, defender)
    results = fight.fight_round()
    print(results)

    # Persist stamina changes
    db.session.commit()

    return jsonify(results)

