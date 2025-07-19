#!/usr/bin/env node
"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __name = (target, value) => __defProp(target, "name", { value, configurable: true });
var __esm = (fn, res) => function __init() {
  return fn && (res = (0, fn[__getOwnPropNames(fn)[0]])(fn = 0)), res;
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// package.json
var version;
var init_package = __esm({
  "package.json"() {
    version = "0.0.0";
  }
});

// src/config.ts
var import_zod, configBoolean, configSchema;
var init_config = __esm({
  "src/config.ts"() {
    "use strict";
    import_zod = require("zod");
    configBoolean = import_zod.z.enum([
      "true",
      "false"
    ]).transform((arg) => JSON.parse(arg));
    configSchema = import_zod.z.object({
      relationModel: configBoolean.default("true").or(import_zod.z.literal("default")),
      modelSuffix: import_zod.z.string().default("Model"),
      modelCase: import_zod.z.enum([
        "PascalCase",
        "camelCase"
      ]).default("PascalCase"),
      useDecimalJs: configBoolean.default("false"),
      imports: import_zod.z.string().optional(),
      prismaJsonNullability: configBoolean.default("true")
    });
  }
});

// src/util.ts
var writeArray, useModelNames, needsRelatedModel, chunk, dotSlash;
var init_util = __esm({
  "src/util.ts"() {
    "use strict";
    writeArray = /* @__PURE__ */ __name((writer, array, newLine = true) => array.forEach((line) => writer.write(line).conditionalNewLine(newLine)), "writeArray");
    useModelNames = /* @__PURE__ */ __name(({ modelCase, modelSuffix, relationModel }) => {
      const formatModelName = /* @__PURE__ */ __name((name, prefix = "") => {
        if (modelCase === "camelCase") {
          name = name.slice(0, 1).toLowerCase() + name.slice(1);
        }
        return `${prefix}${name}${modelSuffix}`;
      }, "formatModelName");
      return {
        modelName: /* @__PURE__ */ __name((name) => formatModelName(name, relationModel === "default" ? "_" : ""), "modelName"),
        relatedModelName: /* @__PURE__ */ __name((name) => formatModelName(relationModel === "default" ? name.toString() : `Related${name.toString()}`), "relatedModelName")
      };
    }, "useModelNames");
    needsRelatedModel = /* @__PURE__ */ __name((model, config) => model.fields.some((field) => field.kind === "object") && config.relationModel !== false, "needsRelatedModel");
    chunk = /* @__PURE__ */ __name((input, size) => {
      return input.reduce((arr, item, idx) => {
        return idx % size === 0 ? [
          ...arr,
          [
            item
          ]
        ] : [
          ...arr.slice(0, -1),
          [
            ...arr.slice(-1)[0],
            item
          ]
        ];
      }, []);
    }, "chunk");
    dotSlash = /* @__PURE__ */ __name((input) => {
      const converted = input.replace(/^\\\\\?\\/, "").replace(/\\/g, "/").replace(/\/\/+/g, "/");
      if (converted.includes(`/node_modules/`)) return converted.split(`/node_modules/`).slice(-1)[0];
      if (converted.startsWith(`../`)) return converted;
      return "./" + converted;
    }, "dotSlash");
  }
});

// src/docs.ts
var import_parenthesis, getJSDocs, getZodDocElements, computeCustomSchema, computeModifiers;
var init_docs = __esm({
  "src/docs.ts"() {
    "use strict";
    import_parenthesis = require("parenthesis");
    init_util();
    getJSDocs = /* @__PURE__ */ __name((docString) => {
      const lines = [];
      if (docString) {
        const docLines = docString.split("\n").filter((dL) => !dL.trimStart().startsWith("@zod"));
        if (docLines.length) {
          lines.push("/**");
          docLines.forEach((dL) => lines.push(` * ${dL}`));
          lines.push(" */");
        }
      }
      return lines;
    }, "getJSDocs");
    getZodDocElements = /* @__PURE__ */ __name((docString) => docString.split("\n").filter((line) => line.trimStart().startsWith("@zod")).map((line) => line.trimStart().slice(4)).flatMap((line) => (
      // Array.from(line.matchAll(/\.([^().]+\(.*?\))/g), (m) => m.slice(1)).flat()
      chunk((0, import_parenthesis.parse)(line), 2).slice(0, -1).map(([each, contents]) => each.replace(/\)?\./, "") + `${(0, import_parenthesis.stringify)(contents)})`)
    )), "getZodDocElements");
    computeCustomSchema = /* @__PURE__ */ __name((docString) => {
      return getZodDocElements(docString).find((modifier) => modifier.startsWith("custom("))?.slice(7).slice(0, -1);
    }, "computeCustomSchema");
    computeModifiers = /* @__PURE__ */ __name((docString) => {
      return getZodDocElements(docString).filter((each) => !each.startsWith("custom("));
    }, "computeModifiers");
  }
});

