export interface ReposModel {
    name: string;
    description: string;
    language: string;
    stargazers_count: number;
    rep_type: string;
    updated_at: Date;
    fork: boolean;
    mirror_url: string;
    archived: boolean;
    topics: string[];
}

export interface FilterRow {
    key: string;
    value: string;
}