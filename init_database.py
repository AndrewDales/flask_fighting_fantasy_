from config import app, db
from models import PlayerCharacter, NonPlayerCharacter
# from sqlalchemy.exc import OperationalError


MONSTERS = [
    {
        "name": "Dragon",
        "skill": 10,
        "stamina": 18,
        "max_stamina": 18,
    },
    {
        "name": "Orc",
        "skill": 8,
        "stamina": 16,
        "max_stamina": 16,
    },
    {
        "name": "Warlord",
        "skill": 9,
        "stamina": 20,
        "max_stamina": 20,
    },
]

player_character_names = ['Knight', 'Wizard', 'Barbarian']

if __name__ == "__main__":
    with app.app_context():
        db.drop_all()
        db.create_all()
        for data in MONSTERS:
            new_character = NonPlayerCharacter(**data)
            db.session.add(new_character)
        for name in player_character_names:
            player = PlayerCharacter.generate_player(name)
            db.session.add(player)
        db.session.commit()
