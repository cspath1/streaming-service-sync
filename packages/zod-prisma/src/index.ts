// @ts-ignore Importing package.json for automated synchronization of version numbers
import { version } from '../package.json';

import { generatorHandler } from '@prisma/generator-helper';
import { SemicolonPreference } from 'typescript';
import { configSchema, PrismaOptions } from './config';
import {
  populateModelFile,
  generateBarrelFile,
  generateClientExtensionFile,
} from './generator';
import { Project } from 'ts-morph';

generatorHandler({
  onManifest() {
    return {
      version,
      prettyName: 'Zod Schemas',
      defaultOutput: 'zod',
    };
  },
  onGenerate(options) {
    const project = new Project();

    const models = options.dmmf.datamodel.models;
    const types = options.dmmf.datamodel.types;

    const { schemaPath } = options;
    const outputPath = options.generator.output!.value ?? './zod';
    const clientPath = options.otherGenerators.find(
      each => each.provider.value === 'prisma-client-js',
    )!.output!.value!;

    const results = configSchema.safeParse(options.generator.config);
    if (!results.success)
      throw new Error(
        'Incorrect config provided. Please check the values you provided and try again.',
      );

    const config = results.data;
    const prismaOptions: PrismaOptions = {
      clientPath,
      outputPath,
      schemaPath,
    };

    const modelIndexFile = project.createSourceFile(
      `${outputPath}/models/index.ts`,
      {},
      { overwrite: true },
    );

    generateBarrelFile(models, modelIndexFile);

    modelIndexFile.formatText({
      indentSize: 2,
      convertTabsToSpaces: true,
      semicolons: SemicolonPreference.Remove,
    });

    const clientExtensionFile = project.createSourceFile(
      `${outputPath}/clientExtension/index.ts`,
      {},
      { overwrite: true },
    );

    generateClientExtensionFile(models, config, clientExtensionFile);

    clientExtensionFile.formatText({
      indentSize: 2,
      convertTabsToSpaces: true,
      semicolons: SemicolonPreference.Remove,
    });

    models.forEach(model => {
      const sourceFile = project.createSourceFile(
        `${outputPath}/models/${model.name.toLowerCase()}.ts`,
        {},
        { overwrite: true, scriptKind: 0 },
      );

      populateModelFile(model, types as any, sourceFile, config, prismaOptions);

      sourceFile.formatText({
        indentSize: 2,
        convertTabsToSpaces: true,
        semicolons: SemicolonPreference.Remove,
      });
    });

    return project.save();
  },
});
