import { useState, useEffect } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import confetti from 'canvas-confetti';

export default function SalamiTracker() {
  const [salamiList, setSalamiList] = useState(() => {
    const saved = localStorage.getItem('salamiData');
    return saved ? JSON.parse(saved) : [];
  });
  const [name, setName] = useState('');
  const [amount, setAmount] = useState('');
  const [status, setStatus] = useState('Received');
  
  const [showQR, setShowQR] = useState(false);
  const [bkashNumber, setBkashNumber] = useState('');

  useEffect(() => {
    localStorage.setItem('salamiData', JSON.stringify(salamiList));
  }, [salamiList]);

  const addSalami = (e) => {
    e.preventDefault();
    if (!name || !amount) return;
    
    const newEntry = { id: Date.now(), name, amount: Number(amount), status };
    setSalamiList([...salamiList, newEntry]);
    setName('');
    setAmount('');

    if (status === 'Received') {
      confetti({
        particleCount: 150,
        spread: 80,
        origin: { y: 0.6 },
        colors: ['#22c55e', '#ffffff', '#eab308'],
        zIndex: 1000
      });
    }
  };

  const totalReceived = salamiList
    .filter(item => item.status === 'Received')
    .reduce((sum, item) => sum + item.amount, 0);

  const totalPending = salamiList
    .filter(item => item.status === 'Pending')
    .reduce((sum, item) => sum + item.amount, 0);

  return (
    <div className="min-h-screen bg-gray-100 p-6 font-sans">
      <div className="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden p-6">
        
        <h1 className="text-3xl font-bold text-center text-green-600 mb-2">💰 Salami Tracker</h1>
        <p className="text-center text-gray-500 mb-6">Eid Mubarak! Time to collect.</p>

        <div className="flex justify-between bg-green-50 p-4 rounded-lg mb-6">
          <div className="text-center">
            <p className="text-sm text-gray-500">Total Received</p>
            <p className="text-2xl font-bold text-green-600">৳{totalReceived}</p>
          </div>
          <div className="text-center">
            <p className="text-sm text-gray-500">Pending (Claim ASAP)</p>
            <p className="text-2xl font-bold text-orange-500">৳{totalPending}</p>
          </div>
        </div>

        <form onSubmit={addSalami} className="mb-6 flex flex-col gap-3">
          <input type="text" placeholder="Relative's Name (e.g., Khalu)" className="border p-2 rounded" 
                 value={name} onChange={(e) => setName(e.target.value)} />
          <input type="number" placeholder="Amount (৳)" className="border p-2 rounded" 
                 value={amount} onChange={(e) => setAmount(e.target.value)} />
          <select className="border p-2 rounded" value={status} onChange={(e) => setStatus(e.target.value)}>
            <option value="Received">Received 🎉</option>
            <option value="Pending">Pending ⏳</option>
          </select>
          <button type="submit" className="bg-green-600 text-white font-bold py-2 rounded hover:bg-green-700 transition">
            Log Salami
          </button>
        </form>

        <div className="border-t pt-4 mb-6">
          <button 
            onClick={() => setShowQR(!showQR)}
            className="w-full bg-blue-600 text-white font-bold py-2 rounded hover:bg-blue-700 transition"
          >
            {showQR ? "Hide Eidi-Gen QR" : "Generate Eidi-Gen QR 📲"}
          </button>
          
          {showQR && (
            <div className="mt-4 flex flex-col items-center bg-blue-50 p-4 rounded-lg">
              <p className="text-sm font-bold text-blue-800 mb-2">Scan to get bKash/Nagad number!</p>
              <QRCodeSVG value={`${bkashNumber}`} size={150} />
              <input 
                type="text" 
                placeholder="Enter your bKash Number" 
                className="mt-4 border p-1 rounded text-center text-sm w-full"
                value={bkashNumber}
                onChange={(e) => setBkashNumber(e.target.value)}
              />
            </div>
          )}
        </div>

        <div>
          <h2 className="text-xl font-bold mb-3 border-b pb-2">The Ledger</h2>
          {salamiList.length === 0 ? <p className="text-gray-400 text-center">No salami yet. Go visit your grandparents!</p> : (
            <ul className="space-y-2">
              {salamiList.map((item) => (
                <li key={item.id} className="flex justify-between items-center bg-gray-50 p-3 rounded border">
                  <span className="font-semibold">{item.name}</span>
                  <div className="flex items-center gap-3">
                    <span className="font-bold">৳{item.amount}</span>
                    <span className={`text-xs px-2 py-1 rounded-full ${item.status === 'Received' ? 'bg-green-200 text-green-800' : 'bg-orange-200 text-orange-800'}`}>
                      {item.status}
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}