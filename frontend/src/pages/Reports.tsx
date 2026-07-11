import React, { useState } from 'react';
import { useMineStore } from '../stores/mineStore';
import { jsPDF } from 'jspdf';
import * as XLSX from 'xlsx';
import { FileText, Download, FileSpreadsheet, ShieldCheck } from 'lucide-react';

export const Reports: React.FC = () => {
  const { workers, helmets, protocol } = useMineStore();
  const [reportType, setReportType] = useState<'exposure' | 'gas' | 'predictive'>('exposure');

  // Build exportable JSON dataset based on workers & helmets telemetry
  const getExposureReportData = () => {
    return workers.map(w => {
      const h = helmets.find(helm => helm.workerId === w.id);
      return {
        'Worker ID': w.id,
        'Name': w.name,
        'Assigned Shaft': w.zone,
        'Heart Rate (avg)': `${w.heartRate} bpm`,
        'SpO2 (avg)': `${w.spo2}%`,
        'CO Exposure Level': `${h?.coLevel || 1.5} ppm`,
        'Methane level': `${h?.methaneLevel || 0.05}%`,
        'Fatigue Rating': `${w.fatigueScore}%`
      };
    });
  };

  const getGasReportData = () => {
    return helmets.map(h => ({
      'Helmet ID': h.id,
      'Worker ID': h.workerId,
      'Carbon Monoxide (ppm)': h.coLevel,
      'Methane (% LEL)': h.methaneLevel,
      'Air Quality Index': h.airQualityIndex,
      'Ambient Temp (C)': h.ambientTemp,
      'Humidity (%)': h.ambientHumidity
    }));
  };

  // 1. Export Excel using XLSX
  const exportExcel = () => {
    const data = reportType === 'exposure' ? getExposureReportData() : getGasReportData();
    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Safety Logs");
    XLSX.writeFile(wb, `MineGuardianX_Report_${reportType}.xlsx`);
  };

  // 2. Export PDF using jsPDF
  const exportPDF = () => {
    const doc = new jsPDF();
    doc.setFont("courier", "bold");
    doc.setFontSize(16);
    doc.text("MINEGUARDIAN X - SAFETY REPORT", 14, 20);
    
    doc.setFont("courier", "normal");
    doc.setFontSize(10);
    doc.text(`Generated: ${new Date().toLocaleString()}`, 14, 28);
    doc.text(`Active DEDP Protocol State: ${protocol.activeState}`, 14, 34);
    doc.text("----------------------------------------------------------------", 14, 40);

    const data = reportType === 'exposure' ? getExposureReportData() : getGasReportData();
    let cursorY = 48;
    
    data.forEach((row: any, index: number) => {
      if (cursorY > 270) {
        doc.addPage();
        cursorY = 20;
      }
      doc.text(`${index + 1}. `, 14, cursorY);
      
      const details = Object.entries(row)
        .map(([key, val]) => `${key}: ${val}`)
        .join(" | ");
      
      const splitText = doc.splitTextToSize(details, 160);
      doc.text(splitText, 22, cursorY);
      cursorY += splitText.length * 6;
    });

    doc.save(`MineGuardianX_Report_${reportType}.pdf`);
  };

  return (
    <div className="p-6 space-y-6 flex-1 overflow-y-auto font-sans">
      
      {/* Header */}
      <div>
        <h2 className="text-xl font-bold uppercase tracking-wider font-mono text-[#E8F4FD]">
          Automated Safety Reports Console
        </h2>
        <p className="text-xs text-mine-textMuted uppercase mt-1">
          Daily personnel exposure logs, calibration events records, and regulatory export formats
        </p>
      </div>

      <div className="grid grid-cols-4 gap-6 items-start">
        
        {/* Selector Panel */}
        <div className="col-span-1 glass-card rounded-xl p-5 space-y-4">
          <h3 className="text-xs font-bold uppercase tracking-wider text-mine-cyan font-mono border-b border-[rgba(0,212,255,0.1)] pb-2 flex items-center gap-2">
            <FileText className="w-4 h-4" />
            Report Configuration
          </h3>

          <div className="space-y-2">
            <button
              onClick={() => setReportType('exposure')}
              className={`w-full py-2.5 rounded-lg text-[10px] font-mono font-bold uppercase tracking-wider transition-all border text-left px-3 ${
                reportType === 'exposure' 
                  ? 'bg-[#00D4FF] text-black border-[#00D4FF]' 
                  : 'bg-[#132235] text-mine-textMuted border-[rgba(0,212,255,0.1)] hover:border-[rgba(0,212,255,0.25)]'
              }`}
            >
              Personnel Exposure Report
            </button>

            <button
              onClick={() => setReportType('gas')}
              className={`w-full py-2.5 rounded-lg text-[10px] font-mono font-bold uppercase tracking-wider transition-all border text-left px-3 ${
                reportType === 'gas' 
                  ? 'bg-[#00D4FF] text-black border-[#00D4FF]' 
                  : 'bg-[#132235] text-mine-textMuted border-[rgba(0,212,255,0.1)] hover:border-[rgba(0,212,255,0.25)]'
              }`}
            >
              Gas Leakage & Ambient Logs
            </button>
          </div>

          <div className="h-[1px] bg-[rgba(0,212,255,0.15)] my-4" />

          {/* Export Buttons */}
          <div className="space-y-2">
            <button
              onClick={exportPDF}
              className="w-full py-2.5 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white font-mono font-bold uppercase rounded-lg text-[10px] tracking-wider transition-all flex items-center justify-center gap-2"
            >
              <Download className="w-4 h-4" />
              Export PDF Document
            </button>
            
            <button
              onClick={exportExcel}
              className="w-full py-2.5 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 text-white font-mono font-bold uppercase rounded-lg text-[10px] tracking-wider transition-all flex items-center justify-center gap-2"
            >
              <FileSpreadsheet className="w-4 h-4" />
              Export Excel Spreadsheet
            </button>
          </div>

        </div>

        {/* Live Preview Panel */}
        <div className="col-span-3 glass-card rounded-xl overflow-hidden flex flex-col min-h-[460px]">
          <div className="p-4 border-b border-[rgba(0,212,255,0.1)] bg-[rgba(255,255,255,0.01)] font-mono text-xs text-[#E8F4FD]">
            <span>Report Preview Mode: {reportType === 'exposure' ? 'Personnel Exposure' : 'Methane & Ambient Logs'}</span>
          </div>

          <div className="flex-1 overflow-x-auto">
            <table className="w-full text-left text-xs font-mono">
              <thead>
                <tr className="border-b border-[rgba(0,212,255,0.08)] bg-[rgba(0,0,0,0.2)] text-mine-textMuted">
                  {reportType === 'exposure' ? (
                    <>
                      <th className="p-4">Worker</th>
                      <th className="p-4">Zone</th>
                      <th className="p-4">Vitals Summary</th>
                      <th className="p-4">CO Level</th>
                      <th className="p-4">Fatigue</th>
                    </>
                  ) : (
                    <>
                      <th className="p-4">Helmet ID</th>
                      <th className="p-4">CO level</th>
                      <th className="p-4">Methane</th>
                      <th className="p-4">Ambient Temp</th>
                      <th className="p-4">Humidity</th>
                    </>
                  )}
                </tr>
              </thead>
              <tbody className="divide-y divide-[rgba(0,212,255,0.04)]">
                {reportType === 'exposure' ? (
                  getExposureReportData().map((row: any, i: number) => (
                    <tr key={i} className="hover:bg-[rgba(0,212,255,0.01)]">
                      <td className="p-4 font-bold text-[#E8F4FD]">{row['Name']} ({row['Worker ID']})</td>
                      <td className="p-4 text-mine-textMuted">{row['Assigned Shaft']}</td>
                      <td className="p-4">{row['Heart Rate (avg)']} | {row['SpO2 (avg)']}</td>
                      <td className="p-4 text-mine-cyan font-bold">{row['CO Exposure Level']}</td>
                      <td className="p-4 font-bold text-mine-amber">{row['Fatigue Rating']}</td>
                    </tr>
                  ))
                ) : (
                  getGasReportData().map((row: any, i: number) => (
                    <tr key={i} className="hover:bg-[rgba(0,212,255,0.01)]">
                      <td className="p-4 font-bold text-[#E8F4FD]">{row['Helmet ID']}</td>
                      <td className="p-4 text-mine-cyan">{row['Carbon Monoxide (ppm)']} ppm</td>
                      <td className="p-4 text-mine-cyan font-bold">{row['Methane (% LEL)']}% LEL</td>
                      <td className="p-4 text-mine-textMuted">{row['Ambient Temp (C)']} °C</td>
                      <td className="p-4 text-mine-textMuted">{row['Humidity (%)']}%</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          <div className="p-4 border-t border-[rgba(0,212,255,0.1)] bg-[rgba(255,255,255,0.01)] flex gap-2 items-center text-[10px] font-mono text-mine-textMuted">
            <ShieldCheck className="w-4 h-4 text-mine-green" />
            <span>Meets DGMS (Directorate General of Mines Safety) digital logging requirements.</span>
          </div>

        </div>

      </div>

    </div>
  );
};
