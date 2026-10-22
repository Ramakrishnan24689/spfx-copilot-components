import { HERO_BIDS, REQUESTS, SUPPLIERS } from './domain';
import type { ProcurementIntentKey } from './catalog';

export const supplierRecords = HERO_BIDS.map((bid, index) => ({
  ...bid,
  bidId: bid.id,
  id: SUPPLIERS[index].id,
  label: bid.supplier,
  region: SUPPLIERS[index].region
}));
export const purchaseQueue = REQUESTS.filter(request => request.currency === 'EUR').slice(0, 4).map(request => ({
  ...request, label: `${request.id} - ${request.category}`
}));
export const contracts = supplierRecords.slice(0, 3).map((supplier, index) => ({
  id: `ZPC-CON-${101 + index}`, label: `${supplier.supplier} contract`, supplierId: supplier.id,
  annualValue: supplier.price, noticeDays: 42 + index * 14, renewalIncrease: 4 + index
}));
export const purchaseOrders = purchaseQueue.slice(0, 3).map((request, index) => ({
  id: `ZPC-PO-${4108 + index}`, label: `ZPC-PO-${4108 + index}`, requestId: request.id,
  quantity: request.quantity, value: request.budget, neededBy: '2026-11-20'
}));
export const invoices = [
  { id: 'ZPC-8831', label: 'ZPC-8831 - Fabrikam freight', supplier: 'Fabrikam Devices', po: 1034000, received: 1034000, billed: 1049000, tolerance: 5000 },
  { id: 'ZPC-8832', label: 'ZPC-8832 - Contoso partial receipt', supplier: 'Contoso Mobility', po: 1098000, received: 1048000, billed: 1098000, tolerance: 5000 }
];
export const leakageOpportunities = [
  { id: 'ZPC-LEAK-01', label: 'Off-contract device spend', category: 'IT hardware', region: 'EMEA', identified: 146000, negotiated: 124000, contracted: 116000, realized: 99000, disputed: 15000 },
  { id: 'ZPC-LEAK-02', label: 'Duplicate logistics charges', category: 'Logistics', region: 'EMEA', identified: 88000, negotiated: 69000, contracted: 63000, realized: 54000, disputed: 0 },
  { id: 'ZPC-LEAK-03', label: 'Expired facilities rates', category: 'Facilities', region: 'AMER', identified: 52000, negotiated: 38000, contracted: 35000, realized: 33000, disputed: 0 }
];

export const buyingOptions = (quantity: number): readonly { route: string; cost: number; days: number; evidence: string }[] => [
  { route: 'Existing framework contract', cost: Math.round(quantity * HERO_BIDS[0].price / 600), days: 48, evidence: 'Qualified supplier; current contract' },
  { route: 'Reuse plus catalog', cost: Math.round(Math.min(quantity, 240) * 980 + Math.max(0, quantity - 240) * 1830), days: 21, evidence: '240 inspected reusable units; balance from catalog' },
  { route: 'Competitive sourcing event', cost: quantity * 1620, days: 70, evidence: 'Indicative price only; award requires separate review' }
];

export function demandCohort(category: string, region: string, currency: string): typeof REQUESTS {
  return REQUESTS.filter(request => request.category === category && request.currency === currency &&
    (region === 'All regions' || request.region === region));
}

export function diversification(maximumShare: number): readonly number[] {
  const first = Math.max(34, Math.min(80, maximumShare));
  const second = Math.ceil((100 - first) / 2);
  return [first, second, 100 - first - second];
}

export function validNumber(value: number, minimum: number, maximum: number): boolean {
  return Number.isFinite(value) && value >= minimum && value <= maximum;
}

export function validDate(value: string): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const date = new Date(`${value}T00:00:00Z`);
  return !Number.isNaN(date.getTime()) && date.toISOString().slice(0, 10) === value;
}

export function initialSelection(options: readonly { id: string; label: string }[], hint?: string): string {
  if (!hint) return options[0]?.id || '';
  return options.find(option => option.id.toLowerCase() === hint.trim().toLowerCase() ||
    option.label.toLowerCase() === hint.trim().toLowerCase())?.id || hint;
}

export interface IProcurementReceipt {
  readonly id: string;
  readonly intent: ProcurementIntentKey;
  readonly recordId: string;
  readonly action: string;
  readonly summary: string;
}

let receipts: readonly IProcurementReceipt[] = [];
const listeners = new Set<() => void>();
export const getReceipts = (): readonly IProcurementReceipt[] => receipts;
export const subscribeReceipts = (listener: () => void): (() => void) => {
  listeners.add(listener);
  return () => { listeners.delete(listener); };
};
export function recordConfirmation(intent: ProcurementIntentKey, recordId: string, action: string, summary: string): IProcurementReceipt {
  const suffix = String(receipts.length + 1);
  const receipt = { id: `ZPC-SESSION-${'0000'.slice(suffix.length)}${suffix}`, intent, recordId, action, summary };
  receipts = [...receipts, receipt];
  listeners.forEach(listener => listener());
  return receipt;
}
export function resetProcurementSession(): void {
  receipts = [];
  listeners.forEach(listener => listener());
}
