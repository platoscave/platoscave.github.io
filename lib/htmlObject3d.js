//"use strict";

import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.117.1/build/three.module.js";
import HtmlBlock from "./htmlBlock.js";


export default class HtmlObject3D extends THREE.Object3D {


    constructor(htmlStr, fonts, labelProps) {

        super()
        
        this.fonts = fonts

        let parser = new DOMParser();
        let htmlDoc = parser.parseFromString(htmlStr, 'text/html');

        let elementObj = this.walkTheDom(htmlDoc.body, labelProps.style)
        this.setHtmlBlockWidth(elementObj)
        this.positionWordsInBlock(elementObj)
        this.setBlockXBlockY(elementObj)
        this.ptintToObj3d(elementObj, 0)

        var bbox = new THREE.Box3().setFromObject(this);
        let sizeVec = new THREE.Vector3()
        bbox.getSize(sizeVec)

        this.position.set(-sizeVec.x / 2, sizeVec.y / 2, 0)
        this.updateWorldMatrix()


        if (labelProps.background.color) this.addBackground(sizeVec.x, sizeVec.y, labelProps.background)

    }

    walkTheDom(htmlDoc, clientStyle) {
        let blocksArray = []
        const em = clientStyle['font-size']

        const processChildNodes = (parentNode, elementObj, parentStyle) => {

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


                    let mergedStyle = Object.assign({}, elementObj.style, elementStyle, attrStyle);

                    let newLineEls = ['block', 'list-item', 'table', 'table-row', 'table-cell']
                    if (newLineEls.includes(elementStyle.display)) {


                        let newBlockObj = {
                            tag: node.nodeName,
                            style: mergedStyle,
                            subElementsArr: [],
                            blockX: 0
                        }

                        elementObj.subElementsArr.push(newBlockObj)

                        processChildNodes(node, newBlockObj, mergedStyle)
                    }

                    else processChildNodes(node, elementObj, mergedStyle2)



                }

                if (node.nodeType === 3) { // Is it a Text node?
                    var text = node.data.trim();
                    if (text.length > 0) { // Does it have non white-space text content?

                        //this.textBlocksArrToElement(text, parentStyle, elementObj)

                        if(!elementObj.htmlBlock) elementObj.htmlBlock = new HtmlBlock(text, this.fonts, parentStyle)
                        elementObj.htmlBlock.textBlocksArrToElement(text, parentStyle)

                        //console.log('htmlBlock',elementObj.htmlBlock)
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

        let elementObj = {
            tag: 'ROOT',
            style: mergedStyle,
            subElementsArr: [],
            blockX: 0
        }
        processChildNodes(htmlDoc, elementObj, defaultStyle)


        console.log('elementObj', elementObj)

        return elementObj
    }


    setHtmlBlockWidth(elementObj) {
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

        const width = elementObj.style.width


        if (elementObj.style.display === 'table') {
            let columnCount = getColumCount(elementObj)
            //console.log('TABLE', columnCount, elementObj)
            elementObj.subElementsArr.forEach(rowBlock => {
                if (rowBlock.style.display === 'table-row') {
                    rowBlock.subElementsArr.forEach((cellBlock, index) => {
                        if (cellBlock.style.display === 'table-cell') {
                            //cellBlock.blockX = width / columnCount * index
                            cellBlock.style.width = width / columnCount
                            cellBlock.width = width / columnCount
                            cellBlock.htmlBlock.width = width / columnCount
                        }
                    })
                }
            })
        }
        else elementObj.subElementsArr.forEach((subElement) => {
            this.setHtmlBlockWidth(subElement)
        })
    }

    positionWordsInBlock(elementObj) {
        if (elementObj.htmlBlock) elementObj.htmlBlock.makeLinesFromWords()
        elementObj.subElementsArr.forEach((subElement) => {
            this.positionWordsInBlock(subElement)
        })
    }

    setBlockXBlockY(elementObj) {
        let blockX = 0, blockY = 0

        const getRowHeight = rowBlock => {
            let highestCellHeight = 0
            rowBlock.subElementsArr.forEach(cellBlock => {
                if (cellBlock.style.display === 'table-cell') highestCellHeight = Math.max(highestCellHeight, cellBlock.htmlBlock.height)
            })
            return highestCellHeight
        }

        const width = elementObj.style.width

        const position = (elObj) => {
            if (elObj.style.display === 'table') {
                //console.log('TABLE', columnCount, elObj)
                elObj.subElementsArr.forEach(rowBlock => {
                    if (rowBlock.style.display === 'table-row') {
                        rowBlock.subElementsArr.forEach((cellBlock, index) => {
                            if (cellBlock.style.display === 'table-cell') {
                                cellBlock.htmlBlock.blockX = blockX
                                cellBlock.htmlBlock.blockY = blockY
                                blockX += cellBlock.width
                            }
                        })
                    }
                    blockY -= getRowHeight(rowBlock)
                    blockX = 0
                })
            }
            else if (elObj.htmlBlock) {
                elObj.htmlBlock.blockX = blockX
                elObj.htmlBlock.blockY = blockY
                blockY -= elObj.htmlBlock.height
            }
            else elObj.subElementsArr.forEach((subElement) => {
                position(subElement)
            })
        }


        position(elementObj)
    }


    ptintToObj3d(elementObj, orderedListNum = 0) {
        if (elementObj.htmlBlock) {
            elementObj.htmlBlock.printBlocks(this, orderedListNum)
        }
        if( elementObj.tag === 'OL') orderedListNum = 0
        elementObj.subElementsArr.forEach((subElement) => {
            if(elementObj.style.display === 'list-item' && elementObj.style['list-style-type'] === 'decimal') orderedListNum ++
            this.ptintToObj3d(subElement, orderedListNum)
        })
    }

    addBackground(width, height, background) {

        let roundedRectShape = this.getRoundedRectCalloutShape(width + width * 0.05, height + width * 0.05, background.radius, background.callout)
        let boundingBox

        if (background.color) {

            let backgroundMat = new THREE.MeshBasicMaterial({
                color: background.color,
                transparent: true,
                opacity: background.opacity,
                side: THREE.DoubleSide
            });

            let geometry = new THREE.ShapeGeometry(roundedRectShape);
            geometry.translate(width / 2 , - height / 2, -2)
            geometry.translate(0, 0, -2)
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
            geometry.translate(width / 2, - height / 2, -2)
            geometry.translate(0, 0, -2)
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
