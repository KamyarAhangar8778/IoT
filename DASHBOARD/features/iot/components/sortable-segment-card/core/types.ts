export interface SegmentData {
  id: string;
  type: string;
  pin: string;
  title: string;
  group?: string;
  icon?: string;
  state?: boolean;
  mode?: "switch" | "push";
  auto_off?: number;
  off_label?: string;
  on_label?: string;
  offLabel?: string;
  onLabel?: string;
  rule?: {
    highActions?: Array<{
      reqHold: number;
      targetPin: string;
      actionOn: boolean;
      actionType?: number;
      delay?: number;
    }>;
    lowActions?: Array<{
      reqHold: number;
      targetPin: string;
      actionOn: boolean;
      actionType?: number;
      delay?: number;
    }>;
  };
}

export interface SortableSegmentCardProps {
  segment: SegmentData;
  isPinOn?: boolean;
  onRemove: (id: string) => void;
  onTogglePin: (pin: string) => void;
  onSetPinState?: (pin: string, state: boolean, preventMqtt?: boolean) => void;
  onUpdateSegmentMode?: (id: string, mode: "switch" | "push") => void;
  onUpdateSegmentAutoOff?: (id: string, autoOff: number) => void;
  onUpdateSegmentLabels?: (id: string, offLabel?: string, onLabel?: string) => void;
  onUpdateSegmentRule?: (
    id: string,
    rule: {
      highActions?: Array<{
        reqHold: number;
        targetPin: string;
        actionOn: boolean;
        actionType?: number;
        delay?: number;
      }>;
      lowActions?: Array<{
        reqHold: number;
        targetPin: string;
        actionOn: boolean;
        actionType?: number;
        delay?: number;
      }>;
    },
  ) => void;
  isLoadingIoT: boolean;
  onSetupPlaceholder?: (id: string) => void;
  parentGroupsCols?: number;
  groupMaxCols?: number;
  groupItemsCount?: number;
  index?: number;
  animationsEnabled?: boolean;
  isOverlayItem?: boolean;
  dashboardWidth?: number;
  isMobilePortrait?: boolean;
}
