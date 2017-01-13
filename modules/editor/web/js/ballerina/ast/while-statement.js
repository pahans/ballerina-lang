/**
 * Copyright (c) 2016, WSO2 Inc. (http://www.wso2.org) All Rights Reserved.
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
 */
define(['lodash', 'log', './conditional-statement'], function (_, log, ConditionalStatement) {

    /**
     * Class for while statement in ballerina.
     * @param condition The condition of an while statement.
     * @param statements The statements list of a while statement.
     * @constructor
     */
    var WhileStatement = function (args) {
        ConditionalStatement.call(this);
        if(!_.isNil(_.get(args,'condition'))){
            this._condition = _.get(args,'condition');
        }
        this._statements = _.get(args,'statements') || [];
        this.type = "WhileStatement";
    };

    WhileStatement.prototype = Object.create(ConditionalStatement.prototype);
    WhileStatement.prototype.constructor = WhileStatement;

    WhileStatement.prototype.setCondition = function(condition){
        if(!_.isNil(condition)){
            this._condition = condition;
        }
    };

    WhileStatement.prototype.getCondition = function(){
        return this._condition;
    };

    /**
     * initialize from json
     * @param jsonNode
     */
    WhileStatement.prototype.initFromJson = function (jsonNode) {
        var self = this;
        _.each(jsonNode.children, function (childNode) {
            var child = self.getFactory().createFromJson(childNode);
            if (self.getFactory().isExpression(child)) {
                child.initFromJson(childNode);
                this._condition = child.getExpression();
            } else {
                self.addChild(child);
                child.initFromJson(childNode);
            }
        });
    };

    return WhileStatement;
});