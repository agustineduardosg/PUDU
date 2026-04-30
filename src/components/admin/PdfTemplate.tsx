import React from "react";

interface QuoteItem {
  id: string;
  serviceId: string;
  customName?: string;
  description: string;
  quantity: number;
  unitPrice: number;
}

interface QuoteOptionData {
  id: string;
  title: string;
  items: QuoteItem[];
}

interface PdfTemplateProps {
  clientName: string;
  clientRut: string;
  clientEmail: string;
  validUntil: string;
  options: QuoteOptionData[];
  applyIva: boolean;
  notes: string;
  date: string;
}

// Map of services to get names for the id
const SERVICES_MAP: Record<string, string> = {
  "sio-min": "Minería (SIO Min)",
  "sio-health": "Salud (SIO Health)",
  "sio-agro": "Agricultura de Precisión (SIO Agro)",
  "sio-ind": "Industria 4.0 (SIO Ind)",
  "sio-logistics": "Automoción (SIO Logistics)",
  "sio-ecom": "E-commerce (SIO E-com)",
  "apps": "Desarrollo de Apps",
  "web": "Páginas Web Pro",
  "cctv": "Videovigilancia Rural",
  "redes": "Redes e Infraestructura",
  "cybersecurity": "Cybersecurity & GovTech",
};

