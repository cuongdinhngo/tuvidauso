import { lazy, Suspense } from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/layout/Layout';
import HomePage from './pages/HomePage';
import InputPage from './pages/InputPage';
import ResultPage from './pages/ResultPage';
import ErrorBoundary from './components/shared/ErrorBoundary';

const ComparePage = lazy(() => import('./pages/compare/ComparePage'));
const AddPersonPage = lazy(() => import('./pages/compare/AddPersonPage'));
const CompareResultPage = lazy(() => import('./pages/compare/CompareResultPage'));
const CompareRankingPage = lazy(() => import('./pages/compare/CompareRankingPage'));

function LoadingFallback() {
  return <div className="flex justify-center items-center py-20 text-gray-500">Đang tải...</div>;
}

export default function App() {
  return (
    <ErrorBoundary>
      <HashRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<HomePage />} />
            <Route path="input" element={<InputPage />} />
            <Route path="result" element={<ResultPage />} />
            <Route path="compare" element={<Suspense fallback={<LoadingFallback />}><ComparePage /></Suspense>} />
            <Route path="compare/add" element={<Suspense fallback={<LoadingFallback />}><AddPersonPage /></Suspense>} />
            <Route path="compare/result/:id" element={<Suspense fallback={<LoadingFallback />}><CompareResultPage /></Suspense>} />
            <Route path="compare/ranking" element={<Suspense fallback={<LoadingFallback />}><CompareRankingPage /></Suspense>} />
          </Route>
        </Routes>
      </HashRouter>
    </ErrorBoundary>
  );
}
