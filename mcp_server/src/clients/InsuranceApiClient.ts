import { 
  InsuranceCard, 
  InsuranceStatus,
  CreateInsuranceCardRequest,
  UpdateInsuranceCardRequest,
  CreateInsuranceCardResponse,
  UpdateInsuranceCardResponse,
  ClaimInsuranceResponse,
  HealthResponse 
} from '../types/insurance.js';

interface SearchInsuranceCardsData {
  queries: string[];
}

interface UpdateInsuranceStatusData {
  status: InsuranceStatus;
}

export class InsuranceApiClient {
  private baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`HTTP ${response.status}: ${errorText}`);
    }

    return response.json() as Promise<T>;
  }

  async createInsuranceCard(data: CreateInsuranceCardRequest): Promise<CreateInsuranceCardResponse> {
    return this.request<CreateInsuranceCardResponse>('/api/insurance-cards', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async getInsuranceCard(id: string): Promise<InsuranceCard> {
    return this.request<InsuranceCard>(`/api/insurance-cards/${id}`, {
      method: 'GET',
    });
  }

  async updateInsuranceCard(id: string, data: UpdateInsuranceCardRequest): Promise<UpdateInsuranceCardResponse> {
    return this.request<UpdateInsuranceCardResponse>(`/api/insurance-cards/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async searchInsuranceCards(data: SearchInsuranceCardsData): Promise<InsuranceCard[]> {
    return this.request<InsuranceCard[]>('/api/insurance-cards/search', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateInsuranceStatus(id: string, data: UpdateInsuranceStatusData): Promise<UpdateInsuranceCardResponse> {
    return this.request<UpdateInsuranceCardResponse>(`/api/insurance-cards/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  }

  async claimInsurance(id: string): Promise<ClaimInsuranceResponse> {
    return this.request<ClaimInsuranceResponse>(`/api/insurance-cards/${id}/claim`, {
      method: 'POST',
    });
  }

  async healthCheck(): Promise<HealthResponse> {
    return this.request<HealthResponse>('/health', {
      method: 'GET',
    });
  }
}