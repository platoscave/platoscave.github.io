//"use strict";

import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.117.1/build/three.module.js";

export default class HtmlObject3D extends THREE.Object3D {


    constructor(htmlDoc, fonts, labelProps) {

        super()

        this.fonts = fonts


        let blockObj = this.walkTheDom(htmlDoc, labelProps.style)
        this.setStyleWidthForTableCells(blockObj)
        this.makeLinesFromWords(blockObj)
        this.setPosYForTableCells(blockObj, 0)
        this.printBlocks(blockObj)


        let height = 1000
        this.translateX(- labelProps.style.width / 2)
        this.translateY(height / 2)

        if (labelProps.background.color) this.addBackground(labelProps.style.width, height, labelProps.style['font-size'] / 2, labelProps.background)
        this.updateMatrix()
        this.updateWorldMatrix(false, true)
    }

    walkTheDom(htmlDoc, clientStyle) {
        let blocksArray = []
        const em = clientStyle['font-size']

        const processChildNodes = (parentNode, blockObj, parentStyle) => {

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

                    let mergedStyle2 = Object.assign({}, parentStyle, elementStyle, attrStyle);


                    let mergedStyle = Object.assign({}, blockObj.style, elementStyle, attrStyle);

                    let newLineEls = ['block', 'list-item', 'table', 'table-row', 'table-cell']
                    if (newLineEls.includes(elementStyle.display)) {


                        let newBlockObj = {
                            tag: node.nodeName,
                            style: mergedStyle,
                            subElementsArr: [],
                        }

                        blockObj.subElementsArr.push(newBlockObj)

                        processChildNodes(node, newBlockObj, mergedStyle)
                    }

                    else processChildNodes(node, blockObj, mergedStyle2)



                }

                if (node.nodeType === 3) { // Is it a Text node?
                    var text = node.data.trim();
                    if (text.length > 0) { // Does it have non white-space text content?
 
                        this.addWordsDescToBlock(text, parentStyle, blockObj)
                    }
                }
            })
        }
        const defaultStyle = {
            'color': 0x808080,
            'font-size': 10,
            'width': 300
        }
        let mergedStyle = Object.assign({}, defaultStyle, clientStyle);

        let blockObj = {
            tag: 'ROOT',
            style: mergedStyle,
            subElementsArr: [],
        }
        processChildNodes(htmlDoc, blockObj, defaultStyle)


        console.log('blockObj', blockObj)

        return blockObj
    }


    addWordsDescToBlock(text, style, block) {
        block.wordDescsArr = []
        block.pos = {x:0, y:0}
        const fontSize = style['font-size'] ? style['font-size'] : 10
        const preFormated = style['white-space'] === 'pre'
        let font = this.fonts.regularFont
        if (style['font-weight'] === 'bold') font = this.fonts.boldFont
        if (style['font-family'] === 'monospace') font = this.fonts.monoFont

        if (!preFormated) {
            const wordsArr = text.split(/\s+/g);
            wordsArr.forEach(word => {

                let spaceBeforeWidth = fontSize * 0.635
                // make an exception for punctuation marks
                if (!!word.match(/^[.,:!?]/)) spaceBeforeWidth = 2

                let shape = font.generateShapes(word, fontSize);
                let geometry = new THREE.ShapeGeometry(shape);
                geometry.computeBoundingBox();
                geometry.name = word

                block.wordDescsArr.push({
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
            let geometry = new THREE.ShapeGeometry(shape);
            geometry.computeBoundingBox();
            geometry.name = text
            block.wordDescsArr.push({
                text: text,
                style: style,
                geometry: geometry,
                width: geometry.boundingBox.max.x,
                height: geometry.boundingBox.max.y - geometry.boundingBox.min.y,
                spaceBeforeWidth: 0,
                pos: { x: 0, y: 0 }
            })
        }
    }


    /* 
        Set the style width and the pos x for the table cells
    */
    setStyleWidthForTableCells(block) {
        const getColumCount = tableBlock => {
            let highestCellCount = 0
            tableBlock.subElementsArr.forEach(rowBlock => {
                let cellCount = 0
                if (rowBlock.style.display === 'table-row') {
                    rowBlock.subElementsArr.forEach(cellBlock => {
                        if (cellBlock.style.display === 'table-cell') cellCount++
                    })
                }
                // TODO else recurse for table body / head
                if (cellCount > highestCellCount) highestCellCount = cellCount
            })
            return highestCellCount
        }

        const width = block.style.width


        if (block.style.display === 'table') {
            let columnCount = getColumCount(block)
            //console.log('TABLE', columnCount, block)
            block.subElementsArr.forEach(rowBlock => {
                if (rowBlock.style.display === 'table-row') {
                    rowBlock.subElementsArr.forEach((cellBlock, index) => {
                        if (cellBlock.style.display === 'table-cell') {
                            cellBlock.pos.x = width / columnCount * index
                            cellBlock.style.width = width / columnCount
                            this.setStyleWidthForTableCells(cellBlock)
                        }
                    })
                }
            })
        }
        else block.subElementsArr.forEach((subBlock) => {
            this.setStyleWidthForTableCells(subBlock)
        })
    }

    makeLinesFromWords(block) {
        const blokStyle = block.style

        if (block.wordDescsArr) {

            const paddingLeft = blokStyle['padding-left'] ? blokStyle['padding-left'] : 0
            const paddingRight = blokStyle['padding-right'] ? blokStyle['padding-right'] : 0
            const paddingTop = blokStyle['padding-top'] ? blokStyle['padding-top'] : 0
            const paddingBottom = blokStyle['padding-bottom'] ? blokStyle['padding-bottom'] : 0
            const width = blokStyle.width - paddingLeft - paddingRight

            let wordX = paddingLeft, wordY = -paddingTop
            let lineHeight = 0, lineStartIndex = 0
            //if (block.tag === 'PRE') debugger



            block.wordDescsArr[0].spaceBeforeWidth = 0 // the first word of each line has no space before

            block.wordDescsArr.forEach((wordDesc, index) => {

                //if (wordDesc.style['white-space'] !== 'pre') 


                wordX += wordDesc.spaceBeforeWidth

                lineHeight = Math.max(lineHeight, wordDesc.height * 1.4)

                // This word won't fit
                if (wordX > width) {
                    wordY -= lineHeight
                    for (let i = lineStartIndex; i < index; i++) {
                        block.wordDescsArr[i].pos.y = wordY
                    }
                    lineStartIndex = index
                    lineHeight = 0
                    wordX = paddingLeft
                    wordDesc.spaceBeforeWidth = 0 // the first word of each line has no space before
                }
                wordDesc.pos = { x: wordX, y: wordY }

                wordX += wordDesc.width

            })
            wordY -= lineHeight
            for (let i = lineStartIndex; i < block.wordDescsArr.length; i++) {
                block.wordDescsArr[i].pos.y = wordY
            }


            block.style.height = paddingBottom - wordY
        }

        block.subElementsArr.forEach((subBlock) => {
            let lowerBlockY = this.makeLinesFromWords(subBlock)
        })
    }


    /* 
        Set the pos y for the table cells
    */
    setPosYForTableCells(block, blockY) {
        const getRowHeight = rowBlock => {
            let highestCellHeight = 0
            rowBlock.subElementsArr.forEach(cellBlock => {
                if (cellBlock.style.display === 'table-cell') {
                    cellBlock.pos.y = blockY
                    highestCellHeight = Math.max(cellBlock.style.height, highestCellHeight)
                }
            })
            return highestCellHeight
        }

        console.log(block.tag, blockY)

        if (block.style.display === 'table') {
            block.subElementsArr.forEach(rowBlock => {
                let rowHeight = getRowHeight(block)
                blockY -= rowHeight
            })
        }

        else if (block.wordDescsArr){
            block.pos.y = blockY
            blockY -= block.style.height
        }
        else block.subElementsArr.forEach((subBlock) => {
            blockY = this.setPosYForTableCells(subBlock, blockY)
        })
        console.log('return',block.tag, blockY)

        return blockY
    }

    printBlocks(block) {
        let lineY = 0
        let orderedListNum = 0



        const blokStyle = block.style
        const marginTop = blokStyle['margin-top'] ? blokStyle['margin-top'] : 0
        const marginBottom = blokStyle['margin-bottom'] ? blokStyle['margin-bottom'] : 0
        const listStyleType = blokStyle['list-style-type'] ? blokStyle['list-style-type'] : ''
        if (block.tag === 'OL') orderedListNum = 1

        //lineY -= marginTop

        if (block.wordDescsArr) {
            const blockX = block.pos.x
            const blockY = block.pos.y

            block.wordDescsArr.forEach((wordDesc, wordNum) => {

                const style = wordDesc.style
                const wordX = blockX + wordDesc.pos.x
                const wordY = blockY + wordDesc.pos.y
                const wordWidth = wordDesc.width
                const textGeometry = wordDesc.geometry
                const color = style.color ? style.color : 0x404040
                const textMaterial = new THREE.MeshBasicMaterial({
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
                    textGeometry.applyMatrix4(matrix);
                }

                textGeometry.translate(wordX, wordY, 0)
                let mesh = new THREE.Mesh(textGeometry, textMaterial)
                mesh.updateMatrix();
                this.add(mesh)

                //this.mergeMeshes( [this, mesh] ) // cant get this to work

                // Add bullet or number if we have a list style type
                if (wordNum === 0 && listStyleType) {
                    let geometry
                    if (listStyleType === 'disc') {
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
                    this.add(mesh)

                    orderedListNum++
                }

                // underline
                if (style['text-decoration'] === 'underline') {
                    let geometry = new THREE.PlaneGeometry(wordWidth, 2, 2);
                    geometry.translate(wordX + wordWidth / 2, wordY + -2, 1)
                    let mesh = new THREE.Mesh(geometry, textMaterial);
                    this.add(mesh)
                }

                // strike through
                if (style['text-decoration'] === 'line-through') {
                    let geometry = new THREE.PlaneGeometry(wordWidth, 2, 2);
                    geometry.translate(wordX + wordWidth / 2, wordY + fontSize * 0.4, 1)
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
                    geometry.translate(wordX + wordWidth / 2, wordY + 4, -1)
                    let mesh = new THREE.Mesh(geometry, textMaterial);
                    this.add(mesh)
                }

                //wordX += wordWidth
            })
            //wordY -= marginBottom
        }

        else block.subElementsArr.forEach(subBlock => this.printBlocks(subBlock))

        //return wordY

    }

    addBackground(width, height, radians, background) {

        let roundedRectShape = this.getRoundedRectCalloutShape(width, height, radians, background.callout)
        let boundingBox

        if (background.color) {

            let backgroundMat = new THREE.MeshBasicMaterial({
                color: background.color,
                transparent: true,
                opacity: background.opacity,
                side: THREE.DoubleSide
            });

            let geometry = new THREE.ShapeGeometry(roundedRectShape);
            geometry.translate(width / 2 - 20, - height / 2, -2)
            this.backgroundMesh = new THREE.Mesh(geometry, backgroundMat)
            this.add(this.backgroundMesh)
            geometry.computeBoundingBox();
            boundingBox = geometry.boundingBox
        }
        if (background.borderColor) {

            let borderMat = new THREE.MeshBasicMaterial({
                color: background.borderColor,
                transparent: true,
                opacity: background.opacity,
                side: THREE.DoubleSide
            });

            var points = roundedRectShape.getPoints();
            var geometry = new THREE.BufferGeometry().setFromPoints(points);
            geometry.translate(width / 2 - 20, - height / 2, -2)
            this.add(new THREE.Line(geometry, borderMat))
            geometry.computeBoundingBox();
            boundingBox = geometry.boundingBox
        }

        // axesHelper
        let axesHelper = new THREE.AxesHelper(100)
        this.add(axesHelper)


        // If there is a callout, center out obj3d arrounf the arrow point
        if (boundingBox) {
            let calloutWidth = -boundingBox.min.x + boundingBox.max.x
            let calloutHeight = -boundingBox.min.y + boundingBox.max.y
            if (background.callout === 'topLeft') {
                this.translateX(calloutWidth - width / 2)
                this.translateY(- calloutHeight + height / 2)
            }
            if (background.callout === 'topRight') {
                this.translateX(- calloutWidth + width / 2)
                this.translateY(- calloutHeight + height / 2)
            }
            if (background.callout === 'bottomRight') {
                this.translateX(- calloutWidth + width / 2)
                this.translateY(calloutHeight - height / 2)
            }
            if (background.callout === 'bottomLeft') {
                this.translateX(calloutWidth - width / 2)
                this.translateY(calloutHeight - height / 2)
            }

        }
    }

    getBackgroundMesh() {
        return this.backgroundMesh
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
