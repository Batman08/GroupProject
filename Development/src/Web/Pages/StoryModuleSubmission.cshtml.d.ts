type AuthorsModulesDTO = {
    AuthorsModules: AuthorsModuleDTO[];
}


type AuthorsModuleDTO = {
    ModuleId: number;
    ModulePosition: string;
    ModuleContent: string;
}

type EditModuleEventType = "gp_event_EditModule"
type EditModuleEvent = {
    ModuleId: number;
}