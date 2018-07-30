/**
 * Copyright (c) 2018, WSO2 Inc. (http://www.wso2.org) All Rights Reserved.
 *
 * WSO2 Inc. licenses this file to you under the Apache License,
 * Version 2.0 (the "License"); you may not use this file except
 * in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied. See the License for the
 * specific language governing permissions and limitations
 * under the License.
 *
 */

import 'font-ballerina/css/font-ballerina.css';
import { renderToStaticMarkup } from 'react-dom/server';
import { createElement } from 'react';
import { DragDropContext } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';

import Diagram from 'plugins/ballerina/diagram/diagram.jsx';
import TreeBuilder from 'plugins/ballerina/model/tree-builder.js';
import '../src/ballerina-theme/semantic.less';
import DebugManager from 'plugins/debugger/DebugManager/DebugManager.js';

function renderDiagram(target, modelJson, props = {}) {
    const defaultProps = {
        model: TreeBuilder.build(modelJson),
        mode: 'action',
        editMode: true,
        height: 300,
        width: 300,
    };
    Object.assign(defaultProps, props);
    const el = createElement(DragDropContext(HTML5Backend)(Diagram), defaultProps);
    target.innerHTML = renderToStaticMarkup(el);
}

const BalDiagram = DragDropContext(HTML5Backend)(Diagram);

export {
    TreeBuilder,
    Diagram,
    BalDiagram,
    renderDiagram,
    DebugManager,
}