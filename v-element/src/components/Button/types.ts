import type { PropType } from 'vue'
export type ButtonType = 'primary'| 'success'| 'warning'| 'danger'| 'info'
export type ButtonSize = 'normal' | 'large'  | 'small'
export type NativeType = 'button' | 'submit' | 'reset'

export interface ButtonProps {
  type?: ButtonType;  //类型
  size?: ButtonSize; //大小
  plain?: boolean;  //朴素
  round?: boolean; //圆角
  circle?: boolean; //圆形按钮，适合图标
  disabled?: boolean; //禁用状态
  nativeType?: NativeType; //
  autofocus?: boolean;
  icon?: string;
  loading?: boolean;
}
export interface ButtonInstance {
  ref: HTMLButtonElement
}


export const buttonProps = {
  type: {
    type: String as PropType<ButtonType>
  },
  size: {
    type: String as PropType<ButtonSize>,
  },
  plain: {
    type: Boolean
  },
  round: {
    type: Boolean
  },
  circle: {
    type: Boolean
  },
  disabled: {
    type: Boolean
  },
}