import React from "react";
import { Row, Col } from "react-bootstrap";
import { PageHeaderContainerStyle } from "./styles";

interface PageHeaderContainerProps {
  title: string;
  icon?: React.ReactNode;
  children?: React.ReactNode;
}

function PageHeaderContainer({ title, icon, children }: PageHeaderContainerProps) {
  return (
    <Row>
      <Col xs={12} className="px-0">
        <PageHeaderContainerStyle>
          <div className="header-title">
            {icon}
            <span>{title}</span>
          </div>

          {children && <div className="header-actions">{children}</div>}
        </PageHeaderContainerStyle>
      </Col>
    </Row>
  );
}

export default PageHeaderContainer;