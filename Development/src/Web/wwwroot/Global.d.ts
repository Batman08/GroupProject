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

type PlayerDetailsSaveEventType = "gp_event_PlayerDetails_SaveSuccess";