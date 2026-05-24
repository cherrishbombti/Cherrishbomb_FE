import { axiosInstance } from './axiosInstance';
import type { WardSummary, SensorData, Contact, AddContactRequest, RegisterWardRequest, RegisterWardResponse } from '../types/guardian';

// ✅ Mock 해제 — 실제 백엔드 연결
const USE_MOCK = false;

function mockDelay<T>(data: T, ms = 500): Promise<T> {
  return new Promise((res) => setTimeout(() => res(data), ms));
}

// ── Mock 데이터 (USE_MOCK=true 시에만 사용) ────────────────────
const MOCK_SUMMARY: WardSummary = {
  wardName: '김영희',
  relationship: '어머니',
  phone: '010-5555-6666',
  status: 'SAFE',
  totalActivityMinutes: 390,
  lastActivityMinutes: 10,
  lastUpdatedAt: new Date(Date.now() - 1000 * 60 * 5).toISOString(),
};

const MOCK_SENSOR: SensorData = {
  sensorId: 1,
  name: '낙상 감지 센서',
  isConnected: true,
  battery: 92,
  signalStrength: 'strong',
  lastUpdatedMinutes: 2,
  location: '집 (침실)',
};

let MOCK_CONTACTS: Contact[] = [
  { contactId: 1, name: '홍길동', relationship: '아들', phone: '010-1234-5678', priority: 1 },
  { contactId: 2, name: '이영희', relationship: '딸',   phone: '010-2345-6789', priority: 2 },
  { contactId: 3, name: '박철수', relationship: '담당 복지사', phone: '010-3456-7890', priority: 3 },
];

// GET /api/wards/me/summary
export async function getWardSummary(): Promise<WardSummary> {
  if (USE_MOCK) return mockDelay(MOCK_SUMMARY);
  const { data } = await axiosInstance.get<WardSummary>('/api/wards/me/summary');
  return data;
}

// GET /api/wards/me/sensors
export async function getWardSensors(): Promise<SensorData[]> {
  if (USE_MOCK) return mockDelay([MOCK_SENSOR]);
  const { data } = await axiosInstance.get<SensorData[]>('/api/wards/me/sensors');
  return data;
}

// GET /api/wards/me/contacts
export async function getWardContacts(): Promise<Contact[]> {
  if (USE_MOCK) return mockDelay([...MOCK_CONTACTS]);
  const { data } = await axiosInstance.get<Contact[]>('/api/wards/me/contacts');
  return data;
}

// POST /api/wards/me/contacts
export async function addWardContact(body: AddContactRequest): Promise<Contact> {
  if (USE_MOCK) {
    const newContact: Contact = {
      contactId: Date.now(),
      ...body,
      priority: MOCK_CONTACTS.length + 1,
    };
    MOCK_CONTACTS.push(newContact);
    return mockDelay(newContact);
  }
  const { data } = await axiosInstance.post<Contact>('/api/wards/me/contacts', body);
  return data;
}

// PUT /api/wards/me/contacts/priority
export async function updateContactPriority(contacts: Contact[]): Promise<void> {
  if (USE_MOCK) {
    MOCK_CONTACTS = contacts.map((c, i) => ({ ...c, priority: i + 1 }));
    return mockDelay(undefined);
  }
  await axiosInstance.put('/api/wards/me/contacts/priority', {
    contacts: contacts.map((c, i) => ({ contactId: c.contactId, priority: i + 1 })),
  });
}

// POST /api/wards/me (최초 피보호자 등록)
export async function registerWard(body: RegisterWardRequest): Promise<RegisterWardResponse> {
  if (USE_MOCK) {
    const mock: RegisterWardResponse = {
      wardId: Date.now(),
      ...body,
      createdAt: new Date().toISOString(),
    };
    return mockDelay(mock, 800);
  }
  const { data } = await axiosInstance.post<RegisterWardResponse>('/api/wards/me', body);
  return data;
}
