type UsedModulesDTO = string[];

type ModuleDTO = {
    ModuleId: number;
    Contents: string;
    PassChoiceText: string;
    PassChoiceResult: string;
    FailChoiceText: string;
    FailChoiceResult: string;
}

type MiddleModuleResponseDTO = {
    MiddleModule: ModuleDTO;
}

type EndModuleResponseDTO = {
    EndModule: ModuleDTO;
}

type ModuleChoiceSelectedEventType = "gp_event_ModuleChoice_Selected"
type ModuleChoiceSelectedEvent = {
    ChoiceType: string;
    ChoiceResult: string;
}

type ModuleChoicePassBtnContinueEventType = "gp_event_ModuleChoicePass_BtnContinue"
type ModuleChoicePassBtnContinueEvent = {
    PassModal: bootstrap.Modal;
}

type EndModuleEventType = "gp_event_EndModule"
type EndModuleEvent = {
    EndModuleText: string;
}