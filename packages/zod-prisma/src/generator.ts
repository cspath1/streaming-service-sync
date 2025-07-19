import path from 'path';
import { DMMF } from '@prisma/generator-helper';
import {
  ImportDeclarationStructure,
  SourceFile,
  StructureKind,
  VariableDeclarationKind,
} from 'ts-morph';
import { Config, PrismaOptions } from './config';
import { dotSlash, needsRelatedModel, useModelNames, writeArray } from './util';
import { getJSDocs } from './docs';
import { getZodConstructor } from './types';

export const writeImportsForModel = (
  model: DMMF.Model,
  sourceFile: SourceFile,
  config: Config,
  { schemaPath, outputPath, clientPath }: PrismaOptions,
) => {
  const importSet: Set<ImportDeclarationStructure> = new Set([
    {
      kind: StructureKind.ImportDeclaration,
      namespaceImport: 'z',
      moduleSpecifier: 'zod',
    },
  ]);

  if (config.imports) {
    importSet.add({
      kind: StructureKind.ImportDeclaration,
      namespaceImport: 'imports',
      moduleSpecifier: dotSlash(
        path.relative(
          outputPath,
          path.resolve(path.dirname(schemaPath), config.imports),
        ),
      ),
    });
  }

  if (config.useDecimalJs && model.fields.some(f => f.type === 'Decimal')) {
    importSet.add({
      kind: StructureKind.ImportDeclaration,
      namedImports: ['Decimal'],
      moduleSpecifier: 'decimal.js',
    });
  }

  const enumFields = model.fields.filter(f => f.kind === 'enum');
  // const relationFields = model.fields.filter(f => f.kind === 'object');
  const relativePath = path.relative(`${outputPath}/models`, clientPath);

  if (enumFields.length > 0) {
    importSet.add({
      kind: StructureKind.ImportDeclaration,
      isTypeOnly: enumFields.length === 0,
      moduleSpecifier: dotSlash(relativePath),
      namedImports: enumFields.map(f => f.type),
    });
  }

  // if (relationFields.length > 0) {
  //   importSet.push({
  //     kind: StructureKind.ImportDeclaration,
  //     moduleSpecifier: './index',
  //     namedImports: Array.from(
  //       new Set(relationFields.map(f => modelName(f.type))),
  //     ),
  //   });
  // }

  const importList = Array.from(importSet);

  importList.forEach(importDeclaration => {
    const importExists = sourceFile.getImportDeclaration(
      existingDeclaration => {
        return (
          existingDeclaration.getModuleSpecifierValue() ===
          importDeclaration.moduleSpecifier
        );
      },
    );

    if (!importExists) {
      sourceFile.addImportDeclaration(importDeclaration);
    }
  });
};

export const writeTypeSpecificSchemas = (
  model: DMMF.Model,
  types: DMMF.Model[],
  sourceFile: SourceFile,
  config: Config,
  _prismaOptions: PrismaOptions,
) => {
  const relationFields = model.fields.filter(f => f.kind === 'object');
  const relatedModels = new Set(
    relationFields.map(f => types.find(m => m.name === f.type)),
  );

  relatedModels.forEach(relatedModel => {
    if (!relatedModel) return;
    writeTypeSpecificSchemas(
      relatedModel,
      types,
      sourceFile,
      config,
      _prismaOptions,
    );
    writeImportsForModel(relatedModel, sourceFile, config, _prismaOptions);
    generateSchemaForModel(relatedModel, sourceFile, config, _prismaOptions);
  });
};

export const generateSchemaForModel = (
  model: DMMF.Model,
  sourceFile: SourceFile,
  config: Config,
  _prismaOptions: PrismaOptions,
) => {
  const { modelName } = useModelNames(config);

  sourceFile.addVariableStatement({
    declarationKind: VariableDeclarationKind.Const,
    isExported: true,
    leadingTrivia: writer => writer.blankLineIfLastNot(),
    declarations: [
      {
        name: modelName(model.name),
        initializer(writer) {
          writer
            .write('z.object(')
            .inlineBlock(() => {
              model.fields
                .filter(f => !f?.relationName)
                .forEach(field => {
                  writeArray(writer, getJSDocs(field.documentation));
                  writer
                    .write(
                      `${field.name}: ${getZodConstructor(field, modelName)}`,
                    )
                    .write(',')
                    .newLine();
                });
            })
            .write(')');
        },
      },
    ],
  });
};

