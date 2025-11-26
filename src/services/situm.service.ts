import Situm from '@situm/sdk-js';

class SitumService {
  private sdk: Situm;
  private initialized = false;

  constructor() {
    const apiKey = import.meta.env.VITE_SITUM_API_KEY;
    if (!apiKey) {
      throw new Error('Missing Situm API key. Set VITE_SITUM_API_KEY in your environment.');
    }

    this.sdk = new Situm({
      auth: {
        apiKey,
      },
    });
  }

  async initialize(): Promise<void> {
    if (this.initialized) return;

    try {
      this.initialized = true;
    } catch (error) {
      console.error('Failed to initialize Situm SDK:', error);
      throw error;
    }
  }

  async getBuildingInfo(buildingId: number) {
    try {
      const building = await this.sdk.cartography.getBuildingById(buildingId);
      return building;
    } catch (error) {
      console.error('Failed to fetch building info:', error);
      throw error;
    }
  }

  async getFloors(buildingId: number) {
    try {
      const floors = await this.sdk.cartography.getFloors({ buildingId });
      return floors;
    } catch (error) {
      console.error('Failed to fetch floors:', error);
      throw error;
    }
  }

  async getPOIs(buildingId: number) {
    try {
      const pois = await this.sdk.cartography.getPois({ buildingId });
      return pois;
    } catch (error) {
      console.error('Failed to fetch POIs:', error);
      throw error;
    }
  }

  async getBuildingData(buildingId: number) {
    try {
      const [building, floors, pois] = await Promise.all([
        this.getBuildingInfo(buildingId),
        this.getFloors(buildingId),
        this.getPOIs(buildingId),
      ]);

      return {
        building,
        floors,
        pois,
      };
    } catch (error) {
      console.error('Failed to fetch building data:', error);
      throw error;
    }
  }
}

export const situmService = new SitumService();