// src/types.ts
var getZodConstructor;
var init_types = __esm({
  "src/types.ts"() {
    "use strict";
    init_docs();
    getZodConstructor = /* @__PURE__ */ __name((field, getRelatedModelName = (name) => name.toString()) => {
      let zodType = "z.unknown()";
      let extraModifiers = [
        ""
      ];
      if (field.kind === "scalar") {
        switch (field.type) {
          case "String":
            zodType = "z.string()";
            break;
          case "Int":
            zodType = "z.number()";
            extraModifiers.push("int()");
            break;
          case "BigInt":
            zodType = "z.bigint()";
            break;
          case "DateTime":
            zodType = "z.date()";
            break;
          case "Float":
            zodType = "z.number()";
            break;
          case "Decimal":
            zodType = "z.number()";
            break;
          case "Json":
            zodType = "z.object({}).partial().passthrough()";
            break;
          case "Boolean":
            zodType = "z.boolean()";
            break;
          // TODO: Proper type for bytes fields
          case "Bytes":
            zodType = "z.unknown()";
            break;
        }
      } else if (field.kind === "enum") {
        zodType = `z.nativeEnum(${field.type})`;
      } else if (field.kind === "object") {
        zodType = getRelatedModelName(field.type);
      }
      if (field.isList) extraModifiers.push("array()");
      if (field.documentation) {
        zodType = computeCustomSchema(field.documentation) ?? zodType;
        extraModifiers.push(...computeModifiers(field.documentation));
      }
      if (!field.isRequired && field.type !== "Json") extraModifiers.push("nullable()");
      return `${zodType}${extraModifiers.join(".")}`;
    }, "getZodConstructor");
  }
});

