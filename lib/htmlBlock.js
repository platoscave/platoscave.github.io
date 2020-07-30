//"use strict";

import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.117.1/build/three.module.js";

export default class HtmlBlock {


    constructor(text, fonts, style) {

        this.fonts = fonts
        this.width = style['width'] ? style['width'] : 0
        this.height = style['height'] ? style['height'] : 0
        this.marginLeft = style['margin-left'] ? style['margin-left'] : 0
        this.marginRight = style['margin-right'] ? style['margin-right'] : 0
        this.marginTop = style['margin-top'] ? style['margin-top'] : 0
        this.marginBottom = style['margin-bottom'] ? style['margin-bottom'] : 0
        this.paddingLeft = style['padding-left'] ? style['padding-left'] : 0
        this.paddingRight = style['padding-right'] ? style['padding-right'] : 0
        this.paddingTop = style['padding-top'] ? style['padding-top'] : 0
        this.paddingBottom = style['padding-bottom'] ? style['padding-bottom'] : 0
        this.listStyleType = style['list-style-type'] ? style['list-style-type'] : ''
        this.textAlign = style['text-align'] ? style['text-align'] : ''

        this.textBlocksArr = []

    }

    addTextToBlock(text, style) {

        const fontSize = style['font-size'] ? style['font-size'] : 10
        const preFormated = style['white-space'] === 'pre'
        const spaceWidth = fontSize * 0.635
        const punctSpaceWidth = fontSize * 0.2

        let font = this.fonts.regularFont
        if (style['font-weight'] === 'bold') font = this.fonts.boldFont
        if (style['font-family'] === 'monospace') font = this.fonts.monoFont

        if (!preFormated) {
            const wordsArr = text.split(/\s+/g);
            wordsArr.forEach(word => {

                let shape = font.generateShapes(word, fontSize);
                let geometry = new THREE.ShapeGeometry(shape);
                geometry.computeBoundingBox();
                geometry.name = word
                // make an exception for punctuation marks
                const spaceBeforeWidth = !!text.match(/^[.,:!?]/) ? punctSpaceWidth : spaceWidth

                this.textBlocksArr.push({
                    ascender: geometry.boundingBox.max.y,
                    text: word,
                    style: style,
                    geometry: geometry,
                    width: geometry.boundingBox.max.x,
                    height: geometry.boundingBox.max.y - geometry.boundingBox.min.y,
                    spaceBeforeWidth: spaceBeforeWidth,
                    pos: { x: 0, y: 0 }
                })
            })

        }
        else { // preFormated
            let shape = font.generateShapes(text, fontSize);
            //console.log('font',font)
            let geometry = new THREE.ShapeGeometry(shape);
            geometry.computeBoundingBox();
            geometry.name = text
            this.textBlocksArr.push({
                ascender: geometry.boundingBox.max.y,
                text: text,
                style: style,
                geometry: geometry,
                width: geometry.boundingBox.max.x,
                height: geometry.boundingBox.max.y - geometry.boundingBox.min.y, //font.data.lineHeight / 11.6
                spaceBeforeWidth: spaceWidth,
                pos: { x: 0, y: 0 }
            })
        }
    }


