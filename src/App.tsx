import MapView from './components/MapView';
import { Sidebar } from './components/Sidebar';
import { SITUM_CONFIG } from './config/constants';
import { useBuildingData } from './hooks/useBuildingData';
import { useBuildingStore } from './store/useBuildingStore';

function App() {
  const { isLoading, error } = useBuildingData(SITUM_CONFIG.BUILDING_ID);

  const building = useBuildingStore((state) => state.building);

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="flex flex-col items-center">
          <div className="mb-4 h-12 w-12 animate-spin rounded-full border-4 border-blue-500 border-t-transparent"></div>
          <p className="text-xl text-black">Loading building data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="max-w-md rounded-lg border border-red-200 bg-red-50 p-6 text-center">
          <h2 className="mb-2 text-xl font-semibold text-red-800">Error fetching building data</h2>
          <p className="text-red-600">{error}</p>
        </div>
      </div>
    );
  }

  if (!building) {
    return (
      <div className="flex h-screen items-center justify-center">
        <p className="text-xl text-black">No building data available</p>
      </div>
    );
  }

  return (
    <div className="flex h-screen flex-col">
      <header className="border-b bg-white px-4 py-4 shadow-sm">
        <h1 className="text-2xl font-bold text-gray-800">{building.name}</h1>
        {/* {building.address && <p className="text-sm text-gray-600">{building.address}</p>} */}
      </header>
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />
        <main className="h-full flex-1">
          <MapView />
        </main>
      </div>
    </div>
  );
}

export default App;
