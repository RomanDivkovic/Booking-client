import React from "react";
import { CSSTransition, TransitionGroup } from "react-transition-group";
import { useLocation } from "@tanstack/react-router";

interface PageTransitionProps {
  children: React.ReactNode;
}

export const PageTransition: React.FC<PageTransitionProps> = ({ children }) => {
  const location = useLocation();

  return (
    <TransitionGroup>
      <CSSTransition
        key={location.pathname}
        classNames="page"
        timeout={300}
        unmountOnExit={false}
      >
        <div className="page-transition">{children}</div>
      </CSSTransition>
    </TransitionGroup>
  );
};
