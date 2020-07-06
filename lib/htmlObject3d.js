//"use strict";

import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.117.1/build/three.module.js";

export default class HtmlObject3D extends THREE.Object3D {


    constructor(htmlDoc, fonts, style, background) {

        super()

        this.regularFont = fonts.regularFont
        this.boldFont = fonts.boldFont
        this.monoFont = fonts.monoFont

        const defaultStyle = {
            'color': 0x808080,
            'font-size': 10,
            'width': 300
        }
        let mergedStyle = Object.assign({}, defaultStyle, style);


        let blocksArray = this.walkTheDom(htmlDoc.body, mergedStyle)

        blocksArray.forEach(block => {
            this.makeLinesFormWords(block, mergedStyle.width - 40)
        })
        console.log('blocksArray ', blocksArray)

        let height = - this.printBlocks(blocksArray) // returns lineY
        console.log('htmlGeom ', this)

        this.position.set(- mergedStyle.width / 2, height / 2, 0)

        if (background.backgroundColor) this.addBackground(mergedStyle.width, height, defaultStyle['font-size'] / 2, background)

    }

    walkTheDom(htmlDoc, defaultStyle) {
        let blocksArray = []
        const em = defaultStyle['font-size']

        const processChildNodes = (parentNode, parentStyle) => {

            parentNode.childNodes.forEach(node => {

                if (node.nodeType === 1) { // Is it an Element node?

                    let elementStyle = {}, attrStyle = {}

                    if (node.attributes) {
                        let style = node.attributes.getNamedItem('style')
                        if (style) {
                            let styleAttrsArr = style.value.split(';')
                            styleAttrsArr.forEach(attrSet => {
                                let attrSetArr = attrSet.split(':')
                                let name = attrSetArr[0].trim()
                                let value = attrSetArr[1] ? attrSetArr[1].trim() : ''
                                if (name && value) attrStyle[name] = value
                            })
                        }
                    }

                    switch (node.nodeName) {
                        case 'A':
                            elementStyle = {
                                'color': 'blue',
                                'text-decoration': 'underline',
                                'cursor': 'auto'
                            }
                            break;

                        case 'B':
                            elementStyle = {
                                'font-weight': 'bold'
                            }
                            break;

                        case 'BR':
                            break;

                        case 'CODE':
                            elementStyle = {
                                'font-family': 'monospace'
                            }
                            break;

                        case 'COL':
                            elementStyle = {
                                'display': 'table-column'
                            }
                            break;

                        case 'COLGROUP':
                            elementStyle = {
                                'display': 'table-column-group'
                            }
                            break;

                        case 'DEL':
                            elementStyle = {
                                'text-decoration': 'line-through'
                            }
                            break;

                        case 'DIV':
                            elementStyle = {
                                'display': 'block'
                            }
                            break;

                        case 'EM':
                            elementStyle = {
                                'font-style': 'italic'
                            }
                            break;

                        case 'STRONG':
                            elementStyle = {
                                'font-weight': 'bold'
                            }
                            break;

                        case 'H1':
                            elementStyle = {
                                'display': 'block',
                                'font-size': 2 * em,
                                'margin-top': 0.67 * em,
                                'margin-bottom': 0.67 * em,
                                'margin-left': 0,
                                'margin-right': 0,
                                'font-weight': 'bold'
                            }
                            break;

                        case 'H2':
                            elementStyle = {
                                'display': 'block',
                                'font-size': 1.5 * em,
                                'margin-top': 0.83 * em,
                                'margin-bottom': 0.83 * em,
                                'margin-left': 0,
                                'margin-right': 0,
                                'font-weight': 'bold'
                            }
                            break;

                        case 'H3':
                            elementStyle = {
                                'display': 'block',
                                'font-size': 1.17 * em,
                                'margin-top': 1 * em,
                                'margin-bottom': 1 * em,
                                'margin-left': 0,
                                'margin-right': 0,
                                'font-weight': 'bold'
                            }
                            break;

                        case 'H4':
                            elementStyle = {
                                'display': 'block',
                                'font-size': 1 * em,
                                'margin-top': 1.33 * em,
                                'margin-bottom': 1.33 * em,
                                'margin-left': 0,
                                'margin-right': 0,
                                'font-weight': 'bold'
                            }
                            break;

                        case 'H5':
                            elementStyle = {
                                'display': 'block',
                                'font-size': .83 * em,
                                'margin-top': 1.67 * em,
                                'margin-bottom': 1.67 * em,
                                'margin-left': 0,
                                'margin-right': 0,
                                'font-weight': 'bold'
                            }
                            break;

                        case 'H6':
                            elementStyle = {
                                'display': 'block',
                                'font-size': .67 * em,
                                'margin-top': 2.33 * em,
                                'margin-bottom': 2.33 * em,
                                'margin-left': 0,
                                'margin-right': 0,
                                'font-weight': 'bold'
                            }
                            break;

                        case 'HR':
                            elementStyle = {
                                'display': 'block',
                                'margin-top': 0.5 * em,
                                'margin-bottom': 0.5 * em,
                                'margin-left': 'auto',
                                'margin-right': 'auto',
                                'border-style': 'inset',
                                'border-width': 1
                            }
                            break;

                        case 'I':
                            elementStyle = {
                                'font-style': 'italic'
                            }
                            break;

                        case 'IMG':
                            elementStyle = {
                                'display': 'inline-block'
                            }
                            break;

                        case 'INPUT':
                            break;

                        case 'LABEL':
                            elementStyle = {
                                'cursor': 'default'
                            }
                            break;

                        case 'LI':
                            elementStyle = {
                                'display': 'list-item'
                            }
                            break;

                        case 'OL':
                            elementStyle = {
                                'display': 'block',
                                'list-style-type': 'decimal',
                                //'margin-top': 1 * em,
                                //'margin-bottom': 1 * em,
                                'margin-left': 0,
                                'margin-right': 0,
                                'padding-left': 40,
                            }
                            break;

                        case 'P':
                            elementStyle = {
                                'display': 'block',
                                'margin-top': 1 * em,
                                'margin-bottom': 1 * em,
                                'margin-left': 0,
                                'margin-right': 0,
                            }
                            break;

                        case 'PRE':
                            elementStyle = {
                                //'display': 'block', // how do do block in block
                                'font-family': 'monospace',
                                'white-space': 'pre',
                                'margin': 1 * em,
                            }
                            break;

                        case 'SPAN':
                            break;

                        case 'STRONG':
                            elementStyle = {
                                'font-weight': 'bold'
                            }
                            break;

                        case 'TABLE':
                            elementStyle = {
                                'display': 'table',
                                'border-collapse': 'separate',
                                'border-spacing': 2,
                                'border-color': 'gray'
                            }
                            break;

                        case 'TBODY':
                            elementStyle = {
                                'display': 'table-row-group',
                                'vertical-align': 'middle',
                                'border-color': 'inherit'
                            }
                            break;

                        case 'TD':
                            elementStyle = {
                                'display': 'table-cell',
                                'vertical-align': 'inherit'
                            }
                            break;

                        case 'TH':
                            elementStyle = {
                                'display': 'table-cell',
                                'vertical-align': 'inherit',
                                'font-weight': 'bold',
                                'text-align': 'center'
                            }
                            break;

                        case 'TR':
                            elementStyle = {
                                'display': 'table-row',
                                'vertical-align': 'inherit',
                                'border-color': 'inherit'
                            }
                            break;

                        case 'U':
                            elementStyle = {
                                'text-decoration': 'underline'
                            }
                            break;

                        case 'UL':
                            elementStyle = {
                                'display': 'block',
                                'list-style-type': 'disc',
                                //'margin-top': 1 * em,
                                //'margin-bottom': 1 * em,
                                'margin-left': 0,
                                'margin-right': 0,
                                'padding-left': 40
                            }
                            break;

                        default:
                            console.log('Element ' + node.nodeName + ' not implemeted yet')
                            break;
                    }

                    let mergedStyle = Object.assign({}, parentStyle, elementStyle, attrStyle);

                    let newLineEls = ['block', 'list-item', 'table', 'table-row']
                    if (newLineEls.includes(elementStyle.display)) {
                        let blockDesc = {
                            tag: node.nodeName,
                            style: mergedStyle,
                            newLinesArr: [],
                            wordDescsArr: [],
                            height: 0,
                            width: 0
                        }
                        blocksArray.push(blockDesc)
                    }

                    processChildNodes(node, mergedStyle)

                }

                if (node.nodeType === 3) { // Is it a Text node?
                    var text = node.data.trim();
                    if (text.length > 0) { // Does it have non white-space text content?
                        // process text
                        // Get the last block. This block was created by an Element with display: 'block'
                        let blockNum = blocksArray.length - 1
                        let currentBlock = blocksArray[blockNum]
                        this.addWordsDescToBlock(text, parentStyle, currentBlock)
                    }
                }
            })
        }

        processChildNodes(htmlDoc, defaultStyle)

        return blocksArray
    }


