// import { Pinecone } from "@pinecone-database/pinecone";

// import { OpenAIEmbeddings } from "@langchain/openai";

// import { PineconeStore } from "@langchain/pinecone";
import { Document } from "@langchain/core/documents";
import { VectorStore } from "@langchain/core/vectorstores";

export interface InsuranceDocument extends Document {
    metadata: {
        source: string;
    }
}

export interface IVectorStore {
    getVectorStore(name: string): Promise<VectorStore>;
    retrieve(query: string): Promise<InsuranceDocument[]>;
    addDocuments(documents: InsuranceDocument[]): Promise<void>;
}