export const PdfTemplate = React.forwardRef<HTMLDivElement, PdfTemplateProps>(
  ({ clientName, clientRut, clientEmail, validUntil, options, applyIva, notes, date }, ref) => {
    
    // Función formateadora de moneda chilena
    const formatCLP = (amount: number) => {
      return new Intl.NumberFormat("es-CL", { style: "currency", currency: "CLP" }).format(amount);
    };

    return (
      <div 
        ref={ref} 
        style={{
          width: "210mm",
          backgroundColor: "#FFFFFF",
          color: "#0F172A", // Slate 900
          fontFamily: "'Inter', sans-serif",
          boxSizing: "border-box",
          position: "relative",
          overflow: "hidden"
        }}
        className="pdf-container absolute -left-[9999px]" // Hidden from screen but in DOM
      >
        {/* FULL WIDTH HEADER (DARK) */}
        <div style={{ backgroundColor: "#0F172A", padding: "12mm 15mm 10mm 15mm", position: "relative" }}>
           <div style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "6px", backgroundColor: "#0EA5E9" }} />
           <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div style={{ width: "45%", display: "flex", flexDirection: "column", gap: "10px" }}>
                <div style={{ backgroundColor: "#FFFFFF", padding: "12px 16px", borderRadius: "8px", display: "inline-block", alignSelf: "flex-start", boxShadow: "0 4px 6px rgba(0,0,0,0.1)" }}>
                  <img src="/logo-pudu.svg" style={{ width: "120px", height: "auto", display: "block" }} alt="PUDU Logo" />
                </div>
                <div style={{ marginTop: "4px" }}>
                  <p style={{ fontSize: "10px", color: "#0EA5E9", letterSpacing: "1px", textTransform: "uppercase", fontWeight: 800 }}>Prime Utility Digital Upgrade</p>
                  <p style={{ fontSize: "10px", color: "#94A3B8", marginTop: "2px" }}>agustineduardosg@puduit.tech | www.puduit.tech</p>
                </div>
              </div>
              
              <div style={{ textAlign: "right" }}>
                 <h1 style={{ fontSize: "28px", fontWeight: 900, textTransform: "uppercase", letterSpacing: "-0.5px", margin: 0, color: "#FFFFFF", lineHeight: 1.1 }}>
                   Propuesta<br/>
                   <span style={{ color: "#0EA5E9" }}>Comercial</span>
                 </h1>
                 <hr style={{ borderColor: "rgba(255,255,255,0.1)", margin: "10px 0 10px auto", width: "80px", borderTopWidth: "1px" }} />
                 <table style={{ width: "100%", fontSize: "10px", textAlign: "right", color: "#E2E8F0" }}>
                   <tbody>
                     <tr><td style={{ paddingBottom: "3px" }}><strong style={{ color: "#94A3B8", textTransform: "uppercase" }}>Emisión:</strong></td><td style={{ paddingBottom: "3px", paddingLeft: "10px", fontWeight: 600 }}>{date}</td></tr>
                     <tr><td><strong style={{ color: "#94A3B8", textTransform: "uppercase" }}>Válida Hasta:</strong></td><td style={{ paddingLeft: "10px", fontWeight: 600 }}>{validUntil || "15 días"}</td></tr>
                   </tbody>
                 </table>
              </div>
           </div>
        </div>

        {/* CONTENT TIGHT WRAPPER */}
        <div style={{ padding: "10mm 15mm 15mm 15mm" }}>
          
          {/* CLIENT DETAILS */}
          <div style={{ display: "flex", marginBottom: "40px", alignItems: "stretch" }}>
            <div style={{ width: "4px", backgroundColor: "#0EA5E9", marginRight: "15px", borderRadius: "4px" }} />
            <div style={{ flexGrow: 1 }}>
              <h2 style={{ fontSize: "11px", fontWeight: 800, color: "#64748B", textTransform: "uppercase", letterSpacing: "1px", marginBottom: "8px" }}>Preparado Exclusivamente Para</h2>
              <div style={{ display: "flex", justifyContent: "space-between", backgroundColor: "#F8FAFC", padding: "16px 20px", borderRadius: "8px", border: "1px solid #E2E8F0" }}>
                <div style={{ width: "40%" }}>
                  <p style={{ fontSize: "10px", color: "#64748B", textTransform: "uppercase", marginBottom: "2px", fontWeight: 700 }}>Empresa / Cliente</p>
                  <p style={{ fontSize: "14px", fontWeight: 800, color: "#0F172A" }}>{clientName || "—"}</p>
                </div>
                <div style={{ width: "30%" }}>
                  <p style={{ fontSize: "10px", color: "#64748B", textTransform: "uppercase", marginBottom: "2px", fontWeight: 700 }}>RUT Comercial</p>
                  <p style={{ fontSize: "13px", fontWeight: 600, color: "#0F172A" }}>{clientRut || "—"}</p>
                </div>
                <div style={{ width: "30%" }}>
                  <p style={{ fontSize: "10px", color: "#64748B", textTransform: "uppercase", marginBottom: "2px", fontWeight: 700 }}>Contacto Email</p>
                  <p style={{ fontSize: "13px", fontWeight: 600, color: "#0EA5E9" }}>{clientEmail || "—"}</p>
                </div>
              </div>
            </div>
          </div>

          {/* DYNAMIC OPTIONS */}
          {options.map((opt) => {
            const optSubt = opt.items.reduce((acc, item) => acc + (item.quantity * item.unitPrice), 0);
            const optIva = applyIva ? optSubt * 0.19 : 0;
            const optTot = optSubt + optIva;

            return (
              <div key={opt.id} style={{ marginBottom: "40px", pageBreakInside: "auto" }}>
                
                {/* Option Ribbon Title */}
                <div style={{ display: "flex", alignItems: "center", marginBottom: "15px", pageBreakInside: "avoid" }}>
                  <div style={{ backgroundColor: "#0F172A", color: "#FFFFFF", padding: "6px 14px", borderRadius: "4px", fontWeight: 800, fontSize: "11px", textTransform: "uppercase", letterSpacing: "1px" }}>
                    {opt.title}
                  </div>
                  <div style={{ flexGrow: 1, height: "1px", backgroundColor: "#E2E8F0", marginLeft: "15px" }} />
                </div>

                {/* SERVICES TABLE FOR THIS OPTION */}
                <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "11px", marginBottom: "12px", pageBreakInside: "auto" }}>
                  <thead>
                    <tr style={{ borderBottom: "2px solid #0F172A" }}>
                      <th style={{ padding: "8px 8px", textAlign: "left", width: "25%", color: "#0F172A", fontWeight: 800, textTransform: "uppercase", fontSize: "10px" }}>Servicio Industrial</th>
                      <th style={{ padding: "8px 8px", textAlign: "left", width: "45%", color: "#0F172A", fontWeight: 800, textTransform: "uppercase", fontSize: "10px" }}>Descripción Técnica</th>
                      <th style={{ padding: "8px 8px", textAlign: "center", color: "#0F172A", fontWeight: 800, textTransform: "uppercase", fontSize: "10px" }}>Cant.</th>
                      <th style={{ padding: "8px 8px", textAlign: "right", color: "#0F172A", fontWeight: 800, textTransform: "uppercase", fontSize: "10px" }}>V. Unit.</th>
                      <th style={{ padding: "8px 8px", textAlign: "right", color: "#0F172A", fontWeight: 800, textTransform: "uppercase", fontSize: "10px" }}>Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {opt.items.map((item, index) => (
                      <tr key={index} style={{ borderBottom: "1px solid #F1F5F9", pageBreakInside: "avoid" }}>
                        <td style={{ padding: "14px 8px", fontWeight: 700, color: "#0F172A", verticalAlign: "top" }}>
                          <span style={{ color: "#0EA5E9", marginRight: "6px" }}>▪</span>
                          {item.serviceId === "custom" && item.customName ? item.customName : (SERVICES_MAP[item.serviceId] || item.serviceId)}
                        </td>
                        <td style={{ padding: "14px 8px", color: "#475569", lineHeight: "1.5", verticalAlign: "top" }}>{item.description}</td>
                        <td style={{ padding: "14px 8px", textAlign: "center", fontWeight: 600, color: "#0F172A", verticalAlign: "top" }}>{item.quantity}</td>
                        <td style={{ padding: "14px 8px", textAlign: "right", color: "#64748B", verticalAlign: "top" }}>{formatCLP(item.unitPrice)}</td>
                        <td style={{ padding: "14px 8px", textAlign: "right", fontWeight: 700, color: "#0F172A", verticalAlign: "top" }}>{formatCLP(item.quantity * item.unitPrice)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                {/* TOTALS GRID */}
                <div style={{ display: "flex", justifyContent: "flex-end", pageBreakInside: "avoid" }}>
                  <div style={{ width: "300px", marginTop: "5px" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", padding: "6px 8px", fontSize: "12px", borderBottom: "1px solid #F1F5F9" }}>
                      <span style={{ color: "#64748B", fontWeight: 600 }}>Subtotal Neto:</span>
                      <span style={{ color: "#0F172A", fontWeight: 700 }}>{formatCLP(optSubt)}</span>
                    </div>
                    {applyIva ? (
                      <div style={{ display: "flex", justifyContent: "space-between", padding: "6px 8px", fontSize: "12px", borderBottom: "1px solid #F1F5F9" }}>
                        <span style={{ color: "#64748B", fontWeight: 600 }}>IVA (19%):</span>
                        <span style={{ color: "#0F172A", fontWeight: 700 }}>{formatCLP(optIva)}</span>
                      </div>
                    ) : (
                      <div style={{ padding: "6px 8px", fontSize: "10px", color: "#0EA5E9", fontWeight: 800, textAlign: "right", textTransform: "uppercase", letterSpacing: "1px" }}>
                        Venta Exenta de IVA
                      </div>
                    )}
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 16px", marginTop: "8px", backgroundColor: "#0F172A", borderRadius: "6px" }}>
                      <span style={{ color: "#FFFFFF", fontWeight: 800, fontSize: "12px", textTransform: "uppercase" }}>Inversión {opt.title.split(":")[0]}:</span>
                      <span style={{ color: "#0EA5E9", fontWeight: 900, fontSize: "16px" }}>{formatCLP(optTot)}</span>
                    </div>
                  </div>
                </div>

              </div>
            );
          })}

          {/* GENERAL CONDITIONS & SIG */}
          <div style={{ display: "flex", justifyContent: "space-between", marginTop: "25px", paddingTop: "30px", borderTop: "2px solid #E2E8F0", pageBreakInside: "avoid" }}>
             
             <div style={{ width: "55%" }}>
                {notes && (
                  <div>
                    <h4 style={{ fontWeight: 800, color: "#0F172A", marginBottom: "10px", textTransform: "uppercase", fontSize: "10px", letterSpacing: "1px" }}>
                      Condiciones Comerciales
                    </h4>
                    <p style={{ whiteSpace: "pre-wrap", lineHeight: "1.6", color: "#475569", fontSize: "11px", backgroundColor: "#F8FAFC", padding: "15px", borderRadius: "6px", border: "1px solid #E2E8F0" }}>
                      {notes}
                    </p>
                  </div>
                )}
             </div>

             <div style={{ width: "35%", textAlign: "center", paddingTop: "20px" }}>
                 {/* Línea de firma */}
                 <div style={{ width: "180px", margin: "0 auto", borderBottom: "1px solid #94A3B8", height: "40px", marginBottom: "12px" }}></div>
                 <p style={{ fontWeight: 800, fontSize: "12px", color: "#0F172A", textTransform: "uppercase" }}>Agustin Eduardo Salazar G.</p>
                 <p style={{ fontSize: "10px", color: "#0EA5E9", fontWeight: 700, letterSpacing: "1px" }}>CEO PUDU IT Solutions</p>
             </div>
          </div>
        
        </div>

        {/* --- INCORPORATED DARK BROCHURE ANNEX --- */}
        <div style={{ width: "100%", padding: "20mm 20mm", backgroundColor: "#0F172A", color: "#FFFFFF", boxSizing: "border-box", minHeight: "297mm", position: "relative" }}>
          
          <div style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "8px", backgroundColor: "#0EA5E9" }} />
          
          <div style={{ textAlign: "center", marginBottom: "50px", marginTop: "30px" }}>
            <h2 style={{ fontSize: "36px", fontWeight: 900, color: "#FFFFFF", marginBottom: "8px", textTransform: "uppercase", letterSpacing: "1px" }}>
              Ecosistema <span style={{ color: "#0EA5E9" }}>Tecnológico</span>
            </h2>
            <p style={{ color: "#94A3B8", fontSize: "14px", textTransform: "uppercase", letterSpacing: "2px", fontWeight: 600 }}>
              Capacidades Industriales PUDU IT Solutions
            </p>
          </div>
          
          <div style={{ display: "flex", gap: "30px", justifyContent: "center" }}>
            
            {/* LADO A: ECOSISTEMAS */}
            <div style={{ width: "48%", backgroundColor: "rgba(255,255,255,0.03)", padding: "30px 25px", borderRadius: "12px", border: "1px solid rgba(255,255,255,0.05)" }}>
              <div style={{ display: "flex", alignItems: "center", marginBottom: "25px", gap: "10px" }}>
                <div style={{ width: "8px", height: "24px", backgroundColor: "#0EA5E9", borderRadius: "2px" }} />
                <h3 style={{ fontSize: "16px", fontWeight: 800, color: "#FFFFFF", textTransform: "uppercase", letterSpacing: "1px" }}>Ecosistemas SIO (Estratégicos)</h3>
              </div>
              <ul style={{ listStyle: "none", padding: 0, margin: 0, fontSize: "12px", color: "#94A3B8", lineHeight: "1.8" }}>
                <li style={{ marginBottom: "16px" }}><strong style={{ color: "#FFFFFF", fontSize: "13px" }}>▪ SIO Minería:</strong> Sincronización Operativa 24/7 y Predicción de Fallas mediante Telemetría Avanzada.</li>
                <li style={{ marginBottom: "16px" }}><strong style={{ color: "#FFFFFF", fontSize: "13px" }}>▪ SIO Health:</strong> Ecosistemas Clínicos Seguros e Interoperables bajo Estándares SIS y MINSAL.</li>
                <li style={{ marginBottom: "16px" }}><strong style={{ color: "#FFFFFF", fontSize: "13px" }}>▪ SIO Agro de Precisión:</strong> Gestión Hídrica Inteligente e IoT de Campo para Máxima Trazabilidad.</li>
                <li style={{ marginBottom: "16px" }}><strong style={{ color: "#FFFFFF", fontSize: "13px" }}>▪ SIO Industria 4.0:</strong> Visibilidad Analítica Total y Control de Planta Inteligente e Integrado.</li>
                <li style={{ marginBottom: "16px" }}><strong style={{ color: "#FFFFFF", fontSize: "13px" }}>▪ SIO Automoción:</strong> Logística Sincronizada y Cadena de Suministro Trazable en Tiempo Real.</li>
                <li style={{ marginBottom: "16px" }}><strong style={{ color: "#FFFFFF", fontSize: "13px" }}>▪ SIO E-commerce:</strong> Plataformas Transaccionales Integradas con ERP para Escalabilidad Inmediata.</li>
              </ul>
            </div>

            {/* LADO B: SOLUCIONES */}
            <div style={{ width: "48%", backgroundColor: "rgba(255,255,255,0.03)", padding: "30px 25px", borderRadius: "12px", border: "1px solid rgba(255,255,255,0.05)" }}>
              <div style={{ display: "flex", alignItems: "center", marginBottom: "25px", gap: "10px" }}>
                <div style={{ width: "8px", height: "24px", backgroundColor: "#0EA5E9", borderRadius: "2px" }} />
                <h3 style={{ fontSize: "16px", fontWeight: 800, color: "#FFFFFF", textTransform: "uppercase", letterSpacing: "1px" }}>Soluciones Técnicas a Medida</h3>
              </div>
              <ul style={{ listStyle: "none", padding: 0, margin: 0, fontSize: "12px", color: "#94A3B8", lineHeight: "1.8" }}>
                <li style={{ marginBottom: "16px" }}><strong style={{ color: "#FFFFFF", fontSize: "13px" }}>▪ Desarrollo Nátivo de Apps:</strong> Ecosistemas Móviles (iOS/Android) para Experiencias de Usuario Premium.</li>
                <li style={{ marginBottom: "16px" }}><strong style={{ color: "#FFFFFF", fontSize: "13px" }}>▪ Páginas Web Pro (React/NextJS):</strong> Arquitectura Web High-End, Optimizada para Conversión y Velocidad Absoluta.</li>
                <li style={{ marginBottom: "16px" }}><strong style={{ color: "#FFFFFF", fontSize: "13px" }}>▪ Videovigilancia y AI:</strong> Sistemas Autónomos de Monitoreo Inteligente para Entornos Complejos.</li>
                <li style={{ marginBottom: "16px" }}><strong style={{ color: "#FFFFFF", fontSize: "13px" }}>▪ Redes e Infraestructura:</strong> Diseño e Implementación de Ecosistemas de Red Seguros, Resilientes y de Alta Disponibilidad.</li>
              </ul>
            </div>

          </div>
          
          <div style={{ marginTop: "60px", textAlign: "center", padding: "20px", borderTop: "1px solid rgba(255,255,255,0.1)" }}>
            <img src="/logo-pudu.svg" style={{ width: "100px", height: "auto", filter: "brightness(0) invert(1) opacity(0.5)", marginBottom: "10px", margin: "0 auto" }} alt="PUDU" />
            <p style={{ fontSize: "11px", color: "#64748B", letterSpacing: "1px" }}>TRANSFORMACIÓN DIGITAL INDUSTRIAL DE PRECISIÓN | WWW.PUDUIT.TECH</p>
          </div>

        </div>

      </div>
    );
  }
);

PdfTemplate.displayName = "PdfTemplate";
