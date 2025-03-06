import { PropsWithChildren, ReactElement, ReactNode } from "react";

type TPageHeaderWithActions = {
  isAdmin?: boolean;
  title: string | ReactElement;
  subtitle?: string | ReactElement;
  renderActions?: () => ReactNode;
  renderBreadcrumbs?: () => ReactNode;
};

export default function PageHeaderWithActions({
  children,
  title,
  subtitle,
  renderActions,
  renderBreadcrumbs,
}: PropsWithChildren<TPageHeaderWithActions>) {
  return (
    <>
      {renderBreadcrumbs && (
        <div className="sm:-mb-4">{renderBreadcrumbs()}</div>
      )}
      <header className="space-y-4">
        <div className="flex flex-col items-start justify-between gap-2 sm:flex-row sm:gap-0">
          <hgroup>
            <h1 className="text-3xl font-semibold">{title}</h1>
            {subtitle && <span className="text-sm font-light">{subtitle}</span>}
          </hgroup>
          {renderActions && renderActions()}
        </div>
        {children}
      </header>
    </>
  );
}
