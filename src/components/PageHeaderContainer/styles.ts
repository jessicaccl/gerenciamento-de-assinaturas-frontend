import styled from "styled-components";

export const PageHeaderContainerStyle = styled.header`
  width: 100%;
  min-height: 4rem;
  background: var(--gradiente-marca);
  border-radius: 1rem 1rem 0 0;
  
  display: flex;
  align-items: center;
  justify-content: space-between; 
  padding: 0 2rem;
  color: var(--branco);

  .header-title {
    display: flex;
    align-items: center;
    gap: 1rem;
    font-size: 1.5rem;
    font-weight: 600;

    svg {
      font-size: 1.8rem;
    }
  }

  .header-actions {
    display: flex;
    align-items: center;
    gap: 1rem;
  }

  @media (max-width: 576px) {
    padding: 0.75rem 1.25rem;
    flex-wrap: wrap;
    gap: 0.75rem;

    .header-title {
      font-size: 1.2rem;
      gap: 0.6rem;

      svg { font-size: 1.4rem; }
    }
  }
`;