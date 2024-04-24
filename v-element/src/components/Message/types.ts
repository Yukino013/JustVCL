import type { VNode, ComponentInternalInstance } from 'vue'

export interface MessageProps {
  message?: string | VNode;
  //可选，经过多长时间对话框关闭
  duration?: number;
  //可选,按钮，可以提前关闭对话框
  showClose?: boolean;
  //可选,类型
  type?: 'success'| 'info'| 'warning'| 'danger';
  //必选,清除函数
  onDestory: () => void;
  id: string;
  zIndex: number;
  //偏移值
  offset?: number;
  transitionName?: string;
}
//Message组件内容
export interface MessageContext {
  //唯一标识message
  id: string;
  vnode: VNode;
  vm: ComponentInternalInstance;
  props: MessageProps;
  destory: () => void;
}

//Omit作用
//要操作的类型MessageProps，要忽略的对应属性'onDestory' | 'id' | 'zIndex'
export type CreateMessageProps = Omit<MessageProps, 'onDestory' | 'id' | 'zIndex'>