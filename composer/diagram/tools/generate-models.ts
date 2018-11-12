import { BallerinaAST } from "@ballerina/ast-model";
import { stripIndent } from "common-tags";
import * as fs from "fs";
import { fix } from "prettier-tslint";
import bbeASTs from "../resources/bbe-asts.json";

const modelInfo: any = {};

bbeASTs.forEach((bbeASTPath: string) => {
    const { ast } = require(`../resources/bbe-asts/${bbeASTPath}`);
    findModelInfo(ast);
});

const interfaces = Object.keys(modelInfo).map((key) => {
    return `export ${genInterfaceCode(key, modelInfo[key])}`;
});
fs.writeFileSync("./src-ts/models.ts", stripIndent`
    // This is an autogenerated file. Do not edit. Run 'npm run gen-models' to generate.
    // tslint:disable:ban-types
    ${interfaces.join("\n")}
    // tslint:enable:ban-types
`);
fix("./src-ts/models.ts");

function findModelInfo(node: BallerinaAST) {
    if (!modelInfo[node.kind]) {
        modelInfo[node.kind] = {
            __count: 0,
        };
    }
    const model = modelInfo[node.kind];
    model.__count++;

    Object.keys(node).forEach((key) => {
        const value = (node as any)[key];

        if (model[key] === undefined) {
            model[key] = {
                __count: 0,
                type: {},
            };
        }
        const property = model[key];
        property.__count++;

        if (value.kind) {
            property.type[value.kind] = true;
            findModelInfo(value);
            return;
        }

        if (Array.isArray(value)) {
            const types: any = {};
            value.forEach((valueEl) => {
                if (valueEl.kind) {
                    types[valueEl.kind] = true;
                    findModelInfo(valueEl);
                    return;
                }

                types[typeof valueEl] = true;
            });
            if (property.elementTypes) {
                Object.assign(types, property.elementTypes);
            }
            property.elementTypes = types;
            return;
        }

        property.type[typeof value] = true;
    });
}

function genInterfaceCode(kind: string, model: any) {
    return stripIndent`
        interface ${kind} {
            ${getPropertyCode(model).join("\n            ")}
        }
    `;
}

function getPropertyCode(model: any) {
    const code: any[] = [];

    Object.keys(model).forEach((key) => {
        if (key.startsWith("__")) {
            return;
        }

        const property = model[key];

        let type = "any";
        const typesFound: any = [];
        Object.keys(property.type).forEach((key0) => {
            typesFound.push(key0);
        });
        if (typesFound.length > 0) {
            type = typesFound.join("|");
        }

        if (property.elementTypes) {
            const elementTypesFound: any = [];
            Object.keys(property.elementTypes).forEach((key0) => {
                elementTypesFound.push(key0);
            });
            if (elementTypesFound.length > 1) {
                type = `Array<${elementTypesFound.join("|")}>`;
            } else if (elementTypesFound.length === 1) {
                type = `${elementTypesFound[0]}[]`;
            }
        }

        const optional = model.__count > property.__count ? "?" : "";
        code.push(`${key}${optional}: ${type};`);
    });

    return code;
}
