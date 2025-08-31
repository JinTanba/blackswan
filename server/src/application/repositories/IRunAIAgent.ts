export interface IAIAgentRunnaer {
    load(params:any): Promise<void>;
    run(params:any): Promise<void>;
}