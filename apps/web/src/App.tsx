import { type ReactNode } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ErrorBoundary } from '@/components/error-boundary';
import { ErrorBoundaryTestScreen } from '@/components/error-boundary-test-screen';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';
import NotFound from '@/pages/not-found';
import Home from '@/pages/home';
import HowItWorks from '@/pages/how-it-works';
import Signup from '@/pages/signup';
import Explore from '@/pages/explore';
import ExploreDetail from '@/pages/explore-detail';
import Ask from '@/pages/ask';
import StaleChat from '@/pages/stale-chat';
import { PageMetadata } from '@/components/page-metadata';
import {
  Route,
  Switch,
  useLocation,
  Router as WouterRouter,
} from 'wouter';

const queryClient = new QueryClient();

function Router() {
  return (
    // Keep a shared shell (sidebar, navbar) outside the boundary so it
    // survives a page crash.
    <RoutedErrorBoundary>
      <Switch>
        <Route path="/" component={Home} />
        <Route path="/how-it-works" component={HowItWorks} />
        <Route path="/signup" component={Signup} />
        <Route path="/explore" component={Explore} />
        <Route path="/explore/:slug" component={ExploreDetail} />
        <Route path="/ask" component={Ask} />
        <Route path="/chat/:id" component={StaleChat} />
        {import.meta.env.MODE === 'test' ? (
          <Route
            path="/__test/error-boundary"
            component={ErrorBoundaryTestScreen}
          />
        ) : null}
        <Route component={NotFound} />
      </Switch>
    </RoutedErrorBoundary>
  );
}

function RoutedErrorBoundary({ children }: { children: ReactNode }) {
  const [location] = useLocation();
  return <ErrorBoundary resetKey={location}>{children}</ErrorBoundary>;
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, '')}>
          <PageMetadata />
          <Router />
        </WouterRouter>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
