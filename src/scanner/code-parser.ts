import { Project, SourceFile, SyntaxKind } from 'ts-morph';
import { CodeStructure, ClassInfo, FunctionInfo, InterfaceInfo, ImportInfo } from '../types';
import * as path from 'path';

/**
 * Parses TypeScript files and extracts code structure information
 * Uses ts-morph library to analyze source files and extract classes, functions, interfaces, etc.
 */
export class CodeParser {
    private project: Project;

    /**
     * Creates a new CodeParser instance
     * Initializes a ts-morph Project with skipAddingFilesFromTsConfig set to true
     */
    constructor() {
        this.project = new Project({
            skipAddingFilesFromTsConfig: true,
        });
    }

    /**
     * Parses a TypeScript file and extracts its structure
     * @param filePath - The path to the TypeScript file to parse
     * @returns A CodeStructure object containing the parsed information
     */
    parseFile(filePath: string): CodeStructure {
        const absolutePath = path.resolve(filePath);
        let sourceFile = this.project.getSourceFile(absolutePath);

        if (!sourceFile) {
            sourceFile = this.project.addSourceFileAtPath(absolutePath);
        }

        return {
            file: path.basename(filePath),
            classes: this.getClasses(sourceFile),
            functions: this.getFunctions(sourceFile),
            interfaces: this.getInterfaces(sourceFile),
            imports: this.getImports(sourceFile),
            exports: this.getExports(sourceFile),
        };
    }

    /**
     * Extracts class information from a source file
     * @param sourceFile - The source file to analyze
     * @returns An array of ClassInfo objects
     * @private
     */
    private getClasses(sourceFile: SourceFile): ClassInfo[] {
        return sourceFile.getClasses().map(cls => ({
            name: cls.getName() || 'Anonymous',
            methods: cls.getMethods().map(m => m.getName()),
            properties: cls.getProperties().map(p => p.getName()),
        }));
    }

    /**
     * Extracts function information from a source file
     * @param sourceFile - The source file to analyze
     * @returns An array of FunctionInfo objects
     * @private
     */
    private getFunctions(sourceFile: SourceFile): FunctionInfo[] {
        return sourceFile.getFunctions().map(fn => ({
            name: fn.getName() || 'Anonymous',
            parameters: fn.getParameters().map(p => p.getName()),
            returnType: fn.getReturnType().getText(),
        }));
    }

    /**
     * Extracts interface information from a source file
     * @param sourceFile - The source file to analyze
     * @returns An array of InterfaceInfo objects
     * @private
     */
    private getInterfaces(sourceFile: SourceFile): InterfaceInfo[] {
        return sourceFile.getInterfaces().map(int => ({
            name: int.getName(),
            properties: int.getProperties().map(p => p.getName()),
        }));
    }

    /**
     * Extracts import information from a source file
     * @param sourceFile - The source file to analyze
     * @returns An array of ImportInfo objects
     * @private
     */
    private getImports(sourceFile: SourceFile): ImportInfo[] {
        return sourceFile.getImportDeclarations().map(imp => ({
            moduleSpecifier: imp.getModuleSpecifierValue(),
            namedImports: imp.getNamedImports().map(ni => ni.getName()),
            defaultImport: imp.getDefaultImport()?.getText(),
        }));
    }

    /**
     * Extracts export information from a source file
     * @param sourceFile - The source file to analyze
     * @returns An array of exported symbol names
     * @private
     */
    private getExports(sourceFile: SourceFile): string[] {
        const exports: string[] = [];
        sourceFile.getExportedDeclarations().forEach((decls, name) => {
            exports.push(name);
        });
        return exports;
    }
}
