# models.py

from datetime import datetime, UTC
import random
from typing import Optional
from sqlalchemy.orm import Mapped, mapped_column
from marshmallow_sqlalchemy import fields, auto_field

from config import db, ma


class Character(db.Model):
    __tablename__ = "character"
    id: Mapped[int] = mapped_column(primary_key=True)
    name: Mapped[str]
    skill: Mapped[int] = mapped_column(default=0)
    stamina: Mapped[int] = mapped_column(default=0)
    max_stamina: Mapped[int] = mapped_column(default=0)
    type: Mapped[str] = mapped_column(default="non_player_character")
    # Use callables for defaults so a new timestamp is generated for each new row
    timestamp: Mapped[datetime] = mapped_column(
        default=lambda: datetime.now(UTC), onupdate=lambda: datetime.now(UTC)
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
    luck: Mapped[Optional[int]] = mapped_column(nullable=True)
    max_luck: Mapped[Optional[int]] = mapped_column(nullable=True)

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