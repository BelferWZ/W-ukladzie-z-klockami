class Segment {
    constructor(pos, dim, iJ, kartPos, index) {
        this.pos = pos;
        this.dim = dim;
        this.kartPos = kartPos;
        this.index = index;
        this.iJ = iJ;
        this.fill = color('#C0C0C0');
        this.stroke = color(255, 255, 255, 125);
    }

    display() {
        push();
        translate(this.pos.x, this.pos.y);
        fill(this.fill);
        stroke(this.stroke);

        let r = 2;
        if (this.index) r = 10;

        rect(0, 0, this.dim.w, this.dim.h, r)

        if (this.index) {

            let txt = this.iJ.i

            if (this.iJ.i == 0 || this.iJ.i == 11) {
                txt = projectData.litery[this.iJ.j - 1];
            }

            textSize(15);
            fill(255);
            stroke(255);
            textAlign(CENTER, CENTER)
            strokeWeight(0);
            text(txt, 2, 2, this.dim.w, this.dim.h);
        } else {
            textSize(15);
            fill(0);
            stroke(255);
            textAlign(CENTER, CENTER)
            strokeWeight(0);
            text(this.iJ.i * this.iJ.j, 2, 2, this.dim.w, this.dim.h);
        }

        pop();
    }

    checkPointing() {
        if (mouseX > this.pos.x && mouseX < this.pos.x + this.dim.w &&
            mouseY > this.pos.y && mouseY < this.pos.y + this.dim.w) {
            return true;
        } else {
            return false;
        }
    }

    setColor() {
        this.fill = projectData.picekedColor;

        if (!this.index && projectData.symetry) {
            for (let s of projectData.segments) {
                if (s.kartPos) {
                    let sx = s.kartPos.x;
                    let sy = s.kartPos.y;

                    if (projectData.symX < 0 && projectData.symY > 0) {
                        //Symetria X:
                        if (sx == projectData.symY * (this.kartPos.x) && sy == projectData.symX * (this.kartPos.y - 1)) {
                            s.fill = projectData.picekedColor;
                            break;
                        }
                    }

                    if (projectData.symY < 0 && projectData.symX > 0) {
                        // Symetria Y:
                        if (sx == projectData.symY * (this.kartPos.x + 1) && sy == projectData.symX * (this.kartPos.y)) {
                            s.fill = projectData.picekedColor;
                            break;
                        }
                    }

                    if (projectData.symX < 0 && projectData.symY < 0) {
                        // Symetria WŚ:
                        if (sx == projectData.symY * (this.kartPos.x + 1) && sy == projectData.symX * (this.kartPos.y - 1)) {
                            s.fill = projectData.picekedColor;
                            break;
                        }
                    }

                }
            }
        }
    }
}

class Gui {

    createModal() {
        let modal = createDiv();
        select('body').child(modal);
        modal.addClass('modal');
        modal.id('modal1');

        modal.html('<div class="modal-content"><span class="close" id="closeBtn">&times;</span><h1>Opcje:</h1></div>');

        select('#closeBtn').mouseClicked(() => {
            select('#modal1').style('display', "none");
        });

        return this;
    }

    generateOption(destination, dataStorage, spacerName, inputType, inputName, fxn, atr) {
        let spacer, input;

        if (!projectData.hasOwnProperty(dataStorage)) {
            projectData[`${dataStorage}`] = [];
        }

        if (spacerName) {
            spacer = createDiv(spacerName);
            spacer.addClass('spacer');
            select(destination).child(spacer);
        }

        if (inputType == 'checkbox') {

            input = createCheckbox(inputName, false);
            if (fxn) {
                input.changed(fxn);
            }

            if (atr) {
                input.attribute('onchange', atr)
            }

        } else {
            input = createButton(inputName);
            input.mouseClicked(fxn);
        }

        projectData[dataStorage].push(input);
        select(destination).child(input);
    }

    createModalSection(name) {
        let section = createDiv();
        section.addClass('modalContentSection');
        section.id(name);
        select(".modal-content").child(section);

        return `#${name}`;
    }

    createOptions() {
        this.generateOption(".o1", "axles", "Osie układu:", 'checkbox', "Osie", this.axFlip);
        this.generateOption(".o1", 'symCh', "Symetria:", 'checkbox', "Symetria - oś X", this.symetry, 'projectData.symX *= -1');
        this.generateOption(".o1", "symCh", undefined, 'checkbox', "Symetria - oś Y", this.symetry, 'projectData.symY *= -1');
        this.generateOption(".o1", "dropBtn", "Opcje:", 'button', "Pokaż opcje", function () {
            select('#modal1').style('display', 'block');
        });

        this.generateOption(this.createModalSection('reset'), "resetBtn", "Reset planszy:", 'button', "Reset", this.reset);
        this.generateOption(this.createModalSection('saveImg'), "saveImgBtn", "Zapis planszy do zdjęcia:", 'button', "Zapisz", this.saveImg);

        return this;
    }