// src/generator.ts
var import_path, import_ts_morph, writeImportsForModel, writeTypeSpecificSchemas, generateSchemaForModel, generateRelatedSchemaForModel, populateModelFile, generateBarrelFile, generateClientExtensionFile;
var init_generator = __esm({
  "src/generator.ts"() {
    "use strict";
    import_path = __toESM(require("path"));
    import_ts_morph = require("ts-morph");
    init_util();
    init_docs();
    init_types();
    writeImportsForModel = /* @__PURE__ */ __name((model, sourceFile, config, { schemaPath, outputPath, clientPath }) => {
      const importSet = /* @__PURE__ */ new Set([
        {
          kind: import_ts_morph.StructureKind.ImportDeclaration,
          namespaceImport: "z",
          moduleSpecifier: "zod"
        }
      ]);
      if (config.imports) {
        importSet.add({
          kind: import_ts_morph.StructureKind.ImportDeclaration,
          namespaceImport: "imports",
          moduleSpecifier: dotSlash(import_path.default.relative(outputPath, import_path.default.resolve(import_path.default.dirname(schemaPath), config.imports)))
        });
      }
      if (config.useDecimalJs && model.fields.some((f) => f.type === "Decimal")) {
        importSet.add({
          kind: import_ts_morph.StructureKind.ImportDeclaration,
          namedImports: [
            "Decimal"
          ],
          moduleSpecifier: "decimal.js"
        });
      }
      const enumFields = model.fields.filter((f) => f.kind === "enum");
      const relativePath = import_path.default.relative(`${outputPath}/models`, clientPath);
      if (enumFields.length > 0) {
        importSet.add({
          kind: import_ts_morph.StructureKind.ImportDeclaration,
          isTypeOnly: enumFields.length === 0,
          moduleSpecifier: dotSlash(relativePath),
          namedImports: enumFields.map((f) => f.type)
        });
      }
      const importList = Array.from(importSet);
      importList.forEach((importDeclaration) => {
        const importExists = sourceFile.getImportDeclaration((existingDeclaration) => {
          return existingDeclaration.getModuleSpecifierValue() === importDeclaration.moduleSpecifier;
        });
        if (!importExists) {
          sourceFile.addImportDeclaration(importDeclaration);
        }
      });
    }, "writeImportsForModel");
    writeTypeSpecificSchemas = /* @__PURE__ */ __name((model, types, sourceFile, config, _prismaOptions) => {
      const relationFields = model.fields.filter((f) => f.kind === "object");
      const relatedModels = new Set(relationFields.map((f) => types.find((m) => m.name === f.type)));
      relatedModels.forEach((relatedModel) => {
        if (!relatedModel) return;
        writeTypeSpecificSchemas(relatedModel, types, sourceFile, config, _prismaOptions);
        writeImportsForModel(relatedModel, sourceFile, config, _prismaOptions);
        generateSchemaForModel(relatedModel, sourceFile, config, _prismaOptions);
      });
    }, "writeTypeSpecificSchemas");
    generateSchemaForModel = /* @__PURE__ */ __name((model, sourceFile, config, _prismaOptions) => {
      const { modelName } = useModelNames(config);
      sourceFile.addVariableStatement({
        declarationKind: import_ts_morph.VariableDeclarationKind.Const,
        isExported: true,
        leadingTrivia: /* @__PURE__ */ __name((writer) => writer.blankLineIfLastNot(), "leadingTrivia"),
        declarations: [
          {
            name: modelName(model.name),
            initializer(writer) {
              writer.write("z.object(").inlineBlock(() => {
                model.fields.filter((f) => !f?.relationName).forEach((field) => {
                  writeArray(writer, getJSDocs(field.documentation));
                  writer.write(`${field.name}: ${getZodConstructor(field, modelName)}`).write(",").newLine();
                });
              }).write(")");
            }
          }
        ]
      });
    }, "generateSchemaForModel");
    generateRelatedSchemaForModel = /* @__PURE__ */ __name((model, sourceFile, config, _prismaOptions) => {
      const { modelName, relatedModelName } = useModelNames(config);
      const relationFields = model.fields.filter((f) => f.kind === "object");
      sourceFile.addInterface({
        name: `Complete${model.name}`,
        isExported: true,
        extends: [
          `z.infer<typeof ${modelName(model.name)}>`
        ],
        properties: relationFields.map((f) => ({
          hasQuestionToken: !f.isRequired,
          name: f.name,
          type: `Complete${f.type}${f.isList ? "[]" : ""}${!f.isRequired ? " | null" : ""}`
        }))
      });
      sourceFile.addStatements((writer) => writeArray(writer, [
        "",
        "/**",
        ` * ${relatedModelName(model.name)} contains all relations on your model in addition to the scalars`,
        " *",
        " * NOTE: Lazy required in case of potential circular dependencies within schema",
        " */"
      ]));
      sourceFile.addVariableStatement({
        declarationKind: import_ts_morph.VariableDeclarationKind.Const,
        isExported: true,
        declarations: [
          {
            name: relatedModelName(model.name),
            type: `z.ZodSchema<Complete${model.name}>`,
            initializer(writer) {
              writer.write(`z.lazy(() => ${modelName(model.name)}.extend(`).inlineBlock(() => {
                relationFields.forEach((field) => {
                  writeArray(writer, getJSDocs(field.documentation));
                  writer.write(`${field.name}: ${getZodConstructor(field, relatedModelName)}`).write(",").newLine();
                });
              }).write("))");
            }
          }
        ]
      });
    }, "generateRelatedSchemaForModel");
    populateModelFile = /* @__PURE__ */ __name((model, types, sourceFile, config, prismaOptions) => {
      writeImportsForModel(model, sourceFile, config, prismaOptions);
      writeTypeSpecificSchemas(model, types, sourceFile, config, prismaOptions);
      generateSchemaForModel(model, sourceFile, config, prismaOptions);
      if (needsRelatedModel(model, config)) generateRelatedSchemaForModel(model, sourceFile, config, prismaOptions);
    }, "populateModelFile");
    generateBarrelFile = /* @__PURE__ */ __name((models, indexFile) => {
      models.forEach((model) => indexFile.addExportDeclaration({
        moduleSpecifier: `./${model.name.toLowerCase()}`
      }));
    }, "generateBarrelFile");
    generateClientExtensionFile = /* @__PURE__ */ __name((models, config, clientFile) => {
      const { modelName } = useModelNames(config);
      const modelImports = models.map((model) => modelName(model.name)).join(", ");
      clientFile.addStatements((writer) => {
        writer.newLine();
        writeArray(writer, [
          `import { type PrismaClient } from "../client";
      import { ${modelImports} } from '../models';
      
      /**
       * Prisma Client Extension
       */
      export const clientExtension: Parameters<PrismaClient['$extends']>[0] = {
        query: {`
        ]);
      });
      models.forEach((model) => {
        const mName = modelName(model.name);
        const camelCaseName = model.name.charAt(0).toLowerCase() + model.name.slice(1);
        clientFile.addStatements((writer) => {
          writer.newLine();
          writeArray(writer, [
            ` ${camelCaseName}: {
              create({ args, query }) {
                args.data = ${mName}.omit({ id: true, createdAt: true, updatedAt: true }).parse(args.data);
                return query(args);
            },
              update({ args, query }) {
                args.data = ${mName}.partial().parse(args.data);
                return query(args);
              },
              updateMany({ args, query }) {
                args.data = ${mName}.partial().parse(args.data);
                return query(args);
              },
              upsert({ args, query }) {
                args.create = ${mName}.omit({ id: true, createdAt: true, updatedAt: true }).parse(args.create);
                args.update = ${mName}.partial().parse(args.update);
                return query(args);
              },
            },`
          ]);
        });
      });
      clientFile.addStatements((writer) => {
        writeArray(writer, [
          `  },
       };
      `
        ]);
      });
    }, "generateClientExtensionFile");
  }
});

