import { useEffect, useState } from 'react'
import { supabase } from './supabaseClient'
import RecoveryChart from './RecoveryChart'

function App() {
  const [allData, setAllData] = useState([])
  const [streamedData, setStreamedData] = useState([])

  useEffect(() => {
    async function getWhoopData() {
      const { data, error } = await supabase
        .from('whoop_data')
        .select('"Cycle start time", "Recovery score %", "Heart rate variability (ms)"')
        .not('"Recovery score %"', 'is', null)
        .order('Cycle start time', { ascending: true }) // Ensure chronological order
        .limit(50)
      
      if (error) console.error('Error fetching:', error)
      else setAllData(data)
    }

    getWhoopData()
  }, [])

  useEffect(() => {
    if (allData.length === 0) return;

    let index = 0;
    const interval = setInterval(() => {
      if (index < allData.length) {
        // We "ingest" one new data point at a time
        setStreamedData(prev => [...prev, allData[index]]);
        index++;
      } else {
        clearInterval(interval);
      }
    }, 500); // New data arrives every 500ms

    return () => clearInterval(interval);
  }, [allData]);

  return (
    <div style={{ backgroundColor: '#000', minHeight: '100vh', padding: '40px', color: 'white' }}>
      <h1>WHOOP Performance Engine</h1>
      <p>Simulating asynchronous biometric data ingestion...</p>
      
      {/* Pass the streamedData instead of allData */}
      <RecoveryChart data={streamedData} />
      
      <div style={{ marginTop: '20px', color: '#666' }}>
        Points ingested: {streamedData.length} / {allData.length}
      </div>
    </div>
  )
}

export default App

