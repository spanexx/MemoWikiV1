"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.CodeParser = void 0;
const ts_morph_1 = require("ts-morph");
const path = __importStar(require("path"));
/**
 * Parses TypeScript files and extracts code structure information
 * Uses ts-morph library to analyze source files and extract classes, functions, interfaces, etc.
 */
class CodeParser {
    project;
    /**
     * Creates a new CodeParser instance
     * Initializes a ts-morph Project with skipAddingFilesFromTsConfig set to true
     */
    constructor() {
        this.project = new ts_morph_1.Project({
            skipAddingFilesFromTsConfig: true,
        });
    }
    /**
     * Parses a TypeScript file and extracts its structure
     * @param filePath - The path to the TypeScript file to parse
     * @returns A CodeStructure object containing the parsed information
     */
    parseFile(filePath) {
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
    getClasses(sourceFile) {
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
    getFunctions(sourceFile) {
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
    getInterfaces(sourceFile) {
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
    getImports(sourceFile) {
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
    getExports(sourceFile) {
        const exports = [];
        sourceFile.getExportedDeclarations().forEach((decls, name) => {
            exports.push(name);
        });
        return exports;
    }
}
exports.CodeParser = CodeParser;
