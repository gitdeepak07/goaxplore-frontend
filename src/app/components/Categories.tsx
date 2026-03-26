import { useNavigate } from "react-router-dom"

export default function Categories(){

const navigate = useNavigate()

const activities = [
  "Jet Skiing",
  "Parasailing",
  "Scuba Diving",
  "Kayaking"
]

return(

<div className="grid grid-cols-4 gap-4">

{activities.map((a)=>(
<div
key={a}
className="card"
onClick={()=>navigate(`/providers/${a}`)}
>

<h3>{a}</h3>
<button>Book Now</button>

</div>
))}

</div>

)

}