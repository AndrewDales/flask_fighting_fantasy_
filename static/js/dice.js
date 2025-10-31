/* dice.js */

export class DiceControl {
    constructor(parent_el, dice_scale=1) {
        this.face_rotations = [
          { ry: 0,   rx: 0  }, // 1
          { ry: 90,  rx: 0  }, // 2
          { ry: 0,   rx: 90 }, // 3
          { ry: 0,   rx:-90 } , // 4
          { ry: -90, rx: 0  }, // 5
          { ry: 180, rx: 0  }  // 6
        ];

        const faces = parent_el.querySelectorAll(".face")
        const die1 = parent_el.querySelector(".die")
        const tray = parent_el.querySelector(".tray")

        gsap.set(faces, {
            position:'absolute',
            userSelect:'none',
            width: '100%',
            height: '100%',
            rotateY: (i) => this.face_rotations[i].ry,
            rotateX: (i) => this.face_rotations[i].rx,
            transformOrigin: "50% 50% -150px",
            z: 150,
            background:(i)=>'url(./static/images/dieSprite.svg) 0px -'+String(i*300)+'px',
        });

        const die2 = die1.cloneNode(true);
        tray.append(die2);

        const dice = parent_el.querySelectorAll(".die")


        this.cubes = parent_el.querySelectorAll(".cube")

        gsap.set(tray, {
            transform: `scale(${dice_scale})`,
            transformOrigin: 'top left',
            width: 'fit-content',
        })
        gsap.set(dice, {attr:{class:(i)=>'die die'+(i+1)},
            margin: 50,
            width:300, height:300,
            perspective:999,
        });
        gsap.set(this.cubes, {position:'absolute',
            width:300, height:300,
            transformStyle: 'preserve-3d',
            z:-600,
            // transform: 'rotateX(45deg) rotateY(45deg)',
            });
        // this.roll([3, 4])
    }

    roll(val=[1, 1]) {

        gsap.timeline()
        .fromTo(this.cubes, {
          z:-600
        },{
          duration:0.75,
          z:-300,
          ease:'expo',
          yoyoEase:'bounce.out(5)',
          repeat:1
        }, 0)

        .fromTo(this.cubes, {
            //this ensures that even if the new number is the same, it will do some rotation - first cube is rotated in one
            // direction, 2nd cube is rotated in the other.
            rotationX:(i)=>i===0?'-=360':'+=360',
            rotationY:(i)=>i===0?'-=360':'+=360'
        },{
            duration:1.5,
            ease:'back',
            rotationX:(i)=>-this.face_rotations[val[i]-1].rx,
            rotationY:(i)=>-this.face_rotations[val[i]-1].ry
        }, 0)

    }
}