    applyWordWrap() {
        //const fontSize = style['font-size'] ? style['font-size'] : 10
        const fontSize = 10
        const lineSpacing = fontSize * 0.2

        const maxTextWidth = this.width - this.paddingLeft - this.paddingRight - this.marginLeft - this.marginRight
        const lineStartX = this.paddingLeft + this.paddingRight
        let lineTopLeft = -this.paddingTop - this.marginTop
        let lineHeight = 0
        let lineLengthUntilNow = lineStartX


        let linesArr = []
        let currentLine = []

        // the first word on a line has no space before
        this.textBlocksArr[0].spaceBeforeWidth = 0

        // Fill lines until we reach maxTextWidth
        this.textBlocksArr.forEach((wordDesc, index) => {

            lineLengthUntilNow += wordDesc.spaceBeforeWidth
            wordDesc.pos.x = lineLengthUntilNow
            currentLine.push(wordDesc) // add word to current line

            // determin starting X for next word
            lineLengthUntilNow += wordDesc.width

            // if the next word wont fix, create a new line
            if (index + 1 < this.textBlocksArr.length) { // we still have a next word
                let nextWordDesc = this.textBlocksArr[index + 1]
                let testLineLength = lineLengthUntilNow + nextWordDesc.width
                if (testLineLength > maxTextWidth) {
                    // add current line
                    linesArr.push(currentLine)
                    // create new line
                    currentLine = []
                    lineLengthUntilNow = lineStartX
                    // the first word on a line has no space before
                    nextWordDesc.spaceBeforeWidth = 0
                }
            }
        })
        if (currentLine.length) linesArr.push(currentLine)


        // Set the Y position of each word
        linesArr.forEach(line => {
            let lineHeight = 0, ascender = 0
            // Find the greatest lineHeight and ascender for this line
            line.forEach(wordDesc => {
                lineHeight = Math.max(lineHeight, wordDesc.height + lineSpacing * 2)
                ascender = Math.max(ascender, wordDesc.ascender + lineSpacing)
            })
            // Set the pos.y
            line.forEach(wordDesc => {
                wordDesc.pos.y = lineTopLeft - ascender
            })
            // Next line
            lineTopLeft -= lineHeight
        })


        // If justify, distibute available space evenly
        if (this.textAlign === 'justify') {
            linesArr.forEach((line, index) => {
                // skip the last line
                if (index === linesArr.length - 1) return
                // find the min width for this line
                let minWidth = 0
                line.forEach(wordDesc => {
                    minWidth += wordDesc.width
                    if(!!wordDesc.text.match(/^[.,:!?]/)) minWidth += wordDesc.spaceBeforeWidth
                })
                // determin space to distribute
                const space = (maxTextWidth - minWidth) / line.length
                lineLengthUntilNow = lineStartX

                line.forEach((wordDesc, index) => {
                    if (index === 0) return // skip the first word
                    if(!!wordDesc.text.match(/^[.,:!?]/)) return // skip punctuation marks
                    wordDesc.spaceBeforeWidth = space
                })

                // set pos.x
                line.forEach(wordDesc => {
                    lineLengthUntilNow += wordDesc.spaceBeforeWidth
                    wordDesc.pos.x = lineLengthUntilNow
                    lineLengthUntilNow += wordDesc.width
                })
            })
        }

        // If center, indent by available space  / 2
        if (this.textAlign === 'center') {
            linesArr.forEach(line => {
                // find the min width for this line
                let minWidth = 0
                line.forEach((wordDesc, index) => {
                    minWidth += wordDesc.width
                    // last word doesnot get a space after
                    if (index !== line.length - 1) minWidth += wordDesc.spaceBeforeWidth
                })
                // determin space to distribute
                lineLengthUntilNow = lineStartX + (maxTextWidth - minWidth) / 2
                // set pos.x
                line.forEach(wordDesc => {
                    lineLengthUntilNow += wordDesc.spaceBeforeWidth
                    wordDesc.pos.x = lineLengthUntilNow
                    lineLengthUntilNow += wordDesc.width
                })
            })
        }

        //console.log('linesArr', linesArr)

        this.height = this.paddingBottom + this.marginBottom - lineTopLeft + lineHeight
    }


