# services/combat

import models as m

class Fight:
    def __init__(self, attacker: m.Character, defender: m.Character):
        self.attacker = attacker
        self.defender = defender

    def fight_round(self):
        """ simulate one round of combat between two characters"""
        rolls = {"attacker": self.attacker.dice_roll(2),
                 "defender": self.defender.dice_roll(2),
                 }

        scores = {"attacker": self.attacker.skill + rolls['attacker'],
                  "defender": self.defender.skill + rolls['defender'],
                  }

        if scores["attacker"] > scores["defender"]:
            result = "won"
            self.defender.stamina -= 2
        elif scores["defender"] > scores["attacker"]:
            result = "lost"
            self.attacker.stamina -= 2
        else:
            result = "drew"
            self.attacker.stamina -= 1
            self.defender.stamina -= 1

        return {"attacker_id": self.attacker.id,
                "defender_id": self.defender.id,
                "attacker_name": self.attacker.name,
                "defender_name": self.defender.name,
                "message":
                    f"Combat round occurred between {self.attacker.name} and {self.defender.name}",
                "result": result,
                "rolls": rolls,
                "scores": scores,
                }
