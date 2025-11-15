
import React from 'react';
import CalculatorCard from './components/CalculatorCard';

const App: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center p-4 font-sans">
      <CalculatorCard />
    </div>
  );
};

export default App;
