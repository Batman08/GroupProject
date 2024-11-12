type ModuleOptionDTO = {
    ModuleId: number;
    Name: string;
    Overview: string;
    Keywords: string[];
}

type ModuleOptionsDTO = {
    ModuleOptions: ModuleOptionDTO[];
}