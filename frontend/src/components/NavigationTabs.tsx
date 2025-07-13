import { BookmarkSquareIcon, UserIcon, EyeIcon } from '@heroicons/react/20/solid' //importe otro icono
import { Link, useLocation, useNavigate } from 'react-router-dom'

const tabs = [
    { name: 'Links', href: '/admin', icon: BookmarkSquareIcon },
    { name: 'Mi Perfil', href: '/admin/profile', icon: UserIcon },
    { name: 'Visualizaciones', href: '/admin/views', icon: EyeIcon } // aqui el cambio
]

function classNames(...classes: string[]) {
    return classes.filter(Boolean).join(' ')
}

export default function NavigationTabs() {
    const location = useLocation()
    const navigate = useNavigate()

    const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        navigate(e.target.value)
    }

    return (
        <div className="mb-6">
            <div className="sm:hidden">
                <label htmlFor="tabs" className="sr-only">Selecciona una pestaña</label>
                <select
                    id="tabs"
                    name="tabs"
                    className="block w-full rounded-md border-gray-300 text-gray-700 shadow-sm focus:border-cyan-500 focus:ring-cyan-500"
                    onChange={handleChange}
                    value={location.pathname}
                >
                    {tabs.map((tab) => (
                        <option key={tab.name} value={tab.href}>
                            {tab.name}
                        </option>
                    ))}
                </select>
            </div>

            <div className="hidden sm:block">
                <div className="border-b border-gray-200">
                    <nav className="flex space-x-6" aria-label="Tabs">
                        {tabs.map((tab) => {
                            const isActive = location.pathname === tab.href
                            return (
                                <Link
                                    key={tab.name}
                                    to={tab.href}
                                    className={classNames(
                                        isActive
                                            ? 'border-cyan-500 text-cyan-600'
                                            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300',
                                        'group inline-flex items-center border-b-2 py-4 px-1 text-lg font-medium transition-colors'
                                    )}
                                >
                                    <tab.icon
                                        className={classNames(
                                            isActive
                                                ? 'text-cyan-600'
                                                : 'text-gray-400 group-hover:text-gray-500',
                                            'mr-2 h-5 w-5 transition-colors'
                                        )}
                                        aria-hidden="true"
                                    />
                                    {tab.name}
                                </Link>
                            )
                        })}
                    </nav>
                </div>
            </div>
        </div>
    )
}
