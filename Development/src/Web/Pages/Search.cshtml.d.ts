type SearchParam = {
    CategoryId: number;
    Keyword: string;
}

type ModuleOptionDTO = {
    ModuleId: number;
    Contents: string;
    Keywords: SearchParam[];
}

type ModuleOptionsDTO = {
    ModuleOptions: ModuleOptionDTO[];
}