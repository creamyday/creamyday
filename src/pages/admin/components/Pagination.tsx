
type PaginationProps = {
  hasPre: boolean, 
  hasNext:boolean, 
  currentPage: number, 
  totalPage: number, 
  getProducts: (page: number) => Promise<void> | void,
}

export default function Pagination({hasPre, hasNext, currentPage, totalPage, getProducts}: PaginationProps) {
  return (
    <nav aria-label="Page navigation">
      <ul className="pagination">
        <li className="page-item"><a className={`page-link ${hasPre? "" : "disabled"}`} href="#"
          onClick={(e)=>{
            e.preventDefault();
            if(!hasPre) return
            getProducts(currentPage - 1);
          }}
        >Previous</a></li>
        {
          [...Array(totalPage)].map((_, p) => {
            return (
              <li className="page-item"  key={`page-${p}`}><a className={`page-link ${currentPage === p+1 ? "active" : ""}`} href="#"
                onClick={(e)=>{
                  e.preventDefault();
                  getProducts(p+1);
                }}
              >{p+1}</a></li>
            )
          })
        }
        <li className={`page-item ${hasNext? "" : "disabled"}`}><a className="page-link" href="#"
          onClick={(e)=>{
            e.preventDefault();
            if(!hasNext) return
            getProducts(currentPage + 1);
          }}
        >Next</a></li>
      </ul>
    </nav>
  )
}