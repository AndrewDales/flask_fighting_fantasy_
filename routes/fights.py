# fights.py
"""Contains the routes triggered by api calls relating to characters"""
from flask import request, jsonify

from config import db, app
from services.combat import Fight
import models as m

def fight_round():
    data = request.get_json()
    if not data or ('attacker_id' not in data) or ('defender_id' not in data):
        return jsonify({"message": "Attacker or Defender id not found"}), 400

    attacker_id = data["attacker_id"]
    defender_id = data["defender_id"]
    attacker = db.session.get(m.Character, attacker_id)
    defender = db.session.get(m.Character, defender_id)

    fight = Fight(attacker, defender)
    results = fight.fight_round()
    print(results)

    db.session.commit()

    return jsonify(results)

