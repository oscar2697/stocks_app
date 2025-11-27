'use server'

import { success } from "better-auth"
import { auth } from "../better-auth/auth"
import { inngest } from "../inngest/client"
import { headers } from "next/headers"

export const signUpWithEmail = async ({ fullName, email, password, country, investmentGoals, riskTolerance, preferredIndustry }: SignUpFormData) => {
    try {
        const response = await auth.api.signUpEmail({
            body: {
                email,
                password,
                name: fullName,
            }
        })

        if (response) {
            await inngest.send({
                name: 'app/user.created',
                data: {
                    email,
                    name: fullName,
                    country,
                    investmentGoals,
                    riskTolerance,
                    preferredIndustry
                }
            })
        }

        return {
            success: true,
            data: response
        }
    } catch (error) {
        console.log('Sign Up Error', error)
        return {
            success: false,
            error: 'Failed to sign up. Please try again'
        }
    }
}

export const signInWithEmail = async ({ email, password }: SignInFormData) => {
    try {
        const response = await auth.api.signInEmail({
            body: {
                email,
                password,
            }
        })

        return {
            success: true,
            data: response
        }
    } catch (error) {
        console.log('Sign In Error', error)
        return {
            success: false,
            error: 'Failed to sign in. Please try again'
        }
    }
}

export const signOut = async () => {
    try {
        await auth.api.signOut({headers: await headers()})
    } catch (error) {
        console.log('Sign Out Error', error)
        
        return {
            success: false,
            error: 'Failed to sign out'
        }
    }
}

