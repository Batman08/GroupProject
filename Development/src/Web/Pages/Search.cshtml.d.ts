type SearchParam = {
    CategoryId: number;
    Keyword: string;
}

type ModuleOptionDTO = {
    ModuleId: number;
    Name: string;
    Overview: string;
    Keywords: SearchParam[];
}

type ModuleOptionsDTO = {
    ModuleOptions: ModuleOptionDTO[];
}