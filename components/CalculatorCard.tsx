
import React, { useState, useEffect, useMemo } from 'react';
import { TradeDirection } from '../types';
import InputGroup from './InputGroup';
import { CalculatorIcon } from './icons/CalculatorIcon';

const CalculatorCard: React.FC = () => {
  const [totalCapital, setTotalCapital] = useState<string>('1000');
  const [riskPercentage, setRiskPercentage] = useState<string>('1');
  const [entryPrice, setEntryPrice] = useState<string>('');
  const [stopLossPrice, setStopLossPrice] = useState<string>('');
  const [tradeDirection, setTradeDirection] = useState<TradeDirection>(TradeDirection.LONG);
  const [leverage, setLeverage] = useState<string>('10');

  const [positionSize, setPositionSize] = useState<number | null>(null);
  const [margin, setMargin] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const capital = parseFloat(totalCapital);
    const risk = parseFloat(riskPercentage);
    const entry = parseFloat(entryPrice);
    const sl = parseFloat(stopLossPrice);
    const lev = parseInt(leverage, 10);

    if (!capital || !risk || !entry || !sl || !lev) {
      setPositionSize(null);
      setMargin(null);
      setError(null);
      return;
    }

    if (capital <= 0 || risk <= 0 || entry <= 0 || sl <= 0 || lev <= 0) {
      setError('Tất cả các giá trị phải là số dương.');
      setPositionSize(null);
      setMargin(null);
      return;
    }

    if (tradeDirection === TradeDirection.LONG && sl >= entry) {
      setError('Với lệnh LONG, giá dừng lỗ phải thấp hơn giá vào lệnh.');
      setPositionSize(null);
      setMargin(null);
      return;
    }

    if (tradeDirection === TradeDirection.SHORT && sl <= entry) {
      setError('Với lệnh SHORT, giá dừng lỗ phải cao hơn giá vào lệnh.');
      setPositionSize(null);
      setMargin(null);
      return;
    }

    setError(null);

    const riskAmount = (capital * risk) / 100;
    const priceDifference = Math.abs(entry - sl);
    
    if (priceDifference === 0) {
      setPositionSize(null);
      setMargin(null);
      return;
    }

    const calculatedPositionSize = riskAmount / priceDifference;
    const calculatedMargin = (calculatedPositionSize * entry) / lev;
    
    setPositionSize(calculatedPositionSize);
    setMargin(calculatedMargin);

  }, [totalCapital, riskPercentage, entryPrice, stopLossPrice, tradeDirection, leverage]);

  const riskAmount = useMemo(() => {
    const capital = parseFloat(totalCapital);
    const risk = parseFloat(riskPercentage);
    if (!isNaN(capital) && !isNaN(risk) && capital > 0 && risk > 0) {
      return (capital * risk) / 100;
    }
    return 0;
  }, [totalCapital, riskPercentage]);

  return (
    <div className="w-full max-w-md bg-gray-800 rounded-2xl shadow-lg p-6 md:p-8 space-y-6 border border-gray-700">
      <div className="text-center">
        <div className="flex items-center justify-center gap-3">
            <CalculatorIcon className="w-8 h-8 text-cyan-400" />
            <h1 className="text-2xl font-bold text-white">Tính khối lượng vào lệnh</h1>
        </div>
        <p className="text-gray-400 mt-2">Công cụ quản lý rủi ro cho nhà giao dịch Future.</p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <InputGroup
          label="Tổng vốn (USDT)"
          id="totalCapital"
          value={totalCapital}
          onChange={(e) => setTotalCapital(e.target.value)}
          placeholder="e.g., 1000"
        />
        <InputGroup
          label="% Rủi ro / lệnh"
          id="riskPercentage"
          value={riskPercentage}
          onChange={(e) => setRiskPercentage(e.target.value)}
          placeholder="e.g., 1"
          unit="%"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">Loại lệnh</label>
        <div className="grid grid-cols-2 gap-2 rounded-lg bg-gray-900 p-1">
          <button
            onClick={() => setTradeDirection(TradeDirection.LONG)}
            className={`px-4 py-2 text-sm font-semibold rounded-md transition-colors duration-200 ${
              tradeDirection === TradeDirection.LONG ? 'bg-green-500 text-white' : 'text-gray-300 hover:bg-gray-700'
            }`}
          >
            LONG
          </button>
          <button
            onClick={() => setTradeDirection(TradeDirection.SHORT)}
            className={`px-4 py-2 text-sm font-semibold rounded-md transition-colors duration-200 ${
              tradeDirection === TradeDirection.SHORT ? 'bg-red-500 text-white' : 'text-gray-300 hover:bg-gray-700'
            }`}
          >
            SHORT
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <InputGroup
          label="Giá vào lệnh"
          id="entryPrice"
          value={entryPrice}
          onChange={(e) => setEntryPrice(e.target.value)}
          placeholder="e.g., 50000"
        />
        <InputGroup
          label="Giá dừng lỗ"
          id="stopLossPrice"
          value={stopLossPrice}
          onChange={(e) => setStopLossPrice(e.target.value)}
          placeholder={tradeDirection === TradeDirection.LONG ? 'e.g., 49500' : 'e.g., 50500'}
        />
      </div>

      <InputGroup
        label="Đòn bẩy"
        id="leverage"
        value={leverage}
        onChange={(e) => setLeverage(e.target.value)}
        placeholder="e.g., 10"
        unit="x"
      />
      
      {error && (
        <div className="bg-red-900/50 border border-red-700 text-red-300 text-sm rounded-lg p-3 text-center">
            {error}
        </div>
      )}

      <div className="bg-gray-900 rounded-lg p-4 space-y-4 border border-gray-700">
        <h2 className="text-lg font-semibold text-center text-cyan-400">Kết quả tính toán</h2>
        <div className="text-center space-y-2">
            <p className="text-gray-400">Số tiền rủi ro</p>
            <p className="text-2xl font-bold text-red-500">
                {riskAmount > 0 ? `$${riskAmount.toFixed(2)}` : '$0.00'}
            </p>
        </div>
        <div className="grid grid-cols-2 gap-4 pt-2 border-t border-gray-700">
            <div className="text-center">
                <p className="text-sm text-gray-400 mb-1">Khối lượng (Coin)</p>
                <p className="text-xl font-bold text-white">
                  {positionSize !== null && positionSize > 0 ? positionSize.toFixed(4) : '—'}
                </p>
            </div>
            <div className="text-center">
                <p className="text-sm text-gray-400 mb-1">Ký quỹ (Margin)</p>
                <p className="text-xl font-bold text-white">
                    {margin !== null && margin > 0 ? `$${margin.toFixed(2)}` : '—'}
                </p>
            </div>
        </div>
      </div>
    </div>
  );
};

export default CalculatorCard;
