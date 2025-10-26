# characters.py
"""Contains the routes triggered by api calls relating to characters"""

from flask import abort, request, jsonify, session
from sqlalchemy import func
import pprint as pp

from config import db, app
import models as m


def read_all():
    characters = db.session.scalars(db.select(m.Character)).all()
    # .dump is using the marshmallow schema, defined in models to convert the list of Character types
    # into a list of plain Python dictionaries. Flask automatically converts the list of dictionaries
    # into a JSON response
    return m.characters_schema.dump(characters), 200

def read_pcs():
    pcs = db.session.scalars(db.select(m.Character).where(m.Character.type=="player_character")).all()
    return m.pcs_schema.dump(pcs)

def read_npcs():
    npcs = (db.session.scalars(db.select(m.Character)
                              .where(m.Character.type=="non_player_character")
                                .order_by(m.Character.name)).
            all())
    return m.npcs_schema.dump(npcs), 200

def read_random_npc():
    npc_qry = (db.select(m.Character.id)
           .where(m.Character.type=="non_player_character")
           .order_by(func.random()))
    npc_id = db.session.scalars(npc_qry).first()
    # Records the id of the randomly selected npc in the session dictionary
    session['npc_id'] = npc_id
    return {"npc_id": npc_id}, 200

def read_one(character_id):
    character = db.session.get(m.Character, character_id)
    if isinstance(character, m.PlayerCharacter):
        return m.pc_schema.dump(character), 200
    elif isinstance(character, m.NonPlayerCharacter):
        return  m.npc_schema.dump(character), 200
    else:
        return jsonify({"message": f"Character with ID {character_id} not found"}), 404

def generate_pc(character):
    """ Generates a PlayerCharacter given a dictionary with a 'name' key"""
    new_pc = m.PlayerCharacter.generate_player(character['name'])

    db.session.add(new_pc)
    db.session.commit()
    # Records the id of the newly created player in the session dictionary
    session['pc_id'] = new_pc.id
    return m.pc_schema.dump(new_pc), 201

def create(character):
    new_character = m.character_schema.load(character, session=db.session)
    new_character.max_stamina = new_character.stamina
    db.session.add(new_character)
    db.session.commit()
    return  m.character_schema.dump(new_character), 201

def delete(character_id):
    # Fetch the character
    character = db.session.get(m.Character, character_id)

    # If the character exists, delete it and return a 204 message
    if character:
        c_name = character.name
        db.session.delete(character)
        db.session.commit()
        return {"message": f"{c_name} deleted"}, 204
    else:
        return jsonify({"message": f"Character with ID {character_id} not found"}), 404

def create_npc(character):
    # Crates a character object from a dictionary with 'name', 'skill' and 'stamina'
    npc_character = m.npc_schema.load(character, session=db.session)
    npc_character.max_stamina = npc_character.stamina
    db.session.add(npc_character)
    db.session.commit()
    return  m.npc_schema.dump(npc_character), 201

def update_stamina(character_id):
    # Fetch the character
    character = db.session.get(m.Character, character_id)
    if not character:
        return jsonify({"message": f"Character with ID {character_id} not found"}), 404

    # get the JSON body
    data = request.get_json()
    if not data or 'stamina' not in data:
        return jsonify({"error": "Character not found"}), 400

    character.stamina = data['stamina']
    db.session.merge(character)
    db.session.commit()
    return m.character_schema.dump(character)



if __name__ == "__main__":
    with app.app_context():
        pcs = read_pcs()
        pp.pprint(pcs)
