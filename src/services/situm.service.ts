import Situm, { type Building, type Floor, type Poi, type PoiCategory } from '@situm/sdk-js';

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

  async getBuildingInfo(buildingId: number): Promise<Building> {
    try {
      const building = await this.sdk.cartography.getBuildingById(buildingId);
      return building;
    } catch (error) {
      console.error('Failed to fetch building info:', error);
      throw error;
    }
  }

  async getFloors(buildingId: number): Promise<Floor[]> {
    try {
      const floors = await this.sdk.cartography.getFloors({ buildingId });
      // Adjust property name to match expected format
      return floors.map((floor) => ({
        ...floor,
        maps: {
          ...floor.maps,
          /* eslint-disable  @typescript-eslint/no-explicit-any */
          map_url: (floor.maps as any).mapUrl,
        },
      }));
    } catch (error) {
      console.error('Failed to fetch floors:', error);
      throw error;
    }
  }

  async getPOIs(buildingId: number): Promise<Poi[]> {
    try {
      const pois = await this.sdk.cartography.getPois({ buildingId });
      return pois;
    } catch (error) {
      console.error('Failed to fetch POIs:', error);
      throw error;
    }
  }

  async getPOICategories(): Promise<PoiCategory[]> {
    const categories = await this.sdk.cartography.getPoiCategories();
    return categories;
  }

  async getBuildingData(
    buildingId: number
  ): Promise<{ building: Building; floors: Floor[]; pois: Poi[]; categories: PoiCategory[] }> {
    try {
      const [building, floors, pois, categories] = await Promise.all([
        this.getBuildingInfo(buildingId),
        this.getFloors(buildingId),
        this.getPOIs(buildingId),
        this.getPOICategories(),
      ]);

      return {
        building,
        floors,
        pois,
        categories,
      };
    } catch (error) {
      console.error('Failed to fetch building data:', error);
      throw error;
    }
  }
}

export const situmService = new SitumService();