    addWordsDescToBlock(text, style, block) {

        const fontSize = style['font-size'] ? style['font-size'] : 10
        const preFormated = style['white-space'] === 'pre'
        let font = this.regularFont
        if (style['font-weight'] === 'bold') font = this.boldFont
        if (style['font-family'] === 'monospace') font = this.monoFont

        const wordsArr = text.split(/\s+/g);
        wordsArr.forEach(word => {

            let shape = font.generateShapes(word, fontSize);
            let geometry = new THREE.ShapeGeometry(shape);
            geometry.computeBoundingBox();
            geometry.name = word

            let spaceBeforeWidth = fontSize * 0.635
            // make an exception for punctuation marks
            if (!!word.match(/^[.,:!?]/)) spaceBeforeWidth = 2

            block.wordDescsArr.push({
                text: word,
                style: style,
                geometry: geometry,
                width: geometry.boundingBox.max.x,
                height: geometry.boundingBox.max.y - geometry.boundingBox.min.y,
                spaceBeforeWidth: spaceBeforeWidth
            })
        })
    }

    makeLinesFormWords(block, maxWidth) {
        const blokStyle = block.style
        const paddingLeft = blokStyle['padding-left'] ? blokStyle['padding-left'] : 0
        const paddingRight = blokStyle['padding-right'] ? blokStyle['padding-roght'] : 0
        const width = maxWidth - paddingLeft - paddingRight
        block.blockX = paddingLeft

        let line = {
            wordsArr: [],
            lineHeight: 0
        }
        let lineWidthUntilNow = 0
        block.wordDescsArr.forEach((wordDesc, index) => {
            lineWidthUntilNow += wordDesc.spaceBeforeWidth + wordDesc.width
            // This word won't fit
            if (lineWidthUntilNow > width) {
                // add the line to the lines array
                block.newLinesArr.push(line)
                // create a new line to work with
                line = {
                    wordsArr: [],
                    lineHeight: 0
                }
                lineWidthUntilNow = wordDesc.width
            }
            // multiply by default line-height spacing
            line.lineHeight = wordDesc.height * 1.4 > line.lineHeight ? wordDesc.height * 1.4 : line.lineHeight
            line.wordsArr.push(wordDesc)
        })
        if (line.wordsArr.length) block.newLinesArr.push(line)
        block.width = width
        block.newLinesArr.forEach(line => {
            block.height += line.lineHeight
            line.wordsArr[0].spaceBeforeWidth = 0 // the first word of each line has no space before
        })
    }

