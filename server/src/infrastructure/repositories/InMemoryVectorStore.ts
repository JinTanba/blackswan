import { IVectorStore, InsuranceDocument } from "../../application/repositories/IVectorStore";
import { VectorStore } from "@langchain/core/vectorstores";
import { MemoryVectorStore } from "langchain/vectorstores/memory";
import { OpenAIEmbeddings } from "@langchain/openai";

export class InMemoryVectorStore implements IVectorStore {
  private vectorStore: MemoryVectorStore | null = null;
  private documents: InsuranceDocument[] = [];

  private async initializeVectorStore(): Promise<MemoryVectorStore> {
    if (!this.vectorStore) {
      const embeddings = new OpenAIEmbeddings({
        model: "text-embedding-3-small",
      });
      
      this.vectorStore = new MemoryVectorStore(embeddings);
    }
    return this.vectorStore;
  }

  async getVectorStore(name: string): Promise<VectorStore> {
    return this.initializeVectorStore();
  }

  async retrieve(query: string): Promise<InsuranceDocument[]> {
    if (this.documents.length === 0) {
      return [];
    }

    const vectorStore = await this.initializeVectorStore();
    
    try {
      const results = await vectorStore.similaritySearch(query, 5);
      return results.map(doc => ({
        ...doc,
        metadata: {
          source: doc.metadata.source || "",
        }
      })) as InsuranceDocument[];
    } catch (error) {
      console.error("Error during similarity search:", error);
      return this.documents.filter(doc => 
        doc.pageContent.toLowerCase().includes(query.toLowerCase())
      );
    }
  }

  async addDocuments(documents: InsuranceDocument[]): Promise<void> {
    this.documents.push(...documents);
    
    const vectorStore = await this.initializeVectorStore();
    await vectorStore.addDocuments(documents);
    
    console.log(`Added ${documents.length} documents to vector store`);
  }

  clear(): void {
    this.documents = [];
    this.vectorStore = null;
  }
}