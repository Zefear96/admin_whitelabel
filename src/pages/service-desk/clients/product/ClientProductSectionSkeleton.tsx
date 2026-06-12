import type { ReactNode } from "react";
import { Card, Skeleton } from "antd";

interface ClientProductSectionSkeletonProps {
  header: ReactNode;
}

export function ClientProductSectionSkeleton({ header }: ClientProductSectionSkeletonProps) {
  return (
    <Card>
      {header}
      <Skeleton active title={false} paragraph={{ rows: 5 }} />
    </Card>
  );
}