    saveImg() {

        if (projectData.saveImgCounter > 0) {
            saveCanvas(`mata${projectData.saveImgCounter}`, 'png');
        } else {
            saveCanvas(`mata`, 'png');
        }

    }

    createPalette() {

        projectData['palette'] = [];

        for (let col of projectData.colors) {

            let div = createDiv();

            if (col == '#C0C0C0') {
                div.html('G');
            }
            div.addClass('paletteBtn');
            div.style('background-color', col);
            div.attribute("onclick", `pick('${col}')`);
            select(".palette").child(div);
            projectData.palette.push(div);
        }

        return this;
    }

    createBox() {
        let s = projectData.size * (projectData.segN + 2) + 11 * projectData.spacer + 6;
        projectData['canva'] = createCanvas(s, s);
        select(".box").child(projectData.canva);

        return this;
    }

    createBoard() {
        projectData['segments'] = [];

        for (let j = 0; j < projectData.segN + 2; j++) {
            for (let i = 0; i < projectData.segN + 2; i++) {

                let pos = {
                    x: j * projectData.size + projectData.spacer * j + 2,
                    y: i * projectData.size + projectData.spacer * i + 2
                }

                let dim = {
                    w: projectData.size,
                    h: projectData.size
                }

                let iJ = {
                    i: i,
                    j: j
                }

                let kartPos = {
                    x: j - (projectData.segN + 2) / 2,
                    y: -i + (projectData.segN + 2) / 2
                }

                if (((j == 0 || j == projectData.segN + 1) && i > 0 && i < projectData.segN + 1) ||
                    ((i == 0 || i == projectData.segN + 1) && j > 0 && j < projectData.segN + 1)) {
                    let s = new Segment(pos, dim, iJ, undefined, true);
                    s.fill = '#F64C72';
                    s.stroke = 'pink';
                    projectData.segments.push(s);
                } else if (j != 0 && j != projectData.segN + 1) {
                    projectData.segments.push(new Segment(pos, dim, iJ, kartPos, false));
                }
            }
        }

        return this;
    }

    axFlip() {
        projectData.axis = this.checked();
    }

    symetry() {
        if (projectData.symCh[0].checked() || projectData.symCh[1].checked()) {
            projectData.symetry = true;
        } else {
            projectData.symetry = false;
        }
    }

    reset() {
        for (let s of projectData.segments) {
            if (!s.index) {
                s.fill = projectData.colors[projectData.colors.length - 1];
            } else {
                s.fill = '#F64C72';
            }
        }
    }

    // colorindex() {
    //     let ind = 0;
    //     for (let j = 0; j < projectData.segN + 2; j++) {
    //         for (let i = 0; i < projectData.segN + 2; i++) {
    //             if (projectData.segments[ind].index) {

    //                 if ((j == 0 || j == projectData.segN + 1) && i > 0 && i < projectData.segN + 1) {
    //                     projectData.segments[ind].fill = projectData.colors[j];
    //                 }
    //                 if ((i == 0 || i == projectData.segN + 1) && j > 0 && j < projectData.segN + 1) {
    //                     projectData.segments[ind].fill = projectData.colors[i];
    //                 }
    //             }
    //             ind++;
    //         }
    //     }
    // }

}

const projectData = {
    size: 40,
    segN: 10,
    colors: ['green', 'deepskyblue', 'purple', 'khaki', 'red', 'greenyellow', 'black', 'white', 'saddlebrown', 'darkorange', '#C0C0C0'],
    litery: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'],
    spacer: 7,
    picekedColor: '#C0C0C0',
    axis: false,
    symetry: false,
    symCh: [],
    symX: 1,
    symY: 1,
    saveImgCounter: 0
}

function pick(color) {
    projectData.picekedColor = color;
}

function setup() {
    projectData['gui'] = new Gui();
    projectData.gui.createPalette().createBox().createBoard().createModal().createOptions();
}

function draw() {
    background(color('#553D67'));

    if (projectData.segments) {
        for (let s of projectData.segments) {
            s.display();
        }
    }

    if (projectData.axis) {
        push();
        translate(-1 / 2, -1 / 2);
        stroke('yellow');
        strokeWeight(3);
        line(0, height / 2, width, height / 2);
        line(width / 2, 0, width / 2, height);
        pop();
    }
}

function mouseClicked() {
    for (s of projectData.segments) {
        if (s.checkPointing() && !s.index) {
            s.setColor();
        }
    }
}