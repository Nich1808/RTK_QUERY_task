import { increment } from "@/lip/features/counter/counterSlice"
import { useAppDispatch, useAppSelector } from "@/lip/hooks"

export function Card() {
  const count = useAppSelector((state) => state.counter.value)
  const dispatch = useAppDispatch()

  return(
    <section>
      <h2>{count}</h2>
      <button onClick={()=> dispatch(increment())}>Increase</button>
    </section>
  )
}