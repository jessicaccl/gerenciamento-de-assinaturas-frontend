import React from 'react';
import { PageContainerStyle } from './styles';

interface PageContainerProps {
    children: React.ReactNode;
}

function PageContainer({ children }: PageContainerProps) {
    return (
        <PageContainerStyle>
            {children}
        </PageContainerStyle>
    );
}

export default PageContainer;