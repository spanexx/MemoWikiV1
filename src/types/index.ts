/**
 * Represents the status of a git repository
 * Contains information about modified, created, deleted, and renamed files
 */
export interface GitStatus {
    /** Files that have been modified */
    modified: string[];
    
    /** Files that have been created */
    created: string[];
    
    /** Files that have been deleted */
    deleted: string[];
    
    /** Files that have been renamed */
    renamed: { from: string; to: string }[];
}

/**
 * Represents the complete git state of a repository
 * Includes status, diff, and recent commit information
 */
export interface GitState {
    /** The current status of the repository */
    status: GitStatus;
    
    /** The current diff of the repository */
    diff: string;
    
    /** Information about the most recent commit, or null if no commits exist */
    recentCommit: {
        /** The commit hash */
        hash: string;
        
        /** The commit date */
        date: string;
        
        /** The commit message */
        message: string;
        
        /** The author's name */
        author_name: string;
    } | null;
}

/**
 * Represents the structure of a code file
 * Contains information about classes, functions, interfaces, imports, and exports
 */
export interface CodeStructure {
    /** The name of the file */
    file: string;
    
    /** Array of class information */
    classes: ClassInfo[];
    
    /** Array of function information */
    functions: FunctionInfo[];
    
    /** Array of interface information */
    interfaces: InterfaceInfo[];
    
    /** Array of import information */
    imports: ImportInfo[];
    
    /** Array of exported symbols */
    exports: string[];
}

/**
 * Represents information about a class in a code file
 */
export interface ClassInfo {
    /** The name of the class */
    name: string;
    
    /** Array of method names in the class */
    methods: string[];
    
    /** Array of property names in the class */
    properties: string[];
}

/**
 * Represents information about a function in a code file
 */
export interface FunctionInfo {
    /** The name of the function */
    name: string;
    
    /** Array of parameter names */
    parameters: string[];
    
    /** The return type of the function */
    returnType: string;
}

/**
 * Represents information about an interface in a code file
 */
export interface InterfaceInfo {
    /** The name of the interface */
    name: string;
    
    /** Array of property names in the interface */
    properties: string[];
}

/**
 * Represents information about an import declaration in a code file
 */
export interface ImportInfo {
    /** The module specifier (e.g., 'fs', './utils') */
    moduleSpecifier: string;
    
    /** Array of named imports (e.g., ['readFile', 'writeFile']) */
    namedImports: string[];
    
    /** The default import, if any */
    defaultImport?: string;
}
