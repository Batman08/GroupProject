type UsedModulesDTO = string[];

type MiddleModuleDTO = {
    ModuleId: number;
    Name: string;
    Contents: string;
    PassChoiceText: string;
    PassChoiceResult: string;
    FailChoiceText: string;
    FailChoiceResult: string;
}

type MiddleModuleResponseDTO = {
    MiddleModule: MiddleModuleDTO;
}

type ModuleChoiceSelectedEventType = "gp_event_ModuleChoice_Selected"
type ModuleChoiceSelectedEvent = {
    ChoiceType: string;
    ChoiceResult: string;
}