'use client'

import InputField from "@/components/forms/inputField"
import FooterLink from "@/components/forms/FooterLink"
import { Button } from "@/components/ui/button"
import { useForm } from "react-hook-form"
import { signInWithEmail } from "@/lib/actions/auth.actions"
import { useRouter } from "next/navigation"
import { toast } from "sonner"

const SignInPage = () => {
    const router = useRouter()

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<SignInFormData>({
        defaultValues: {
            email: '',
            password: ''
        }, mode: 'onBlur'
    })

    const onSubmit = async (data: SignInFormData) => {
        try {
            const result = await signInWithEmail(data)

            if(result.success) router.push('/')
        } catch (error) {
            console.error(error)
            toast.error('An unexpected error ocurred. Please try again,', {
                description: error instanceof Error ? error.message : 'Failed to sign in. Please try again.'
            })
        }
    }

    return (
        <>
            <h1 className="form-title">Welcome Back</h1>

            <form
                onSubmit={handleSubmit(onSubmit)}
                className="space-y-5"
            >
                <InputField
                    name='email'
                    label='Email'
                    placeholder='john.doe@example.com'
                    register={register}
                    error={errors.email}
                    validation={{ required: 'Email is required', pattern: /^\w+@\w+\.\w+$/, message: 'Email address is required' }}
                />

                <InputField
                    name='password'
                    label='Password'
                    placeholder='Enter a strong password'
                    type="password"
                    register={register}
                    error={errors.password}
                    validation={{ required: 'Password is required', minLength: 8 }}
                />

                <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="yellow-btn w-full mt-5"
                >
                    {isSubmitting ? 'Signing In...' : 'Sign In'}
                </Button>

                <FooterLink
                    text="Don't have an account?"
                    linkText="Sign Up"
                    href="/sign-up"
                />
            </form>
        </>
    )
}

export default SignInPage
