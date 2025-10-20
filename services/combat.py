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
            result = "draw"
            self.attacker.stamina -= 1
            self.defender.stamina -= 1

        return {"message":
                    f"Combat round occurred between Character {self.attacker.id} and Character {self.defender.id}",
                "result": result,
                "rolls": rolls,
                "scores": scores,
                }
