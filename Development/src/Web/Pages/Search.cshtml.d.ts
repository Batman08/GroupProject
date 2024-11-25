type SearchParam = {
    CategoryId: number;
    Keyword: string;
}

type ModuleOptionDTO = {
    ModuleId: number;
    Name: string;
    Contents: string;
    Keywords: SearchParam[];
}

type ModuleOptionsDTO = {
    ModuleOptions: ModuleOptionDTO[];
}