"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Save, Plus, Trash2, Printer, CheckCircle } from "lucide-react";
import { saveEppDelivery } from "@/app/actions/epp";
import Link from "next/link";
import { useAuth } from "@/components/providers/AuthProvider";

export default function EppDeliveryForm({ company, worker, existingDelivery }: { company: any, worker: any, existingDelivery: any }) {
  const router = useRouter();
  
  const [items, setItems] = useState<any[]>(existingDelivery?.items || [
    { id: '1', product: '', typeModel: '', brand: '', certified: 'NO', quantity: 1, deliveryDate: new Date().toISOString().split('T')[0], workerSignature: false }
  ]);
  
  const [headerData, setHeaderData] = useState(() => {
    try {
      const parsed = existingDelivery?.additionalInfo ? JSON.parse(existingDelivery.additionalInfo) : null;
      return {
        companyName: parsed?.companyName || company.name,
        taxId: parsed?.taxId || company.taxId,
        address: parsed?.address || company.address,
        localidad: parsed?.localidad || worker.establishment?.municipality || "",
        provincia: parsed?.provincia || worker.establishment?.province || "",
        cp: parsed?.cp || "",
        workerName: parsed?.workerName || `${worker.lastName}, ${worker.firstName}`,
        dni: parsed?.dni || worker.documentId,
        puesto: parsed?.puesto || worker.primaryRole?.name || "N/A",
        elementos: parsed?.elementos || "",
        additionalInfoText: parsed?.additionalInfoText || ""
      };
    } catch(e) {
      return {
        companyName: company.name,
        taxId: company.taxId,
        address: company.address,
        localidad: worker.establishment?.municipality || "",
        provincia: worker.establishment?.province || "",
        cp: "",
        workerName: `${worker.lastName}, ${worker.firstName}`,
        dni: worker.documentId,
        puesto: worker.primaryRole?.name || "N/A",
        elementos: "",
        additionalInfoText: existingDelivery?.additionalInfo || ""
      };
    }
  });

  const [signed, setSigned] = useState(existingDelivery?.signed || false);
  const [isSaving, setIsSaving] = useState(false);
  
  const handleAddItem = () => {
    setItems([...items, { 
      id: Math.random().toString(36).substring(7), 
      product: '', 
      typeModel: '', 
      brand: '', 
      certified: 'NO', 
      quantity: 1, 
      deliveryDate: new Date().toISOString().split('T')[0],
      workerSignature: false
    }]);
  };

  const handleRemoveItem = (id: string) => {
    setItems(items.filter(item => item.id !== id));
  };

  const handleItemChange = (id: string, field: string, value: any) => {
    setItems(items.map(item => item.id === id ? { ...item, [field]: value } : item));
  };

  const handleHeaderChange = (field: string, value: string) => {
    setHeaderData({ ...headerData, [field]: value });
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const res = await saveEppDelivery(company.id, worker.id, {
        date: new Date().toISOString(),
        items,
        additionalInfo: JSON.stringify(headerData),
        signed
      });
      if (res?.error) {
        alert(res.error);
      } else {
        alert("Planilla guardada correctamente");
        router.refresh();
      }
    } catch (e: any) {
      alert("Error al guardar: " + e.message);
    } finally {
      setIsSaving(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      <style dangerouslySetInnerHTML={{__html: `
        @media print {
          @page { size: landscape; margin: 10mm; }
          body { -webkit-print-color-adjust: exact; }
        }
      `}} />
      
      {/* Action Bar - Hidden when printing */}
      <div className="print:hidden flex items-center justify-between bg-white p-4 rounded-xl shadow-sm border border-slate-100">
        <Link 
          href={`/portal/empresas/${company.id}/epp`}
          className="flex items-center gap-2 text-slate-500 hover:text-indigo-600 transition-colors font-medium text-sm"
        >
          <ArrowLeft className="w-4 h-4" />
          Volver
        </Link>
        <div className="flex items-center gap-3">
          <button
            onClick={handlePrint}
            className="flex items-center gap-2 px-4 py-2 bg-slate-100 text-slate-700 hover:bg-slate-200 rounded-lg text-sm font-bold transition-colors"
          >
            <Printer className="w-4 h-4" />
            Imprimir Planilla
          </button>
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="flex items-center gap-2 px-6 py-2 bg-indigo-600 text-white hover:bg-indigo-700 rounded-lg text-sm font-bold transition-colors disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            {isSaving ? "Guardando..." : "Guardar Planilla"}
          </button>
        </div>
      </div>

      {/* Official Form Container (Res 299) */}
      <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200 print:shadow-none print:border-none print:p-0 print:w-full">
        <div className="text-center mb-6">
          <h2 className="text-xl font-bold uppercase">Constancia de Entrega de Ropa de Trabajo y Elementos de Protección Personal</h2>
          <p className="text-sm font-bold mt-1">Resolución SRT N° 299/2011</p>
        </div>

        {/* Header Information */}
        <div className="grid grid-cols-2 border-2 border-black text-sm mb-6">
          {/* Company Data */}
          <div className="col-span-2 border-b-2 border-black p-2 flex gap-4 items-center">
            <span className="font-bold whitespace-nowrap">Razón Social:</span>
            <input type="text" value={headerData.companyName} onChange={(e) => handleHeaderChange('companyName', e.target.value)} className="uppercase outline-none w-full bg-transparent print:hidden" />
            <span className="hidden print:inline uppercase">{headerData.companyName}</span>
            
            <span className="font-bold whitespace-nowrap ml-4">C.U.I.T.:</span>
            <input type="text" value={headerData.taxId} onChange={(e) => handleHeaderChange('taxId', e.target.value)} className="outline-none w-48 bg-transparent print:hidden" />
            <span className="hidden print:inline">{headerData.taxId}</span>
          </div>
          <div className="border-r-2 border-black border-b-2 p-2 flex items-center gap-2">
            <span className="font-bold">Dirección: </span>
            <input type="text" value={headerData.address} onChange={(e) => handleHeaderChange('address', e.target.value)} className="uppercase outline-none w-full bg-transparent print:hidden" />
            <span className="hidden print:inline uppercase">{headerData.address}</span>
          </div>
          <div className="border-b-2 border-black p-2 flex items-center gap-2">
            <span className="font-bold">Localidad: </span>
            <input type="text" value={headerData.localidad} onChange={(e) => handleHeaderChange('localidad', e.target.value)} className="uppercase outline-none w-full bg-transparent print:hidden" />
            <span className="hidden print:inline uppercase">{headerData.localidad}</span>
          </div>
          <div className="border-r-2 border-black p-2 flex items-center gap-2">
            <span className="font-bold">Provincia: </span>
            <input type="text" value={headerData.provincia} onChange={(e) => handleHeaderChange('provincia', e.target.value)} className="uppercase outline-none w-full bg-transparent print:hidden" />
            <span className="hidden print:inline uppercase">{headerData.provincia}</span>
          </div>
          <div className="p-2 flex items-center gap-2">
            <span className="font-bold">C.P.: </span>
            <input type="text" value={headerData.cp} onChange={(e) => handleHeaderChange('cp', e.target.value)} className="outline-none w-full bg-transparent print:hidden" />
            <span className="hidden print:inline">{headerData.cp}</span>
          </div>
          
          {/* Worker Data */}
          <div className="col-span-2 border-y-2 border-black p-2 flex gap-4 items-center">
            <span className="font-bold whitespace-nowrap">Nombre y apellido del trabajador:</span>
            <input type="text" value={headerData.workerName} onChange={(e) => handleHeaderChange('workerName', e.target.value)} className="uppercase outline-none w-full bg-transparent print:hidden" />
            <span className="hidden print:inline uppercase">{headerData.workerName}</span>
            
            <span className="font-bold whitespace-nowrap ml-4">D.N.I.:</span>
            <input type="text" value={headerData.dni} onChange={(e) => handleHeaderChange('dni', e.target.value)} className="outline-none w-48 bg-transparent print:hidden" />
            <span className="hidden print:inline">{headerData.dni}</span>
          </div>
          <div className="col-span-2 border-b-2 border-black p-2 flex items-center gap-2">
            <span className="font-bold whitespace-nowrap">Descripción breve del puesto/s de trabajo: </span>
            <input type="text" value={headerData.puesto} onChange={(e) => handleHeaderChange('puesto', e.target.value)} className="uppercase outline-none w-full bg-transparent print:hidden" />
            <span className="hidden print:inline uppercase">{headerData.puesto}</span>
          </div>
          <div className="col-span-2 p-2 text-center bg-slate-100 print:bg-gray-200">
            <div className="font-bold">Elementos de protección personal, necesarios para el trabajador, según el puesto de trabajo:</div>
            <input type="text" value={headerData.elementos} onChange={(e) => handleHeaderChange('elementos', e.target.value)} className="mt-1 uppercase outline-none w-full text-center bg-transparent print:hidden border-b border-slate-300 focus:border-indigo-500" placeholder="Escriba aquí los elementos necesarios..." />
            <div className="hidden print:block uppercase mt-1">{headerData.elementos}</div>
          </div>
        </div>

        {/* EPP Items Table */}
        <div className="mb-6 overflow-x-auto">
          <table className="w-full border-2 border-black text-xs text-center">
            <thead>
              <tr className="border-b-2 border-black bg-slate-100 print:bg-gray-200">
                <th className="border-r-2 border-black p-2 font-bold w-1/4">Producto</th>
                <th className="border-r-2 border-black p-2 font-bold w-1/4">Tipo/Modelo</th>
                <th className="border-r-2 border-black p-2 font-bold w-1/6">Marca</th>
                <th className="border-r-2 border-black p-1 font-bold w-16">Certificación SI/NO</th>
                <th className="border-r-2 border-black p-1 font-bold w-12">Cant.</th>
                <th className="border-r-2 border-black p-2 font-bold w-24">Fecha entrega</th>
                <th className="p-2 font-bold w-32">Firma del trabajador</th>
                <th className="print:hidden p-2 font-bold w-10"></th>
              </tr>
            </thead>
            <tbody>
              {items.map((item, index) => (
                <tr key={item.id} className="border-b border-black">
                  <td className="border-r-2 border-black p-1">
                    <input 
                      type="text" 
                      value={item.product}
                      onChange={(e) => handleItemChange(item.id, 'product', e.target.value)}
                      className="w-full text-center outline-none print:hidden uppercase"
                      placeholder="Ej: ZAPATO DE SEGURIDAD"
                    />
                    <span className="hidden print:block uppercase">{item.product}</span>
                  </td>
                  <td className="border-r-2 border-black p-1">
                    <input 
                      type="text" 
                      value={item.typeModel}
                      onChange={(e) => handleItemChange(item.id, 'typeModel', e.target.value)}
                      className="w-full text-center outline-none print:hidden uppercase"
                      placeholder="Ej: BOTÍN DE CUERO BOTIN"
                    />
                    <span className="hidden print:block uppercase">{item.typeModel}</span>
                  </td>
                  <td className="border-r-2 border-black p-1">
                    <input 
                      type="text" 
                      value={item.brand}
                      onChange={(e) => handleItemChange(item.id, 'brand', e.target.value)}
                      className="w-full text-center outline-none print:hidden uppercase"
                      placeholder="Ej: OMBU"
                    />
                    <span className="hidden print:block uppercase">{item.brand}</span>
                  </td>
                  <td className="border-r-2 border-black p-1">
                    <select
                      value={item.certified}
                      onChange={(e) => handleItemChange(item.id, 'certified', e.target.value)}
                      className="w-full text-center outline-none print:hidden font-bold"
                    >
                      <option value="SI">SI</option>
                      <option value="NO">NO</option>
                    </select>
                    <span className="hidden print:block font-bold">{item.certified}</span>
                  </td>
                  <td className="border-r-2 border-black p-1">
                    <input 
                      type="number" 
                      min="1"
                      value={item.quantity}
                      onChange={(e) => handleItemChange(item.id, 'quantity', parseInt(e.target.value) || 1)}
                      className="w-full text-center outline-none print:hidden"
                    />
                    <span className="hidden print:block">{item.quantity}</span>
                  </td>
                  <td className="border-r-2 border-black p-1">
                    <input 
                      type="date" 
                      value={item.deliveryDate}
                      onChange={(e) => handleItemChange(item.id, 'deliveryDate', e.target.value)}
                      className="w-full text-center outline-none text-[10px] print:hidden"
                    />
                    <span className="hidden print:block">
                      {item.deliveryDate ? new Date(item.deliveryDate).toLocaleDateString('es-AR') : ''}
                    </span>
                  </td>
                  <td className="p-1 min-h-[30px] flex items-center justify-center">
                    <input 
                      type="checkbox" 
                      checked={item.workerSignature}
                      onChange={(e) => handleItemChange(item.id, 'workerSignature', e.target.checked)}
                      className="w-4 h-4 print:hidden cursor-pointer accent-indigo-600"
                    />
                  </td>
                  <td className="print:hidden p-1 text-center">
                    <button 
                      onClick={() => handleRemoveItem(item.id)}
                      className="text-red-500 hover:text-red-700 transition-colors p-1"
                      title="Eliminar fila"
                    >
                      <Trash2 className="w-4 h-4 mx-auto" />
                    </button>
                  </td>
                </tr>
              ))}
              
              {/* Extra empty rows for printing if needed */}
              {Array.from({ length: Math.max(0, 15 - items.length) }).map((_, i) => (
                <tr key={`empty-${i}`} className="border-b border-black hidden print:table-row">
                  <td className="border-r-2 border-black p-3">&nbsp;</td>
                  <td className="border-r-2 border-black p-3">&nbsp;</td>
                  <td className="border-r-2 border-black p-3">&nbsp;</td>
                  <td className="border-r-2 border-black p-3">&nbsp;</td>
                  <td className="border-r-2 border-black p-3">&nbsp;</td>
                  <td className="border-r-2 border-black p-3">&nbsp;</td>
                  <td className="p-3">&nbsp;</td>
                  <td className="print:hidden p-3">&nbsp;</td>
                </tr>
              ))}
            </tbody>
          </table>
          
          <div className="mt-4">
            <button
              onClick={handleAddItem}
              className="flex items-center gap-2 px-4 py-2 bg-indigo-50 text-indigo-700 hover:bg-indigo-100 rounded-lg text-sm font-bold transition-colors"
            >
              <Plus className="w-4 h-4" />
              Agregar Elemento
            </button>
          </div>
        </div>

        {/* Additional Info */}
        <div className="border-2 border-black p-3 text-sm min-h-[80px]">
          <div className="font-bold mb-1">Información adicional:</div>
          <textarea 
            value={headerData.additionalInfoText}
            onChange={(e) => handleHeaderChange('additionalInfoText', e.target.value)}
            className="w-full h-16 outline-none resize-none print:hidden bg-transparent"
            placeholder="Ingrese información adicional si es necesario..."
          />
          <div className="hidden print:block whitespace-pre-wrap">{headerData.additionalInfoText}</div>
        </div>
      </div>
      
      {/* Digital Control - Signature Verification */}
      <div className="print:hidden mt-8 bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="flex-1">
          <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-indigo-600" />
            Control de Firma Física
          </h3>
          <label className="flex items-start gap-4 p-4 rounded-xl border border-slate-200 cursor-pointer hover:bg-slate-50 transition-colors">
            <input 
              type="checkbox"
              checked={signed}
              onChange={(e) => setSigned(e.target.checked)}
              className="mt-1 w-5 h-5 text-indigo-600 rounded border-slate-300 focus:ring-indigo-500"
            />
            <div>
              <div className="font-bold text-slate-800">Planilla Firmada y Archivada</div>
              <p className="text-sm text-slate-500 mt-1">
                Marca esta casilla cuando hayas impreso esta planilla, el trabajador la haya firmado físicamente, y se encuentre archivada en su legajo.
              </p>
            </div>
          </label>
        </div>
        
        <div className="flex flex-col items-end gap-2 shrink-0">
          <span className="text-xs text-slate-500 font-medium">¿Completaste la edición?</span>
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="flex items-center gap-2 px-8 py-3 bg-indigo-600 text-white hover:bg-indigo-700 rounded-xl text-base font-bold transition-colors disabled:opacity-50 shadow-md shadow-indigo-200"
          >
            <Save className="w-5 h-5" />
            {isSaving ? "Guardando..." : "Guardar Planilla"}
          </button>
        </div>
      </div>

    </div>
  );
}
