import type { Placement, Options } from '@popperjs/core'
export interface TooltipProps {
  content? : string;
  trigger?: 'hover' | 'click';
  placement?: Placement;
  manual?: boolean;
  popperOptions?: Partial<Options>;
  transition?: string;
  openDelay?: number;
  closeDelay?: number;
}

//TooltipEmits 是一个接口，它描述了组件可以发射的两种类型的事件：
//visible-change 和 click-outside
//每种事件都需要传入两个参数：事件名称和值
export interface TooltipEmits {
  (e: 'visible-change', value: boolean) : void;
  (e: 'click-outside', value: boolean) : void;
}

export interface TooltipInstance {
  show: () => void;
  hide: () => void;
}