import { useSelector } from 'react-redux';

export default function Toast() {
  const { toasts } = useSelector((state: any) => state.toasts);

  return (
    <div className="toast-container position-fixed top-0 end-0 p-3">
      {
        toasts.map((item:any) => {
          return (
            <div className="toast show bg-light" key={item.id}>
              <div className={`toast-header bg-${item.color}`}>
                <strong className="me-auto text-light">{item.title}</strong>
                <button type="button" className="btn-close btn-close-white" data-bs-dismiss="toast" aria-label="Close"></button>
              </div>
              <div className="toast-body">
                {item.content}
              </div>
            </div>
          )
        })
      }
    </div>
  )
}