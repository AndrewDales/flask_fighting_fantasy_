# console.py

from config import db, app
from models import Character, PlayerCharacter, NonPlayerCharacter, character_schema


with app.app_context():
    characters = db.session.scalars(db.select(Character)).all()
    pcs = db.session.scalars(db.select(PlayerCharacter)).all()
    npcs = db.session.scalars(db.select(NonPlayerCharacter)).all()
    db.session.commit()
    pc = pcs[0]
    print(character_schema.dump(pc))
