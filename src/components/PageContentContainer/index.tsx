import React from "react";
import { PageContentContainerStyle } from "./styles";

interface PageContentContainerProps {
  children: React.ReactNode;
}

function PageContentContainer({ children }: PageContentContainerProps) {
  return (
    <PageContentContainerStyle>
      {children}
    </PageContentContainerStyle>
  );
}

export default PageContentContainer;