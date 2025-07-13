import { Link, Outlet } from 'react-router-dom'
import { Toaster } from 'sonner'
import { DndContext, DragEndEvent, closestCenter } from '@dnd-kit/core'
import { SortableContext, verticalListSortingStrategy, arrayMove } from '@dnd-kit/sortable'
import NavigationTabs from "./NavigationTabs"
import { SocialNetwork, User } from '../types'
import { useEffect, useState } from 'react'
import DevTreeLink from './DevTreeLink'
import { useQueryClient } from '@tanstack/react-query'
import Header from './Header'



type DevTreeProps = {
    data: User
}

export default function DevTree({ data }: DevTreeProps) {
    const [enabledLinks, setEnabledLinks] = useState<SocialNetwork[]>(
        JSON.parse(data.links).filter((item: SocialNetwork) => item.enabled)
    )

    useEffect(() => {
        setEnabledLinks(JSON.parse(data.links).filter((item: SocialNetwork) => item.enabled))
    }, [data])

    const queryClient = useQueryClient()

    const handleDragEnd = (e: DragEndEvent) => {
        const { active, over } = e

        if (over && over.id) {
            const prevIndex = enabledLinks.findIndex(link => link.id === active.id)
            const newIndex = enabledLinks.findIndex(link => link.id === over.id)
            const order = arrayMove(enabledLinks, prevIndex, newIndex)
            setEnabledLinks(order)

            const disabledLinks: SocialNetwork[] = JSON.parse(data.links).filter((item: SocialNetwork) => !item.enabled)
            const links = order.concat(disabledLinks)
            queryClient.setQueryData(['user'], (prevData: User) => ({
                ...prevData,
                links: JSON.stringify(links)
            }))
        }
    }

    return (
        <>
            <Header />

            <div className="bg-gradient-to-br from-gray-50 to-gray-200 min-h-screen py-10">
                <main className="mx-auto max-w-6xl px-6 md:px-8">
                    <NavigationTabs />

                    <div className="flex justify-end mb-6">
                        <Link
                            to={`/${data.handle}`}
                            target="_blank"
                            rel="noreferrer noopener"
                            className="text-slate-700 text-lg font-semibold hover:underline hover:text-cyan-600 transition"
                        >
                            🌐 Visitar mi perfil: /{data.handle}
                        </Link>
                    </div>

                    <div className="flex flex-col md:flex-row gap-8">
                        
                        {/* Cambie color para que vaya mas de acuerdo al estilo */}
                        <section className="flex-1 bg-lime-500 rounded-lg shadow-md p-6">
                            <Outlet />
                        </section>

                        {/* previa del perfil con marco*/}
                        <aside className="w-full md:w-96 bg-white rounded-lg shadow-md p-6">
                            <div className="text-center space-y-4">
                                <p className="text-2xl font-bold text-slate-800">{data.handle}</p>

                                {data.image && (
                                    <img
                                        src={data.image}
                                        alt="Imagen de perfil"
                                        className="mx-auto w-40 h-40 object-cover rounded-full border-4 border-lime-500"
                                    />                                                                                          
                                )}

                                <p className="text-gray-600 font-medium">{data.description}</p>
                            </div>

                            <div className="mt-10">
                                <DndContext
                                    collisionDetection={closestCenter}
                                    onDragEnd={handleDragEnd}
                                >
                                    <SortableContext
                                        items={enabledLinks}
                                        strategy={verticalListSortingStrategy}
                                    >
                                        <div className="flex flex-col gap-4">
                                            {enabledLinks.map(link => (
                                                <DevTreeLink key={link.name} link={link} />
                                            ))}
                                        </div>
                                    </SortableContext>
                                </DndContext>
                            </div>
                        </aside>
                    </div>
                </main>
            </div>

            {/* Toaster para notificaciones */}
            <Toaster position="top-right" />
        </>
    )
}
