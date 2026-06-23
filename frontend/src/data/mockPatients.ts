export interface Patient {
  id: string;
  medicalRecordNumber: string;
  name: string;
  age: number;
  gender: 'Laki-laki' | 'Perempuan';
  lastVisit: string;
  status: 'Aktif' | 'Selesai';
}

export const mockPatients: Patient[] = [
  {
    id: "P001",
    medicalRecordNumber: "RM-2024-001",
    name: "Bapak Budi Santoso",
    age: 58,
    gender: "Laki-laki",
    lastVisit: "2024-06-10",
    status: "Aktif",
  },
  {
    id: "P002",
    medicalRecordNumber: "RM-2024-002",
    name: "Ibu Siti Aminah",
    age: 62,
    gender: "Perempuan",
    lastVisit: "2024-06-12",
    status: "Aktif",
  },
  {
    id: "P003",
    medicalRecordNumber: "RM-2024-003",
    name: "Bapak Ahmad Dahlan",
    age: 55,
    gender: "Laki-laki",
    lastVisit: "2024-05-20",
    status: "Selesai",
  }
];
