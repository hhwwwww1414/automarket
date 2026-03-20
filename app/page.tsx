import { MarketplaceHeader } from '@/components/marketplace/header';
import { SearchPanel } from '@/components/marketplace/search-panel';
import { PopularBrands } from '@/components/marketplace/popular-brands';
import { Recommendations } from '@/components/marketplace/recommendations';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      <MarketplaceHeader />
      <main>
        <SearchPanel />
        <PopularBrands />
        <Recommendations />
        
        {/* Footer */}
        <footer className="py-8 border-t border-border bg-card">
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-teal-dark rounded-md flex items-center justify-center">
                  <span className="text-white font-bold text-sm">АС</span>
                </div>
                <span className="font-semibold text-foreground">АвтоСделка</span>
              </div>
              <p className="text-sm text-muted-foreground">
                © 2025 АвтоСделка. Все права защищены.
              </p>
            </div>
          </div>
        </footer>
      </main>
    </div>
  );
}
