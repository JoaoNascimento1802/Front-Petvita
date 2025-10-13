import { Route, Routes } from "react-router-dom";
import PrivateRoute from './PrivateRoute';

// Imports das páginas Públicas e do Cliente
import Home from "../pages/Home";
import ProfileScreen from "../pages/Perfil";
import Pets from "../pages/Pets/PetsProfile";
import AddPet from "../pages/Pets/AddPets";
import ConversationList from '../pages/Chat/ConversationList';
import PetsDetails from "../pages/Pets/PetsDetails";
import ConsulPending from "../pages/Consultations/ConsulPending";
import ScheduleAppointment from "../pages/Consultations/ScheduleAppointment";
import ResetPasswordPage from '../pages/ResetPassword/index';
import Chat from "../pages/Chat/Chat";

// Imports do Vet
import VetDashboard from '../pages/Vet/Dashboard/Dashboard';
import VetConsultas from '../pages/Vet/Consultas/Consultas';
import VetRelatorios from '../pages/Vet/Relatorios/Relatorios';
import VetDetalhesConsulta from '../pages/Vet/DetalhesConsulta/DetalhesConsulta';
import VetPerfil from '../pages/Vet/Perfil/Perfil';
import VetChat from '../pages/Vet/Chat/Chat';
import WorkSchedule from "../pages/Vet/WorkSchedule";

// Imports do Admin
import VetList from '../pages/admin/VetList/VetList';
import AdminDashboard from "../pages/admin/Dashboard/Dashboard";
import PacientesList from '../pages/admin/PacientesList/PacientesList';
import AdminConsultas from '../pages/admin/Consultas/Consultas';
import AdminRelatorios from '../pages/admin/Relatorios/Relatorios';
import AdminPerfil from '../pages/admin/Perfil/Perfil';
import AdminChat from '../pages/admin/Chat/Chat';
import ClinicServices from "../pages/admin/ClinicServices";
// CORREÇÃO: Import da lista de funcionários
import EmployeeList from "../pages/admin/EmployeeList";
import EmployeeDashboard from "../pages/Employee/Dashboard";

// Imports que podem estar faltando
import ModalRegisterUser from "../components/ModalRegisterUser";
import ModalRegisterVet from "../components/ModalRegisterVet";
import AbaoutUs from "../pages/AboutUs";
import App from "../pages/App";
import ConsulCompleted from "../pages/Consultations/ConsulCompleted";
import ConsulCompleteDetails from "../pages/Consultations/ConsulCompletedDetails";
import ConsulDetails from "../pages/Consultations/ConsulDetails";

export default function AppRoutes() {
  return (
    <Routes>
      {/* === Rotas Públicas === */}
      <Route path="/" element={<Home />} />
      <Route path="/register-user" element={<ModalRegisterUser />} />
      <Route path="/register-vet" element={<ModalRegisterVet />} />
      <Route path="/sobre-nos" element={<AbaoutUs />} />
      <Route path="/app" element={<App />} />
      <Route path="/reset-password" element={<ResetPasswordPage />} />
      
      {/* === Rotas do Cliente (USER) === */}
      <Route path="/perfil" element={<PrivateRoute requiredRole="USER"><ProfileScreen /></PrivateRoute>} />
      <Route path="/pets" element={<PrivateRoute requiredRole="USER"><Pets /></PrivateRoute>} />
      <Route path="/add-pet" element={<PrivateRoute requiredRole="USER"><AddPet /></PrivateRoute>} />
      <Route path="/pets-details/:petId" element={<PrivateRoute requiredRole="USER"><PetsDetails /></PrivateRoute>} />
      <Route path="/consultas" element={<PrivateRoute requiredRole="USER"><ConsulPending /></PrivateRoute>} />
      <Route path="/consultas/concluidas" element={<PrivateRoute requiredRole="USER"><ConsulCompleted /></PrivateRoute>} />
      <Route path="/detalhes-consulta/:consultaId" element={<PrivateRoute requiredRole="USER"><ConsulDetails /></PrivateRoute>} />
      <Route path="/detalhes-consulta-concluida/:consultaId" element={<PrivateRoute requiredRole="USER"><ConsulCompleteDetails /></PrivateRoute>} />
      <Route path="/agendar-consulta" element={<PrivateRoute requiredRole="USER"><ScheduleAppointment /></PrivateRoute>} />
      <Route path="/conversations" element={<PrivateRoute requiredRole="USER"><ConversationList /></PrivateRoute>} />
      <Route path="/chat/:consultationId" element={<PrivateRoute requiredRole="USER"><Chat /></PrivateRoute>} />

      {/* === Rotas do Veterinário (VETERINARY) === */}
      <Route path="/vet/dashboard" element={<PrivateRoute requiredRole="VETERINARY"><VetDashboard /></PrivateRoute>} />
      <Route path="/vet/consultas" element={<PrivateRoute requiredRole="VETERINARY"><VetConsultas /></PrivateRoute>} />
      <Route path="/vet/relatorios" element={<PrivateRoute requiredRole="VETERINARY"><VetRelatorios /></PrivateRoute>} />
      <Route path="/vet/consultas/:consultaId" element={<PrivateRoute requiredRole="VETERINARY"><VetDetalhesConsulta /></PrivateRoute>} />
      <Route path="/vet/chat" element={<PrivateRoute requiredRole="VETERINARY"><VetChat /></PrivateRoute>} />
      <Route path="/vet/perfil" element={<PrivateRoute requiredRole="VETERINARY"><VetPerfil /></PrivateRoute>} />
      <Route path="/vet/schedule" element={<PrivateRoute requiredRole="VETERINARY"><WorkSchedule /></PrivateRoute>} />

      {/* === Rotas do Administrador (ADMIN) === */}
      <Route path="/admin/dashboard" element={<PrivateRoute requiredRole="ADMIN"><AdminDashboard /></PrivateRoute>} />
      <Route path="/admin/veterinarios" element={<PrivateRoute requiredRole="ADMIN"><VetList /></PrivateRoute>} />
      <Route path="/admin/pacientes" element={<PrivateRoute requiredRole="ADMIN"><PacientesList /></PrivateRoute>} />
      {/* CORREÇÃO: Rota para gerenciar funcionários */}
      <Route path="/admin/funcionarios" element={<PrivateRoute requiredRole="ADMIN"><EmployeeList /></PrivateRoute>} />
      <Route path="/admin/consultas" element={<PrivateRoute requiredRole="ADMIN"><AdminConsultas /></PrivateRoute>} />
      <Route path="/admin/relatorios" element={<PrivateRoute requiredRole="ADMIN"><AdminRelatorios /></PrivateRoute>} />
      <Route path="/admin/perfil" element={<PrivateRoute requiredRole="ADMIN"><AdminPerfil /></PrivateRoute>} />
      <Route path="/admin/chat" element={<PrivateRoute requiredRole="ADMIN"><AdminChat /></PrivateRoute>} />
      <Route path="/admin/services" element={<PrivateRoute requiredRole="ADMIN"><ClinicServices /></PrivateRoute>} />

      {/* === Rota do Funcionário (EMPLOYEE) === */}
      <Route path="/employee/dashboard" element={<PrivateRoute requiredRole="EMPLOYEE"><EmployeeDashboard /></PrivateRoute>} />
    </Routes>
  );
}

