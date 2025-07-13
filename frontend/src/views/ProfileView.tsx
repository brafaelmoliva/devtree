import { useForm } from 'react-hook-form'
import { useQueryClient, useMutation } from '@tanstack/react-query'
import { toast } from 'sonner'
import ErrorMessage from '../components/ErrorMessage'
import { ProfileForm, User } from '../types'
import { updateProfile, uploadImage } from '../api/DevTreeAPI'

export default function ProfileView() {
    const queryClient = useQueryClient()
    const data: User = queryClient.getQueryData(['user'])!

    const { register, handleSubmit, formState: { errors } } = useForm<ProfileForm>({
        defaultValues: {
            handle: data.handle,
            description: data.description
        }
    })

    const updateProfileMutation = useMutation({
        mutationFn: updateProfile,
        onError: (error) => {
            toast.error(error.message)
        },
        onSuccess: (data) => {
            toast.success(data)
            queryClient.invalidateQueries({ queryKey: ['user'] })
        }
    })

    const uploadImageMutation = useMutation({
        mutationFn: uploadImage,
        onError: (error) => {
            toast.error(error.message)
        },
        onSuccess: (data) => {
            queryClient.setQueryData(['user'], (prevData: User) => ({
                ...prevData,
                image: data
            }))
        }
    })

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            uploadImageMutation.mutate(e.target.files[0])
        }
    }

    const handleUserProfileForm = (formData: ProfileForm) => {
        const user: User = queryClient.getQueryData(['user'])!
        user.description = formData.description
        user.handle = formData.handle
        updateProfileMutation.mutate(user)
    }

    return (
        <form
            onSubmit={handleSubmit(handleUserProfileForm)}
            className="bg-white p-8 md:p-10 rounded-xl shadow-lg max-w-2xl mx-auto space-y-6"
        >
            <legend className="text-3xl font-semibold text-center text-slate-800">Editar Perfil</legend>
            {/* Tambien añadi el contador aqui */}

            <p className="text-center text-slate-500 text-sm">
                Tu perfil ha sido visitado <span className="font-bold text-slate-700">{data.profileViews}</span> veces
            </p>

            <div className="space-y-1">
                <label htmlFor="handle" className="text-sm font-medium text-slate-700">Nombre de Usuario</label>
                <input
                    id="handle"
                    type="text"
                    className="w-full bg-slate-100 rounded-lg px-4 py-2 text-slate-700 focus:outline-none focus:ring-2 focus:ring-cyan-400 transition"
                    placeholder="Tu nombre de usuario"
                    {...register('handle', {
                        required: "El Nombre de Usuario es obligatorio"
                    })}
                />
                {errors.handle && <ErrorMessage>{errors.handle.message}</ErrorMessage>}
            </div>

            <div className="space-y-1">
                <label htmlFor="description" className="text-sm font-medium text-slate-700">Descripción</label>
                <textarea
                    id="description"
                    rows={4}
                    className="w-full bg-slate-100 rounded-lg px-4 py-2 text-slate-700 focus:outline-none focus:ring-2 focus:ring-cyan-400 transition"
                    placeholder="Describe quién eres o qué haces"
                    {...register('description', {
                        required: "La Descripción es obligatoria"
                    })}
                />
                {errors.description && <ErrorMessage>{errors.description.message}</ErrorMessage>}
            </div>

            {/* Campo: Imagen */}
            <div className="space-y-1">
                <label htmlFor="image" className="text-sm font-medium text-slate-700">Imagen de Perfil</label>
                <input
                    id="image"
                    type="file"
                    accept="image/*"
                    onChange={handleChange}
                    className="w-full bg-slate-100 rounded-lg px-4 py-2 text-slate-700 cursor-pointer file:cursor-pointer file:bg-cyan-100 file:border-none file:rounded-lg file:px-3 file:py-1 file:text-cyan-700 hover:file:bg-cyan-200 transition"
                />
            </div>

            {/* Botón de envío rediseñado */}
            <button
                type="submit"
                className="w-full bg-cyan-500 hover:bg-cyan-600 text-white font-bold py-2 px-4 rounded-lg uppercase transition duration-200"
            >
                Guardar Cambios
            </button>
        </form>
    )
}
