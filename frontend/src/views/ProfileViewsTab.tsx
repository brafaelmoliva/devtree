// src/views/ProfileViewsTab.tsx
import { useQueryClient } from '@tanstack/react-query'
import { useEffect, useState } from 'react'
import { User } from '../types'

export default function ProfileViewsTab() {
    const queryClient = useQueryClient()
    const data: User = queryClient.getQueryData(['user'])!
    const [count, setCount] = useState(0)

    // Animación de contador
    useEffect(() => {
        let start = 0
        const end = data.profileViews
        const duration = 1000
        const increment = end / (duration / 10)

        const animate = () => {
            start += increment
            if (start < end) {
                setCount(Math.floor(start))
                requestAnimationFrame(animate)
            } else {
                setCount(end)
            }
        }

        animate()
    }, [data.profileViews])

    return (
        <div className="bg-white rounded-xl shadow-md p-8 text-center space-y-4">
            <h2 className="text-2xl font-bold text-slate-800">Visualizaciones del Perfil</h2>
            <p className="text-slate-600 text-lg">
                Tu perfil ha sido visitado <span className="text-lime-600 font-bold text-3xl">{count}</span> veces.
            </p>
            <p className="text-sm text-slate-400">¡Profe 10 para pasar! jajajaj</p>
        </div>
    )
}
