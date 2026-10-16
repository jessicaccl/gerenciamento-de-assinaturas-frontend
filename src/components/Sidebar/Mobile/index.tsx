import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Offcanvas } from "react-bootstrap";

import logoImg from "../../../assets/images/logo-icone.svg";
import logoWhiteImg from '../../../assets/images/logo-icone-branco.svg';

import {
  FaBars,
  FaChartPie,
  FaBoxOpen,
  FaUserFriends,
  FaFileInvoiceDollar,
  FaReceipt,
  FaSignOutAlt,
  FaTimes
} from "react-icons/fa";
import { BiUserCircle } from "react-icons/bi";

import {
  SidebarMobileStyle,
  SidebarMobileNavStyle,
  LogoArea,
  CloseIconArea,
} from "./styles";

import { type UsuarioLogado } from "../../../services/AuthService";

interface SidebarMobileProps {
  logOut: () => void;
  user: UsuarioLogado | null;
}

function SidebarMobile({ logOut, user }: SidebarMobileProps) {
  const [show, setShow] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  function navigateTo(route: string) {
    setShow(false);
    window.scrollTo(0, 0);
    navigate(route);
  }

  function navigateToProfile() {
    setShow(false);
    navigate('/perfil');
  }

  const isActive = (path: string) => location.pathname === path;

  return (
    <SidebarMobileStyle $whiteLogoUrl={logoWhiteImg}>

      <div className="button-show-area">
        <div className="button-show">
          <FaBars onClick={handleShow} />
        </div>

        <div className="central-area">
          <img src={logoImg} alt="" />
          <span>Assina+</span>
        </div>

        <div className="right-area">
          <BiUserCircle />
        </div>
      </div>

      <Offcanvas show={show} onHide={handleClose} placement="start" style={{ maxWidth: '85%' }}>
        <Offcanvas.Header style={{ borderBottom: '1px solid #f0f0f0' }}>
          <Offcanvas.Title>
            <LogoArea $whiteLogoUrl={logoWhiteImg}>
              <img src={logoImg} alt="" />
              <span>Menu Principal</span>
            </LogoArea>
          </Offcanvas.Title>
          <CloseIconArea>
            <FaTimes onClick={handleClose} />
          </CloseIconArea>
        </Offcanvas.Header>

        <Offcanvas.Body>
          <SidebarMobileNavStyle>
            <div className="sidebar-mobile-nav">

              <div className="sidebar-nav-item">
                <div
                  onClick={() => navigateTo("/home")}
                  className={`area-icons-label ${isActive('/home') ? 'active' : ''}`}
                >
                  <FaChartPie />
                  <span>Início</span>
                </div>
              </div>

              <div className="sidebar-nav-item">
                <div
                  onClick={() => navigateTo("/planos")}
                  className={`area-icons-label ${isActive('/planos') ? 'active' : ''}`}
                >
                  <FaBoxOpen />
                  <span>Planos</span>
                </div>
              </div>

              <div className="sidebar-nav-item">
                <div
                  onClick={() => navigateTo("/assinaturas")}
                  className={`area-icons-label ${isActive('/assinaturas') ? 'active' : ''}`}
                >
                  <FaFileInvoiceDollar />
                  <span>Assinaturas</span>
                </div>
              </div>

              <div className="sidebar-nav-item">
                <div
                  onClick={() => navigateTo("/cobrancas")}
                  className={`area-icons-label ${isActive('/cobrancas') ? 'active' : ''}`}
                >
                  <FaReceipt />
                  <span>Cobranças</span>
                </div>
              </div>

              <div className="sidebar-nav-item">
                <div
                  onClick={() => navigateTo("/usuarios")}
                  className={`area-icons-label ${isActive('/usuarios') ? 'active' : ''}`}
                >
                  <FaUserFriends />
                  <span>Usuários</span>
                </div>
              </div>

              <div className="sidebar-nav-item mt-3">
                <div onClick={() => { setShow(false); logOut(); }} className="area-icons-label logout">
                  <FaSignOutAlt />
                  <span>Sair do Sistema</span>
                </div>
              </div>
            </div>

            <div className="user-container" onClick={navigateToProfile}>
              <BiUserCircle />
              <div className="user-info">
                <span className="label-sidebar">
                  {user ? user.nome : 'Carregando...'}
                </span>

                <span id="user-department">
                  {user?.cargo || 'Colaborador'}
                </span>
              </div>
            </div>

          </SidebarMobileNavStyle>
        </Offcanvas.Body>
      </Offcanvas>
    </SidebarMobileStyle>
  );
}

export default SidebarMobile;