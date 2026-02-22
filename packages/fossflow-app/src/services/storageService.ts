import { Model } from 'fossflow/dist/types';

export interface DiagramInfo {
  id: string;
  name: string;
  lastModified: Date;
  size?: number;
}

export interface StorageService {
  isAvailable(): Promise<boolean>;
  listDiagrams(): Promise<DiagramInfo[]>;
  loadDiagram(id: string): Promise<Model>;
  saveDiagram(id: string, data: Model): Promise<void>;
  deleteDiagram(id: string): Promise<void>;
  createDiagram(data: Model): Promise<string>;
}

// Server Storage Implementation
class ServerStorage implements StorageService {
  private baseUrl: string;
  private available: boolean | null = null;
  private availabilityCheckedAt: number | null = null;
  private readonly AVAILABILITY_CACHE_MS = 60000; // Re-check every 60 seconds

  constructor(baseUrl: string = '') {
    // In production (Docker), use relative paths (nginx proxy)
    // In development, use localhost:3001
    // For PHP migration, check if we are running in a PHP environment
    const isDevelopment = window.location.hostname === 'localhost' && window.location.port === '3000';
    const isPhpEnv = window.location.pathname.includes('.php') || window.location.port === '8000';
    
    if (baseUrl) {
      this.baseUrl = baseUrl;
    } else if (isPhpEnv) {
      this.baseUrl = ''; // Relative to current directory
    } else if (isDevelopment) {
      this.baseUrl = 'http://localhost:3001';
    } else {
      this.baseUrl = '';
    }
  }

  async isAvailable(): Promise<boolean> {
    // Re-check availability if cache is stale
    const now = Date.now();
    if (this.available !== null &&
        this.availabilityCheckedAt !== null &&
        (now - this.availabilityCheckedAt) < this.AVAILABILITY_CACHE_MS) {
      return this.available;
    }

    try {
      // Check if api.php exists or just try the status endpoint
      const statusUrl = this.baseUrl ? `${this.baseUrl}/api/storage/status` : 'api.php?action=status';
      
      const response = await fetch(statusUrl, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
        signal: AbortSignal.timeout(5000) // 5 second timeout
      });
      const data = await response.json();
      this.available = data.enabled;
      this.availabilityCheckedAt = Date.now();
      console.log(`Server storage availability: ${this.available}`);
      
      // If available and using PHP, update API paths
      if (this.available && !this.baseUrl) {
        this.isPhp = true;
      }

      return this.available ?? false;
    } catch (error) {
      console.log('Server storage not available:', error);
      this.available = false;
      this.availabilityCheckedAt = Date.now();
      return false;
    }
  }

  private isPhp = false;

  private getUrl(path: string, id: string = ''): string {
    if (this.isPhp) {
      if (path === 'status') return 'api.php?action=status';
      if (path === 'list') return 'api.php?action=list';
      if (path === 'get') return `api.php?id=${id}`;
      if (path === 'save') return `api.php?id=${id}`;
      if (path === 'delete') return `api.php?id=${id}&action=delete`;
      if (path === 'create') return 'api.php?action=create';
      return 'api.php';
    }
    
    // Original routes
    if (path === 'status') return `${this.baseUrl}/api/storage/status`;
    if (path === 'list') return `${this.baseUrl}/api/diagrams`;
    if (path === 'get') return `${this.baseUrl}/api/diagrams/${id}`;
    if (path === 'save') return `${this.baseUrl}/api/diagrams/${id}`;
    if (path === 'delete') return `${this.baseUrl}/api/diagrams/${id}`;
    if (path === 'create') return `${this.baseUrl}/api/diagrams`;
    return this.baseUrl;
  }

  async listDiagrams(): Promise<DiagramInfo[]> {
    const url = this.getUrl('list');
    console.log(`Fetching diagrams from: ${url}`);
    const response = await fetch(url);
    console.log(`Response status: ${response.status}`);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Failed to list diagrams:', errorText);
      throw new Error(`Failed to list diagrams: ${response.status} ${errorText}`);
    }

    const diagrams = await response.json();
    console.log(`Received ${diagrams.length} diagrams from server:`, diagrams);

    return diagrams.map((d: any) => ({
      ...d,
      lastModified: new Date(d.lastModified)
    }));
  }

  async loadDiagram(id: string): Promise<Model> {
    const url = this.getUrl('get', id);
    console.log(`ServerStorage: Loading diagram ${id} from ${url}`);
    try {
      const response = await fetch(url, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
        signal: AbortSignal.timeout(10000) // 10 second timeout
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error(`ServerStorage: Failed to load diagram ${id}: ${response.status} ${errorText}`);
        throw new Error(`Failed to load diagram: ${response.status} ${errorText}`);
      }

      const data = await response.json();
      console.log(`ServerStorage: Successfully loaded diagram ${id}, items: ${data.items?.length || 0}`);
      return data;
    } catch (error) {
      console.error(`ServerStorage: Error loading diagram ${id}:`, error);
      throw error;
    }
  }

  async saveDiagram(id: string, data: Model): Promise<void> {
    const url = this.getUrl('save', id);
    console.log(`ServerStorage: Saving diagram ${id} to ${url}`);
    try {
      const response = await fetch(url, {
        method: (this.isPhp ? 'POST' : 'PUT'),
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
        signal: AbortSignal.timeout(15000) // 15 second timeout for saves
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error(`ServerStorage: Failed to save diagram ${id}: ${response.status} ${errorText}`);
        throw new Error(`Failed to save diagram: ${response.status}`);
      }

      console.log(`ServerStorage: Successfully saved diagram ${id}`);
    } catch (error) {
      console.error(`ServerStorage: Error saving diagram ${id}:`, error);
      throw error;
    }
  }

  async deleteDiagram(id: string): Promise<void> {
    const url = this.getUrl('delete', id);
    const response = await fetch(url, {
      method: (this.isPhp ? 'POST' : 'DELETE')
    });
    if (!response.ok) throw new Error('Failed to delete diagram');
  }

  async createDiagram(data: Model): Promise<string> {
    const url = this.getUrl('create');
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    if (!response.ok) throw new Error('Failed to create diagram');
    const result = await response.json();
    return result.id;
  }
}

