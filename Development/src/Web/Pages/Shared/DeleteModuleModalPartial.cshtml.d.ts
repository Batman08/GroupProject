type DeleteModuleDTO = {
    ModuleId: number;
    Author: string;
}

type OpenDeleteModuleModalEventType = "gp_event_OpenDeleteModuleModal"
type OpenDeleteModuleModalEvent = {
    ModuleId: number;
    EdiModulePanelEl: HTMLDivElement;
}

type ModuleDeletedSuccessEventType = "gp_event_ModuleDeletedSuccess"
type ModuleDeletedSuccessEvent = {
    ModuleId: number;
    EdiModulePanelEl: HTMLDivElement;
}