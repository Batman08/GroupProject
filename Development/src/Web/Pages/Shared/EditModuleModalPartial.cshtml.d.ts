﻿type AuthorsFullModuleDTO = {
    ModuleId: number;
    Content: string;
    PassChoiceText: string;
    PassChoiceResult: string;
    FailChoiceText: string;
    FailChoiceResult: string;
    ModulePosition: KeywordItemDTO;
    KeywordItems: KeywordItemDTO[];
}