// src/index.ts
var index_exports = {};
var import_generator_helper, import_typescript, import_ts_morph2;
var init_index = __esm({
  "src/index.ts"() {
    "use strict";
    init_package();
    import_generator_helper = require("@prisma/generator-helper");
    import_typescript = require("typescript");
    init_config();
    init_generator();
    import_ts_morph2 = require("ts-morph");
    (0, import_generator_helper.generatorHandler)({
      onManifest() {
        return {
          version,
          prettyName: "Zod Schemas",
          defaultOutput: "zod"
        };
      },
      onGenerate(options) {
        const project = new import_ts_morph2.Project();
        const models = options.dmmf.datamodel.models;
        const types = options.dmmf.datamodel.types;
        const { schemaPath } = options;
        const outputPath = options.generator.output.value ?? "./zod";
        const clientPath = options.otherGenerators.find((each) => each.provider.value === "prisma-client-js").output.value;
        const results = configSchema.safeParse(options.generator.config);
        if (!results.success) throw new Error("Incorrect config provided. Please check the values you provided and try again.");
        const config = results.data;
        const prismaOptions = {
          clientPath,
          outputPath,
          schemaPath
        };
        const modelIndexFile = project.createSourceFile(`${outputPath}/models/index.ts`, {}, {
          overwrite: true
        });
        generateBarrelFile(models, modelIndexFile);
        modelIndexFile.formatText({
          indentSize: 2,
          convertTabsToSpaces: true,
          semicolons: import_typescript.SemicolonPreference.Remove
        });
        const clientExtensionFile = project.createSourceFile(`${outputPath}/clientExtension/index.ts`, {}, {
          overwrite: true
        });
        generateClientExtensionFile(models, config, clientExtensionFile);
        clientExtensionFile.formatText({
          indentSize: 2,
          convertTabsToSpaces: true,
          semicolons: import_typescript.SemicolonPreference.Remove
        });
        models.forEach((model) => {
          const sourceFile = project.createSourceFile(`${outputPath}/models/${model.name.toLowerCase()}.ts`, {}, {
            overwrite: true,
            scriptKind: 0
          });
          populateModelFile(model, types, sourceFile, config, prismaOptions);
          sourceFile.formatText({
            indentSize: 2,
            convertTabsToSpaces: true,
            semicolons: import_typescript.SemicolonPreference.Remove
          });
        });
        return project.save();
      }
    });
  }
});

// src/cli.ts
init_index();
//# sourceMappingURL=cli.js.map