// Session Storage Implementation (existing functionality)
class SessionStorage implements StorageService {
  private readonly KEY_PREFIX = 'fossflow_diagram_';
  private readonly LIST_KEY = 'fossflow_diagrams';

  async isAvailable(): Promise<boolean> {
    return true; // Session storage is always available
  }

  async listDiagrams(): Promise<DiagramInfo[]> {
    const listStr = sessionStorage.getItem(this.LIST_KEY);
    if (!listStr) return [];
    
    const list = JSON.parse(listStr);
    return list.map((item: any) => ({
      ...item,
      lastModified: new Date(item.lastModified)
    }));
  }

  async loadDiagram(id: string): Promise<Model> {
    const data = sessionStorage.getItem(`${this.KEY_PREFIX}${id}`);
    if (!data) throw new Error('Diagram not found');
    return JSON.parse(data);
  }

  async saveDiagram(id: string, data: Model): Promise<void> {
    sessionStorage.setItem(`${this.KEY_PREFIX}${id}`, JSON.stringify(data));
    
    // Update list
    const list = await this.listDiagrams();
    const existing = list.findIndex(d => d.id === id);
    const info: DiagramInfo = {
      id,
      name: (data as any).name || 'Untitled Diagram',
      lastModified: new Date(),
      size: JSON.stringify(data).length
    };
    
    if (existing >= 0) {
      list[existing] = info;
    } else {
      list.push(info);
    }
    
    sessionStorage.setItem(this.LIST_KEY, JSON.stringify(list));
  }

  async deleteDiagram(id: string): Promise<void> {
    sessionStorage.removeItem(`${this.KEY_PREFIX}${id}`);
    
    // Update list
    const list = await this.listDiagrams();
    const filtered = list.filter(d => d.id !== id);
    sessionStorage.setItem(this.LIST_KEY, JSON.stringify(filtered));
  }

  async createDiagram(data: Model): Promise<string> {
    const id = `diagram_${Date.now()}`;
    await this.saveDiagram(id, data);
    return id;
  }
}

// Storage Manager - decides which storage to use
class StorageManager {
  private serverStorage: ServerStorage;
  private sessionStorage: SessionStorage;
  private activeStorage: StorageService | null = null;

  constructor() {
    this.serverStorage = new ServerStorage();
    this.sessionStorage = new SessionStorage();
  }

  async initialize(): Promise<StorageService> {
    // Try server storage first
    if (await this.serverStorage.isAvailable()) {
      console.log('Using server storage');
      this.activeStorage = this.serverStorage;
    } else {
      console.log('Using session storage');
      this.activeStorage = this.sessionStorage;
    }
    return this.activeStorage;
  }

  getStorage(): StorageService {
    if (!this.activeStorage) {
      throw new Error('Storage not initialized. Call initialize() first.');
    }
    return this.activeStorage;
  }

  isServerStorage(): boolean {
    return this.activeStorage === this.serverStorage;
  }
}

// Export singleton instance
export const storageManager = new StorageManager();