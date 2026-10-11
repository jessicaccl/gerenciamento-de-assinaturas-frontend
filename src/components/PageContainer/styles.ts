import styled from "styled-components";

export const PageContainerStyle = styled.div`
  height: 100vh;  
  width: 100%; 
  background-color: var(--branco-primario);
  
  display: flex; 
  flex-direction: column;

  overflow: hidden; 

  @media (min-width: 992px) {
    flex-direction: row;
    padding-left: 110px; 
   
  }
`;