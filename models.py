# models.py

from datetime import datetime, UTC
import random
from marshmallow_sqlalchemy import fields, auto_field

from config import db, ma


class Character(db.Model):
    __tablename__ = "character"
    id: db.Mapped[int] = db.mapped_column(primary_key=True)
    name: db.Mapped[str]
    skill: db.Mapped[int] = db.mapped_column(db.Integer, default=0)
    stamina: db.Mapped[int] = db.mapped_column(db.Integer, default=0)
    max_stamina: db.Mapped[int] = db.mapped_column(db.Integer, default=0)
    type: db.Mapped[str] = db.mapped_column(db.String, default="non_player_character")
    timestamp: db.Mapped[datetime] = db.mapped_column(
        db.DateTime, default=datetime.now(UTC), onupdate=datetime.now(UTC)
    )

    __mapper_args__ = {
        "polymorphic_on": "type",
        "polymorphic_identity": "character"
    }

    @staticmethod
    def dice_roll(num_dice):
        return sum(random.randint(1,6) for _ in range(num_dice))

    def __repr__(self):
        return f"Character(name='{self.name}', skill='{self.skill}', stamina='{self.stamina}')"


class PlayerCharacter(Character):
    luck: db.Mapped[int] = db.mapped_column(nullable=True)
    max_luck: db.Mapped[int] = db.mapped_column(nullable=True)

    __mapper_args__ = {
        "polymorphic_identity": "player_character"
    }

    @classmethod
    def generate_player(cls, name):
        skill = 6 + random.randint(1, 6)
        stamina = 12 + random.randint(1, 6) + random.randint(1, 6)
        luck = 6 + random.randint(1, 6)
        characteristics = {
            'name': name,
            'skill': skill,
            'stamina': stamina,
            'luck': luck,
            'max_stamina': stamina,
            'max_luck': luck
        }
        return cls(**characteristics)

    def __repr__(self):
        return f"PlayerCharacter(name='{self.name}', skill={self.skill}, stamina={self.stamina}, luck={self.luck})"


class NonPlayerCharacter(Character):

    __mapper_args__ = {
        "polymorphic_identity": "non_player_character"
    }

    def __repr__(self):
        return f"NPC(name='{self.name}', skill='{self.skill}', stamina='{self.stamina}')"


class CharacterSchema(ma.SQLAlchemyAutoSchema):
    class Meta:
        model = Character
        load_instance = True
        sqla_session = db.session
        include_relationships = True

class NPCSchema(ma.SQLAlchemyAutoSchema):
    class Meta:
        model = NonPlayerCharacter
        load_instance = True
        sqla_session = db.session
        include_relationships = True

class PCSchema(ma.SQLAlchemyAutoSchema):
    class Meta:
        model = PlayerCharacter
        load_instance = True
        sqla_session = db.session
        include_relationships = True

pc_schema = PCSchema()
pcs_schema = PCSchema(many=True)
npc_schema = NPCSchema()
npcs_schema = NPCSchema(many=True)
character_schema = CharacterSchema()
characters_schema = CharacterSchema(many=True)