    printBlocks(blocksArray) {
        let lineY = 0
        let orderedListNum = 0

        blocksArray.forEach((block) => {

            let blokStyle = block.style
            let marginTop = blokStyle['margin-top'] ? blokStyle['margin-top'] : 0
            let marginBottom = blokStyle['margin-bottom'] ? blokStyle['margin-bottom'] : 0
            let listStyleType = blokStyle['list-style-type'] ? blokStyle['list-style-type'] : ''
            if (block.tag === 'OL') orderedListNum = 1

            lineY -= marginTop

            block.newLinesArr.forEach((line, lineNum) => {

                //if (block.tag === 'P') debugger
                lineY -= line.lineHeight
                let wordX = block.blockX

                line.wordsArr.forEach((word, wordNum) => {

                    let style = word.style
                    let wordWidth = word.width
                    wordX += word.spaceBeforeWidth
                    let textGeometry = word.geometry

                    let color = style.color ? style.color : 0x404040
                    let textMaterial = new THREE.MeshBasicMaterial({
                        color: color,
                        side: THREE.DoubleSide
                    })


                    let fontSize = style['font-size'] ? style['font-size'] : 10

                    // skew the textGeometry if italic
                    if (style['font-style'] === 'italic') {
                        var Syx = 0.3, Szx = 0, Sxy = 0, Szy = 0, Sxz = 0, Syz = 0;
                        var matrix = new THREE.Matrix4();
                        matrix.set(1, Syx, Szx, 0,
                            Sxy, 1, Szy, 0,
                            Sxz, Syz, 1, 0,
                            0, 0, 0, 1);
                        // apply shear matrix to textGeometry                  
                        textGeometry.applyMatrix(matrix);
                    }

                    textGeometry.translate(wordX, lineY, 0)
                    let mesh = new THREE.Mesh(textGeometry, textMaterial)
                    mesh.updateMatrix();
                    this.add(mesh)

                    //this.mergeMeshes( [this, mesh] ) // cant get this to work

                    // Add bullet or number if we have a list style type
                    if (lineNum === 0 && wordNum === 0 && listStyleType) {
                        let geometry
                        if (listStyleType === 'disc') {
                            geometry = new THREE.CircleGeometry(3, 32);
                            geometry.translate(wordX - 20, lineY + 5, 0)
                        }
                        else {
                            let font = this.regularFont
                            if (style['font-weight'] === 'bold') font = this.boldFont
                            if (style['font-family'] === 'monospace') font = this.monoFont
                            let shape = font.generateShapes(orderedListNum + '.', fontSize);
                            geometry = new THREE.ShapeGeometry(shape);
                            geometry.translate(wordX - 25, lineY, 0)
                        }
                        let mesh = new THREE.Mesh(geometry, textMaterial)
                        mesh.updateMatrix();
                        this.add(mesh)

                        orderedListNum++
                    }

                    // underline
                    if (style['text-decoration'] === 'underline') {
                        let geometry = new THREE.PlaneGeometry(wordWidth, 2, 2);
                        geometry.translate(wordX + wordWidth / 2, lineY + -2, 1)
                        let mesh = new THREE.Mesh(geometry, textMaterial);
                        this.add(mesh)
                    }

                    // strike through
                    if (style['text-decoration'] === 'line-through') {
                        let geometry = new THREE.PlaneGeometry(wordWidth, 2, 2);
                        geometry.translate(wordX + wordWidth / 2, lineY + fontSize * 0.4, 1)
                        let mesh = new THREE.Mesh(geometry, textMaterial);
                        this.add(mesh)
                    }

                    // background color
                    if (style['background-color']) {
                        textGeometry.computeBoundingBox();
                        let height = textGeometry.boundingBox.max.y - textGeometry.boundingBox.min.y;
                        let textMaterial = new THREE.MeshBasicMaterial({
                            color: style['background-color'],
                            side: THREE.DoubleSide
                        })
                        let shape = this.getRoundedRectCalloutShape(wordWidth + 3, height + 3, 2)
                        let geometry = new THREE.ShapeGeometry(shape);
                        geometry.translate(wordX + wordWidth / 2, lineY + 4, -1)
                        let mesh = new THREE.Mesh(geometry, textMaterial);
                        this.add(mesh)
                    }

                    wordX += wordWidth
                })

            })
            lineY -= marginBottom
        })

        return lineY

    }

