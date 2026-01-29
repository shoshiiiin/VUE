export interface GenerationEvent {
  id: string;
  templateName: string;
  timestamp: number;
  imageUrl: string; // Data URL
  templateId: string;
}

export type GeneratedImage = GenerationEvent;

const DB_NAME = "ProductStudioDB";
const DB_VERSION = 1;
const STORE_NAME = "generations";

// Helper to open DB
const openDB = (): Promise<IDBDatabase> => {
    return new Promise((resolve, reject) => {
        if (typeof window === "undefined") {
            reject(new Error("No window"));
            return;
        }
        const request = window.indexedDB.open(DB_NAME, DB_VERSION);

        request.onerror = () => reject(request.error);
        request.onsuccess = () => resolve(request.result);

        request.onupgradeneeded = (event) => {
            const db = (event.target as IDBOpenDBRequest).result;
            if (!db.objectStoreNames.contains(STORE_NAME)) {
                const store = db.createObjectStore(STORE_NAME, { keyPath: "id" });
                store.createIndex("timestamp", "timestamp", { unique: false });
            }
        };
    });
};

export const saveGeneration = async (event: GenerationEvent): Promise<void> => {
  try {
      const db = await openDB();
      return new Promise((resolve, reject) => {
          const transaction = db.transaction([STORE_NAME], "readwrite");
          const store = transaction.objectStore(STORE_NAME);
          const request = store.add(event);

          request.onsuccess = () => resolve();
          request.onerror = () => reject(request.error);
      });
  } catch (err) {
      console.error("Failed to save to IndexedDB", err);
      throw err;
  }
};

export const getHistory = async (): Promise<GenerationEvent[]> => {
  try {
      const db = await openDB();
      return new Promise((resolve, reject) => {
          const transaction = db.transaction([STORE_NAME], "readonly");
          const store = transaction.objectStore(STORE_NAME);
          const index = store.index("timestamp");
          // Get all, but usually we want reverse order.
          // IDB is sorted ascending by default. We'll reverse in memory for simplicity 
          // (dataset size < 1000 usually)
          const request = index.getAll();

          request.onsuccess = () => {
              const results = request.result as GenerationEvent[];
              resolve(results.reverse()); // Newest first
          };
          request.onerror = () => reject(request.error);
      });
  } catch (err) {
      console.error("Failed to get history", err);
      return [];
  }
};

export const deleteItems = async (ids: string[]): Promise<GenerationEvent[]> => {
    try {
        const db = await openDB();
        await new Promise<void>((resolve, reject) => {
            const transaction = db.transaction([STORE_NAME], "readwrite");
            const store = transaction.objectStore(STORE_NAME);
            
            let completed = 0;
            if (ids.length === 0) resolve();

            ids.forEach(id => {
                const request = store.delete(id);
                request.onsuccess = () => {
                    completed++;
                    if (completed === ids.length) resolve();
                }
                request.onerror = () => reject(request.error);
            });
        });
        return getHistory();
    } catch (err) {
        console.error("Failed to delete items", err);
        return getHistory();
    }
}

export const getStats = async () => {
    const history = await getHistory();
    const count = history.length;
    
    // 1. Financial Savings: $50 per photo market rate
    const savings = count * 50;
    
    // 2. Time Efficiency: 20 minutes per photo saved
    const timeMinutes = count * 20;
    const timeSavedHours = (timeMinutes / 60).toFixed(1);
    
    // 3. Top Style
    const styleCounts: Record<string, number> = {};
    history.forEach(h => {
        styleCounts[h.templateName] = (styleCounts[h.templateName] || 0) + 1;
    });
    
    let topStyle = "N/A";
    let maxCount = 0;
    
    Object.entries(styleCounts).forEach(([name, c]) => {
        if (c > maxCount) {
            maxCount = c;
            topStyle = name;
        }
    });
    
    // 4. Activity (Last 7 days) 
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 6);
    sevenDaysAgo.setHours(0,0,0,0);
    
    const activityData = Array(7).fill(0);
    history.forEach(h => {
        const date = new Date(h.timestamp);
        if (date >= sevenDaysAgo) {
            const dayDiff = Math.floor((date.getTime() - sevenDaysAgo.getTime()) / (1000 * 60 * 60 * 24));
            if (dayDiff >= 0 && dayDiff < 7) {
                activityData[dayDiff]++;
            }
        }
    });

    // 5. Category Mix
    const categoryMix = {
        Studio: 0,
        Lifestyle: 0,
        Creative: 0
    };
    
    history.forEach(h => {
        const name = h.templateName.toLowerCase();
        if (name.includes("lifestyle") || name.includes("street") || name.includes("cafe") || name.includes("pool")) {
            categoryMix.Lifestyle++;
        } else if (name.includes("neon") || name.includes("creative") || name.includes("flatlay")) {
            categoryMix.Creative++;
        } else {
            categoryMix.Studio++;
        }
    });

    // 6. Sustainability Score
    const co2SavedKg = (count * 0.5).toFixed(1);

    return {
        count,
        savings,
        timeSavedHours,
        topStyle,
        activityData,
        categoryMix,
        co2SavedKg
    }
}
