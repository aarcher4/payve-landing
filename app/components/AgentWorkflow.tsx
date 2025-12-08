"use client";

import React, { useEffect, useRef, useState } from "react";

interface LogEntry {
  id: string;
  text: string;
  type: "info" | "success" | "warning" | "error" | "data" | "system";
  timestamp: string;
}

const SHIPMENT_DATA = {
  shipment_id: "SHP-2025-8X92",
  origin: "Veracruz, MX",
  destination: "Philadelphia, PA",
  carrier: "OceanEx Logistics",
  vessel: "MSC AGRIGENTO",
  container: "MSCU-982341-2",
  commodity: "Avocados (Hass)",
  temp_setpoint: "4.0°C",
  current_temp: "3.8°C",
  humidity: "85%",
  eta: "2025-10-14T08:00:00Z",
  status: "IN_TRANSIT",
  documents: ["BOL_8X92.pdf", "INV_2025_001.pdf", "PACK_LIST.pdf"]
};

const MATCH_DATA = {
  invoice_id: "INV-2025-001",
  po_reference: "PO-7782-A",
  line_items_match: true,
  amount_match: true,
  currency: "USD",
  total_value: 42500.00,
  confidence_score: 0.998,
  discrepancies: []
};

export const AgentWorkflow = () => {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isTyping, setIsTyping] = useState(false);
  const [status, setStatus] = useState<"idle" | "running" | "completed">("idle");
  const [mounted, setMounted] = useState(false);

  // Auto-scroll to bottom
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [logs]);

  useEffect(() => {
    setMounted(true);
    let isMounted = true;
    
    const addLog = (text: string, type: LogEntry["type"] = "info") => {
      if (!isMounted) return;
      const id = Math.random().toString(36).substr(2, 9);
      const timestamp = new Date().toLocaleTimeString('en-US', { hour12: false, hour: "2-digit", minute: "2-digit", second: "2-digit", fractionalSecondDigits: 3 });
      setLogs(prev => [...prev, { id, text, type, timestamp }]);
    };

    const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

    const runSequence = async () => {
      if (!isMounted) return;
      
      setStatus("running");
      setLogs([]); // Clear logs at start of run
      
      // Initial pause
      await delay(1000);

      // Phase 1: Ingestion
      setIsTyping(true);
      addLog("Initializing agentic workflow...", "system");
      await delay(800);
      addLog("Ingesting document source: /uploads/batch_2025_10_08...", "info");
      await delay(1200);
      setIsTyping(false);

      // Phase 2: Processing
      addLog("Classifying document type...", "system");
      await delay(600);
      addLog("Detected: Commercial Invoice & Bill of Lading", "success");
      await delay(400);
      addLog("Extracting unstructured data...", "info");
      await delay(800);

      // Phase 3: Data Stream (Shipment)
      addLog("Stream initialized. Parsing entities...", "system");
      await delay(200);
      
      // Fast stream of JSON data
      const jsonLines = JSON.stringify(SHIPMENT_DATA, null, 2).split('\n');
      for (const line of jsonLines) {
        if (!isMounted) return;
        addLog(line, "data");
        await delay(30); // Fast typing
      }
      
      await delay(800);

      // Phase 4: Matching
      addLog("Structuring data entities...", "system");
      await delay(600);
      addLog("Initiating cross-reference matching...", "info");
      await delay(1000); // Thinking pause
      
      // Pulse effect simulated by delay
      addLog("Searching for Purchase Order match...", "info");
      await delay(1500);

      // Phase 5: Data Stream (Matches)
      addLog("Match found: PO-7782-A", "success");
      await delay(300);
      
      const matchLines = JSON.stringify(MATCH_DATA, null, 2).split('\n');
      for (const line of matchLines) {
        if (!isMounted) return;
        addLog(line, "data");
        await delay(30);
      }

      await delay(1000);
      addLog("Documents connected. Confidence: 99.8%", "success");
      await delay(1200);

      // Phase 6: Review & Exception
      addLog("Reviewing against compliance rules...", "system");
      await delay(1500); // Long thinking
      addLog("Analyzing temperature logs...", "info");
      await delay(1000);
      addLog("EXCEPTION NOTICE: Temperature excursion detected", "warning");
      addLog("Variance: -2.4°C below threshold for 45 mins", "error");
      await delay(1000);

      // Phase 7: Notification
      addLog("Initiating vendor resolution protocol...", "system");
      await delay(800);
      addLog("Generating resolution summary...", "info");
      await delay(1200);
      addLog("Notifying vendor via WhatsApp API...", "success");
      setStatus("completed");
      
      // Loop: Wait and restart
      await delay(5000);
      if (isMounted) {
        runSequence();
      }
    };

    runSequence();

    return () => {
      isMounted = false;
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Run once on mount

  return (
    <div className="w-full h-[600px] bg-[#1a1a1a] rounded-lg border border-white/10 overflow-hidden flex flex-col font-mono text-xs md:text-sm shadow-2xl relative group">
      {/* Header */}
      <div className="h-8 bg-[#2a2a2a] border-b border-white/5 flex items-center px-4 gap-2">
        <div className="flex gap-1.5">
          <div className="w-2.5 h-2.5 rounded-full bg-[#FF5F56]" />
          <div className="w-2.5 h-2.5 rounded-full bg-[#FFBD2E]" />
          <div className="w-2.5 h-2.5 rounded-full bg-[#27C93F]" />
        </div>
        <div className="ml-4 text-white/30 text-xs">agent_v2.1_orchestrator.ts</div>
      </div>

      {/* Content Area */}
      <div 
        ref={scrollRef}
        className="flex-1 p-4 overflow-y-auto space-y-1 scrollbar-hide text-white/80"
      >
        {logs.map((log) => (
          <div key={log.id} className="flex gap-3">
            <span className="text-white/30 shrink-0 select-none">
              {log.timestamp}
            </span>
            <div className={`break-all ${
              log.type === 'error' ? 'text-red-400' :
              log.type === 'warning' ? 'text-yellow-400' :
              log.type === 'success' ? 'text-[#8FB3A1]' : // Sage
              log.type === 'system' ? 'text-blue-400' :
              log.type === 'data' ? 'text-white/50 pl-4' :
              'text-white/90'
            }`}>
              {log.type === 'system' && <span className="mr-2">➜</span>}
              {log.text}
            </div>
          </div>
        ))}
        
        {/* Blinking Cursor - Only show when mounted to prevent hydration error */}
        {mounted && status !== "completed" && (
          <div className="flex gap-3 animate-pulse">
            <span className="text-white/30 shrink-0 select-none">
              {new Date().toLocaleTimeString('en-US', { hour12: false, hour: "2-digit", minute: "2-digit", second: "2-digit", fractionalSecondDigits: 3 })}
            </span>
            <span className="w-2 h-4 bg-white/50 block" />
          </div>
        )}

        {/* Success State / WhatsApp Notification */}
        {status === "completed" && (
          <div className="mt-6 p-4 bg-[#25D366]/10 border border-[#25D366]/20 rounded flex items-center gap-4 animate-fade-up">
            <div className="w-10 h-10 bg-[#25D366] rounded-full flex items-center justify-center shrink-0">
               <svg viewBox="0 0 24 24" className="w-6 h-6 text-white fill-current">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.008-.57-.008-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
               </svg>
            </div>
            <div>
              <div className="text-[#25D366] font-bold text-sm">Message Sent</div>
              <div className="text-white/60 text-xs">Vendor notified of exception</div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