    addBackground(maxWidth, height, radians, background) {

        let roundedRectShape = this.getRoundedRectCalloutShape(maxWidth, height, radians, background.callout)
        let boundingBox

        if (background.backgroundColor) {

            let backgroundMat = new THREE.MeshBasicMaterial({
                color: background.backgroundColor,
                transparent: true,
                opacity: background.backgroundOpacity,
                side: THREE.DoubleSide
            });

            let geometry = new THREE.ShapeGeometry(roundedRectShape);
            geometry.translate(maxWidth / 2 - 20, - height / 2, -2)
            this.add(new THREE.Mesh(geometry, backgroundMat))
            geometry.computeBoundingBox();
            boundingBox = geometry.boundingBox
        }
        if (background.borderColor) {

            let borderMat = new THREE.MeshBasicMaterial({
                color: background.borderColor,
                transparent: true,
                opacity: background.backgroundOpacity,
                side: THREE.DoubleSide
            });

            var points = roundedRectShape.getPoints();
            var geometry = new THREE.BufferGeometry().setFromPoints(points);
            geometry.translate(maxWidth / 2 - 20, - height / 2, -2)
            this.add(new THREE.Line(geometry, borderMat))
            geometry.computeBoundingBox();
            boundingBox = geometry.boundingBox
        }

        // If there is a callout, center out obj3d arrounf the arrow point
        if (boundingBox) {
            if (background.callout === 'topLeft') this.position.set(-boundingBox.min.x, -boundingBox.max.y, 0)
            if (background.callout === 'topRight') this.position.set(-boundingBox.max.x, -boundingBox.max.y, 0)
            if (background.callout === 'bottomRight') this.position.set(-boundingBox.max.x, -boundingBox.min.y, 0)
            if (background.callout === 'bottomLeft') this.position.set(-boundingBox.min.x, -boundingBox.min.y, 0)
        }
    }




