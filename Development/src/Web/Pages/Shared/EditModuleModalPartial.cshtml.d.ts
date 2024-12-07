type AuthorsFullModuleDTO = {
    ModuleId: number;
    Content: string;
    PassChoiceText: string;
    PassChoiceResult: string;
    FailChoiceText: string;
    FailChoiceResult: string;
    ModulePosition: KeywordItemDTO;
    KeywordItems: KeywordItemDTO[];
}

type UpdateModuleDTO = {
    ModuleId: number;
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

type ModuleUpdatedSuccessEventType = "gp_event_UpdateModuleSuccess"
type ModuleUpdatedSuccessEvent = {
    ModuleData: AuthorsModuleDTO;

}