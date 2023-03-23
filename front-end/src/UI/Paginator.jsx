export default function Navbar (props) {

    function PageWork(url){
        const page = String(url)
        console.log(page)
        if (page[page.length-1]==="/") {
                props.setPage(1)
        }
        else{
            const num = Number(page[page.length-1])
            if (!num.isNaN) {
                props.setPage(num)   
            }
        }
    }

    return (
        <ul className="paginator">
            {props.previous!=null
            ?<li className='link' onClick={()=>PageWork(props.previous)}>&laquo;</li>
            :<li className='link active-link'>&laquo;</li>
            }
                {props.links}
            {props.next!=null
            ?<li className='link' onClick={()=>PageWork(props.next)}>&raquo;</li>
            :<li className='link active-link'>&raquo;</li>
            }
        </ul>
    )
}