    mergeMeshes(meshes, toBufferGeometry) {
        // Cant get this to work, try again later
        //https://stackoverflow.com/questions/27217388/use-multiple-materials-for-merged-geometries-in-three-js

        var finalGeometry,
            materials = [],
            mergedGeometry = new THREE.Geometry(),
            mergeMaterial,
            mergedMesh;

        meshes.forEach(function (mesh, index) {
            mesh.updateMatrix();
            mesh.geometry.faces.forEach(function (face) { face.materialIndex = 0; });
            mergedGeometry.merge(mesh.geometry, mesh.matrix, index);
            materials.push(mesh.material);
        });

        mergedGeometry.groupsNeedUpdate = true;
        mergeMaterial = new THREE.MeshFaceMaterial(materials);

        if (toBufferGeometry) {
            finalGeometry = new THREE.BufferGeometry().fromGeometry(mergedGeometry);
        } else {
            finalGeometry = mergedGeometry;
        }

        mergedMesh = new THREE.Mesh(finalGeometry, mergeMaterial);
        mergedMesh.geometry.computeFaceNormals();
        mergedMesh.geometry.computeVertexNormals();

        return mergedMesh;

    }

    getRoundedRectCalloutShape(width, height, radius, callout) {
        const x = -width / 2
        const y = -height / 2
        const calloutWidth = width / 3 // the length of the callout point
        const calloutHeight = height / 2
        const calloutBaseLine = width / 3

        let ctx = new THREE.Shape()

        ctx.moveTo(x, y + radius) // bottom left
        ctx.lineTo(x, y + height - radius) // to top left
        ctx.quadraticCurveTo(x, y + height, x + radius, y + height)
        if (callout === 'topLeft') {
            ctx.lineTo(x - calloutWidth, y + height + calloutHeight) // callout
            ctx.lineTo(x + calloutBaseLine, y + height) // return
        }
        if (callout === 'topRight') {
            ctx.lineTo(x + width - calloutBaseLine, y + height) // callout
            ctx.lineTo(x + width + calloutWidth, y + height + calloutHeight) // callout
        }
        ctx.lineTo(x + width - radius, y + height) // to top right
        ctx.quadraticCurveTo(x + width, y + height, x + width, y + height - radius)
        ctx.lineTo(x + width, y + radius) // to bottom right
        ctx.quadraticCurveTo(x + width, y, x + width - radius, y)
        if (callout === 'bottomRight') {
            ctx.lineTo(x + width + calloutWidth, y - calloutHeight) // callout
            ctx.lineTo(x + width - calloutBaseLine, y) // return
        }
        if (callout === 'bottomLeft') {
            ctx.lineTo(x + calloutBaseLine, y) // callout
            ctx.lineTo(x - calloutWidth, y - calloutHeight) // callout
        }
        ctx.lineTo(x + radius, y) // to bottom left
        ctx.quadraticCurveTo(x, y, x, y + radius)

        return ctx
    }
}