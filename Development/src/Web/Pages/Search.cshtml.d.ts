type ModuleSearchKeywordsDTO = {
    Keywords: string[];
};

type ModuleOptionDTO = {
    ModuleId: number;
    Name: string;
    Contents: string;
    Keywords: string;
}

type ModuleOptionsDTO = {
    ModuleOptions: ModuleOptionDTO[];
}