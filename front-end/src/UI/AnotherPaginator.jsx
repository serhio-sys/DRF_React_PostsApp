export default function AnotherPaginator (props) {

    function PageWork(nextOrPrev){
        if (nextOrPrev==="next"){
            props.setPage(props.selectedPage+1)
        }
        else{    
            props.setPage(props.selectedPage-1)
        }
    }

    return (
        <ul className="paginator">
            {props.previous!=null
            ?<li className='link' onClick={()=>PageWork("prev")}>&laquo;</li>
            :<li className='link active-link'>&laquo;</li>
            }
                {props.links}
            {props.next!=null
            ?<li className='link' onClick={()=>PageWork("next")}>&raquo;</li>
            :<li className='link active-link'>&raquo;</li>
            }
        </ul>
    )
}