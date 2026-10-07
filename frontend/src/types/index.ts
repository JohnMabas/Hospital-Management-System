// ---- Auth Types ----
export type UserRole = 'patient' | 'doctor' | 'admin' | 'receptionist';

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  role: UserRole;
  isActive: boolean;
  lastLoginAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface AuthState {
  user: User | null;
  accessToken: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
}

// ---- Department ----
export interface Department {
  id: string;
  name: string;
  description?: string;
  icon?: string;
  imageUrl?: string;
  isActive: boolean;
  doctorCount?: number;
  createdAt: string;
  updatedAt: string;
}

// ---- Doctor ----
export interface Doctor {
  id: string;
  userId: string;
  departmentId: string;
  specialization: string;
  bio?: string;
  yearsOfExperience: number;
  licenseNumber?: string;
  consultationFee: number;
  avatarUrl?: string;
  isAvailable: boolean;
  user?: { id: string; firstName: string; lastName: string; email: string; phone?: string };
  department?: { id: string; name: string; icon?: string };
  schedules?: DoctorSchedule[];
  createdAt: string;
  updatedAt: string;
}

// ---- Patient ----
export interface Patient {
  id: string;
  userId: string;
  dateOfBirth?: string;
  gender?: 'male' | 'female' | 'other';
  bloodGroup?: string;
  genotype?: string;
  address?: string;
  state?: string;
  lga?: string;
  emergencyContactName?: string;
  emergencyContactPhone?: string;
  nhisNumber?: string;
  user?: User;
}

// ---- Schedule ----
export interface DoctorSchedule {
  id: string;
  doctorId: string;
  dayOfWeek: string;
  startTime: string;
  endTime: string;
  slotDurationMinutes: number;
  isActive: boolean;
}

export interface TimeSlot {
  time: string;
  available: boolean;
}

// ---- Appointment ----
export type AppointmentStatus = 'pending' | 'confirmed' | 'completed' | 'cancelled';

export interface Appointment {
  id: string;
  patientId: string;
  doctorId: string;
  departmentId: string;
  appointmentDate: string;
  timeSlot: string;
  reason: string;
  status: AppointmentStatus;
  notes?: string;
  cancellationReason?: string;
  patient?: Patient;
  doctor?: Doctor;
  department?: Department;
  medicalRecord?: MedicalRecord;
  createdAt: string;
  updatedAt: string;
}

// ---- Medical Record ----
export interface MedicalRecord {
  id: string;
  patientId: string;
  doctorId: string;
  appointmentId?: string;
  diagnosis: string;
  prescription?: string;
  labResults?: object[];
  notes?: string;
  followUpDate?: string;
  doctor?: Doctor;
  patient?: Patient;
  appointment?: Appointment;
  createdAt: string;
  updatedAt: string;
}

// ---- Service ----
export interface Service {
  id: string;
  name: string;
  description?: string;
  price: number;
  departmentId?: string;
  isActive: boolean;
  icon?: string;
  department?: Department;
}

// ---- Blog Post ----
export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt?: string;
  content?: string;
  authorId?: string;
  imageUrl?: string;
  category?: string;
  tags?: string[];
  isPublished: boolean;
  publishedAt?: string;
  viewCount: number;
  author?: { firstName: string; lastName: string };
}

// ---- Testimonial ----
export interface Testimonial {
  id: string;
  name: string;
  role?: string;
  message: string;
  rating: number;
  avatarUrl?: string;
  isVisible: boolean;
}

// ---- Contact ----
export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
  isRead: boolean;
  createdAt: string;
}

// ---- API Response ----
export interface ApiResponse<T = unknown> {
  success: boolean;
  message: string;
  data?: T;
  errors?: Array<{ field: string; message: string }>;
  meta?: PaginationMeta;
}

export interface PaginationMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

// ---- Admin Stats ----
export interface AdminStats {
  totalPatients: number;
  totalDoctors: number;
  totalAppointments: number;
  appointmentsToday: number;
  unreadMessages: number;
  estimatedRevenue: number;
  appointmentsByStatus: {
    pending: number;
    confirmed: number;
    completed: number;
    cancelled: number;
  };
}
