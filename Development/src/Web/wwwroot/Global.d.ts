type GeneratedKeywordDTO = {
    CategoryId: number;
    Keyword: string;
}

type GeneratedKeywordsDTO = {
    KeywordsData: GeneratedKeywordDTO[];
}

type PlayerDetailsDTO = {
    Name: string;
    Pronoun: string;
}

type AuthorDTO = {
    Author: string;
}

type KeywordItemDTO = {
    KeywordId: number;
    Name: string;
}

type PlayerDetailsSaveEventType = "gp_event_PlayerDetails_SaveSuccess";

type ResponseDTO<T> = {
    Success: boolean;         // Indicates if the operation was successful
    Error: boolean;           // Derived property: true if not successful
    Message: string;          // Message for the operation's outcome
    Data: T;                  // The payload of the response
};