export const generateRelatedSchemaForModel = (
  model: DMMF.Model,
  sourceFile: SourceFile,
  config: Config,
  _prismaOptions: PrismaOptions,
) => {
  const { modelName, relatedModelName } = useModelNames(config);

  const relationFields = model.fields.filter(f => f.kind === 'object');

  sourceFile.addInterface({
    name: `Complete${model.name}`,
    isExported: true,
    extends: [`z.infer<typeof ${modelName(model.name)}>`],
    properties: relationFields.map(f => ({
      hasQuestionToken: !f.isRequired,
      name: f.name,
      type: `Complete${f.type}${f.isList ? '[]' : ''}${!f.isRequired ? ' | null' : ''}`,
    })),
  });

  sourceFile.addStatements(writer =>
    writeArray(writer, [
      '',
      '/**',
      ` * ${relatedModelName(
        model.name,
      )} contains all relations on your model in addition to the scalars`,
      ' *',
      ' * NOTE: Lazy required in case of potential circular dependencies within schema',
      ' */',
    ]),
  );

  sourceFile.addVariableStatement({
    declarationKind: VariableDeclarationKind.Const,
    isExported: true,
    declarations: [
      {
        name: relatedModelName(model.name),
        type: `z.ZodSchema<Complete${model.name}>`,
        initializer(writer) {
          writer
            .write(`z.lazy(() => ${modelName(model.name)}.extend(`)
            .inlineBlock(() => {
              relationFields.forEach(field => {
                writeArray(writer, getJSDocs(field.documentation));

                writer
                  .write(
                    `${field.name}: ${getZodConstructor(
                      field,
                      relatedModelName,
                    )}`,
                  )
                  .write(',')
                  .newLine();
              });
            })
            .write('))');
        },
      },
    ],
  });
};

export const populateModelFile = (
  model: DMMF.Model,
  types: DMMF.Model[],
  sourceFile: SourceFile,
  config: Config,
  prismaOptions: PrismaOptions,
) => {
  writeImportsForModel(model, sourceFile, config, prismaOptions);
  writeTypeSpecificSchemas(model, types, sourceFile, config, prismaOptions);
  generateSchemaForModel(model, sourceFile, config, prismaOptions);
  if (needsRelatedModel(model, config))
    generateRelatedSchemaForModel(model, sourceFile, config, prismaOptions);
};

export const generateBarrelFile = (
  models: readonly { name: string }[],
  indexFile: SourceFile,
) => {
  models.forEach(model =>
    indexFile.addExportDeclaration({
      moduleSpecifier: `./${model.name.toLowerCase()}`,
    }),
  );
};

export const generateClientExtensionFile = (
  models: readonly DMMF.Model[],
  config: Config,
  clientFile: SourceFile,
) => {
  const { modelName } = useModelNames(config);
  const modelImports = models.map(model => modelName(model.name)).join(', ');
  clientFile.addStatements(writer => {
    writer.newLine();
    writeArray(writer, [
      `import { type PrismaClient } from "../client";
      import { ${modelImports} } from '../models';
      
      /**
       * Prisma Client Extension
       */
      export const clientExtension: Parameters<PrismaClient['$extends']>[0] = {
        query: {`,
    ]);
  });

  models.forEach(model => {
    const mName = modelName(model.name);
    const camelCaseName =
      model.name.charAt(0).toLowerCase() + model.name.slice(1);
    clientFile.addStatements(writer => {
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
            },`,
      ]);
    });
  });

  clientFile.addStatements(writer => {
    writeArray(writer, [
      `  },
       };
      `,
    ]);
  });
};
