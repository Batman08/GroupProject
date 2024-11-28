type AuthorsModulesDTO = {
    AuthorsModules: AuthorsModuleDTO[];
}

type AuthorsModuleDTO = {
    ModuleId: number;
    ModulePosition: string;
    ModuleContent: string;
}

type CreateModuleDTO = {
    Content: string;
    PassChoiceText: string | null;
    PassChoiceResult: string | null;
    FailChoiceText: string | null;
    FailChoiceResult: string | null;
    Author: string;
    ModuleStatusTypeId: number;
    Keywords: number[];
    ModulePosition: string;
}

type EditModuleEventType = "gp_event_EditModule"
type EditModuleEvent = {
    ModuleId: number;
}