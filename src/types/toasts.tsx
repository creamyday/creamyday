// toast
export interface ToastItem {
  id: string;
  color: string;
  title: string;
  content: string;
}

export interface ToastState {
  toasts: ToastItem[];
}

export interface ToastMsg{
  success:boolean,
  message:string,
}