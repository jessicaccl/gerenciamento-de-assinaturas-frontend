import { useNavigate, useLocation } from "react-router-dom";
import { FaChartPie, FaUserFriends, FaBoxOpen, FaFileInvoiceDollar, FaReceipt } from "react-icons/fa";
import { MdOutlineExitToApp } from "react-icons/md";
import { BiUserCircle } from "react-icons/bi";

import logoImg from "../../../assets/images/logo-icone.svg";
import logoWhiteImg from '../../../assets/images/logo-icone-branco.svg';
import { SidebarStyle } from "./styles";

import { type UsuarioLogado } from "../../../services/AuthService";

interface SidebarProps {
  logOut: () => void;
  windowSize: number;
  user: UsuarioLogado | null;
}

function Sidebar({ logOut, user }: SidebarProps) {
  const navigate = useNavigate();
  const location = useLocation();

  function navigateTo(route: string) {
    window.scrollTo(0, 0);
    navigate(route);
  }

  function navigateToProfile() {
    navigate('/perfil');
  }

  const isActive = (path: string) => location.pathname === path;

  return (
    <SidebarStyle $whiteLogoUrl={logoWhiteImg}>
      <div className="column-container">

        <div className="logo-area" onClick={() => navigateTo("/home")}>
          <img src={logoImg} alt="Assina+ - ir para o dashboard" />
        </div>

        <div className="sidebar-nav">

          <div className="sidebar-nav-item">
            <div
              onClick={() => navigateTo("/home")}
              className={`area-icons-label ${isActive('/home') ? 'active' : ''}`}
            >
              <FaChartPie title="Início" />
              <span className="label-sidebar">Início</span>
            </div>
          </div>

          <div className="sidebar-nav-item">
            <div
              onClick={() => navigateTo("/planos")}
              className={`area-icons-label ${isActive('/planos') ? 'active' : ''}`}
            >
              <FaBoxOpen title="Planos" />
              <span className="label-sidebar">Planos</span>
            </div>
          </div>

          <div className="sidebar-nav-item">
            <div
              onClick={() => navigateTo("/assinaturas")}
              className={`area-icons-label ${isActive('/assinaturas') ? 'active' : ''}`}
            >
              <FaFileInvoiceDollar title="Assinaturas" />
              <span className="label-sidebar">Assinaturas</span>
            </div>
          </div>

          <div className="sidebar-nav-item">
            <div
              onClick={() => navigateTo("/cobrancas")}
              className={`area-icons-label ${isActive('/cobrancas') ? 'active' : ''}`}
            >
              <FaReceipt title="Cobranças" />
              <span className="label-sidebar">Cobranças</span>
            </div>
          </div>

          <div className="sidebar-nav-item">
            <div
              onClick={() => navigateTo("/usuarios")}
              className={`area-icons-label ${isActive('/usuarios') ? 'active' : ''}`}
            >
              <FaUserFriends title="Usuários" />
              <span className="label-sidebar">Usuários</span>
            </div>
          </div>

        </div>

        <div className="footer-group">

          <div className="user-container" onClick={navigateToProfile} title="Ver meu perfil">
            <BiUserCircle />
            <span className="label-sidebar">
              {user ? user.nome.split(' ')[0] : '...'}
            </span>
          </div>

          <div onClick={logOut} className="logout-btn">
            <MdOutlineExitToApp title="Sair" />
            <span>Sair</span>
          </div>
        </div>

      </div>
    </SidebarStyle>
  );
}

export default Sidebar;