    printBlock(object3d, sizeVec, orderedListNum) {
        const blockX = this.blockX - sizeVec.x / 2, blockY = this.blockY + sizeVec.y / 2

        /* var geometry = new THREE.PlaneGeometry( this.width, this.height, 32 );
        geometry.translate(this.width/2 + blockX, -this.height/2 + blockY, -1)
        let color = Math.random() * 16777215
        var material = new THREE.MeshBasicMaterial( {color: color} );
        var plane = new THREE.Mesh( geometry, material );
        object3d.add(plane) */

        this.textBlocksArr.forEach((wordDesc, wordNum) => {

            const style = wordDesc.style
            const wordX = blockX + wordDesc.pos.x
            const wordY = blockY + wordDesc.pos.y
            //console.log('wordY', wordDesc.pos.y, wordDesc.text)


            const wordWidth = wordDesc.width
            const textGeometry = wordDesc.geometry
            const color = style.color ? style.color : 0x404040
            const textMaterial = new THREE.MeshBasicMaterial({
                color: color,
                side: THREE.DoubleSide
            })


            let fontSize = style['font-size'] ? style['font-size'] : 10

            // italic: skew the textGeometry
            if (style['font-style'] === 'italic') {
                var Syx = 0.3, Szx = 0, Sxy = 0, Szy = 0, Sxz = 0, Syz = 0;
                var matrix = new THREE.Matrix4();
                matrix.set(1, Syx, Szx, 0,
                    Sxy, 1, Szy, 0,
                    Sxz, Syz, 1, 0,
                    0, 0, 0, 1);
                // apply shear matrix to textGeometry                  
                textGeometry.applyMatrix4(matrix);
            }

            textGeometry.translate(wordX, wordY, 0)
            let mesh = new THREE.Mesh(textGeometry, textMaterial)
            mesh.updateMatrix();
            object3d.add(mesh)


            // Add bullet or number if we have a list style type
            if (wordNum === 0 && this.listStyleType) {
                let geometry
                if (this.listStyleType === 'disc') {
                    geometry = new THREE.CircleGeometry(3, 32);
                    geometry.translate(wordX - 20, wordY + 5, 0)
                }
                else {
                    let font = this.fonts.regularFont
                    if (style['font-weight'] === 'bold') font = this.fonts.boldFont
                    if (style['font-family'] === 'monospace') font = this.fonts.monoFont

                    let shape = font.generateShapes(orderedListNum + '.', fontSize);
                    geometry = new THREE.ShapeGeometry(shape);
                    geometry.translate(wordX - 25, wordY, 0)
                }
                let mesh = new THREE.Mesh(geometry, textMaterial)
                mesh.updateMatrix();
                object3d.add(mesh)

                orderedListNum++
            }

            // underline
            if (style['text-decoration'] === 'underline') {
                let geometry = new THREE.PlaneGeometry(wordWidth, 2, 2);
                geometry.translate(wordX + wordWidth / 2, wordY + -2, 1)
                let mesh = new THREE.Mesh(geometry, textMaterial);
                object3d.add(mesh)
            }

            // strike through
            if (style['text-decoration'] === 'line-through') {
                let geometry = new THREE.PlaneGeometry(wordWidth, 2, 2);
                geometry.translate(wordX + wordWidth / 2, wordY + fontSize * 0.4, 1)
                let mesh = new THREE.Mesh(geometry, textMaterial);
                object3d.add(mesh)
            }

            // background color
            if (style['background-color']) {
                textGeometry.computeBoundingBox();
                let height = textGeometry.boundingBox.max.y - textGeometry.boundingBox.min.y;
                let textMaterial = new THREE.MeshBasicMaterial({
                    color: style['background-color'],
                    side: THREE.DoubleSide
                })
                let shape = this.getRoundedRectShape(wordWidth + 3, height + 3, 2)
                let geometry = new THREE.ShapeGeometry(shape);
                geometry.translate(wordX + wordWidth / 2, wordY + 4, -1)
                let mesh = new THREE.Mesh(geometry, textMaterial);
                object3d.add(mesh)
            }

        })


    }
    getRoundedRectShape(width, height, radius) {
        const x = -width / 2
        const y = -height / 2

        let ctx = new THREE.Shape()

        ctx.moveTo(x, y + radius) // bottom left
        ctx.lineTo(x, y + height - radius) // to top left
        ctx.quadraticCurveTo(x, y + height, x + radius, y + height)
        ctx.lineTo(x + width - radius, y + height) // to top right
        ctx.quadraticCurveTo(x + width, y + height, x + width, y + height - radius)
        ctx.lineTo(x + width, y + radius) // to bottom right
        ctx.quadraticCurveTo(x + width, y, x + width - radius, y)
        ctx.lineTo(x + radius, y) // to bottom left
        ctx.quadraticCurveTo(x, y, x, y + radius)

        return ctx
    }
}
