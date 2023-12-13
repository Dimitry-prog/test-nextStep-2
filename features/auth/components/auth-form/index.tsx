'use client';

import { useCallback, useState } from "react";
import { AuthVariant } from "@/features/auth/components/auth-form/types";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { AuthFormData, authSchema } from "@/features/auth/components/auth-form/validation";
import axios from "axios";
import { zodResolver } from "@hookform/resolvers/zod";
import toast from "react-hot-toast";
import { signIn } from "next-auth/react";
import AuthSocial from "@/features/auth/components/auth-social";
import { BsGithub, BsGoogle } from 'react-icons/bs';

const AuthForm = () => {
  const [authVariant, setAuthVariant] = useState<AuthVariant>('LOGIN');
  const {
    control,
    handleSubmit,
    formState: { errors }
  } = useForm<AuthFormData>({
    defaultValues: {
      name: '',
      email: '',
      password: ''
    },
    resolver: zodResolver(authSchema),
  });

  const authToggleVariant = useCallback(() => {
    if (authVariant === 'LOGIN') {
      setAuthVariant('REGISTER');
    } else {
      setAuthVariant('LOGIN');
    }
  }, [authVariant]);

  const authSocial = (social: string) => {
    signIn(social, { redirect: false })
      .then(cb => {
        if (cb?.error) {
          toast.error('Invalid credentials');
        }
        if (cb?.ok && !cb?.error) {
          toast.success('Logged in!');
        }
      });
  }

  const onSubmit: SubmitHandler<AuthFormData> = (data) => {
    if (authVariant === 'REGISTER') {
      axios.post('/api/register', data)
        .catch(() => toast.error('Something went wrong!'))
    }
    if (authVariant === 'LOGIN') {
      signIn('credentials', {
        ...data,
        redirect: false
      })
        .then((cb) => {
          if (cb?.error) {
            toast.error(cb?.error);
          }
          if (cb?.ok && !cb?.error) {
            toast.success('Logged in!');
          }
        })
    }
  }

  return (
    <div className='w-68 sm:w-96 mx-auto flex flex-col gap-4 p-4 rounded bg-white'>
      <form onSubmit={handleSubmit(onSubmit)} className='flex flex-col gap-4'>
        <h1 className='text-xl text-black font-bold'>Welcome!</h1>

        {authVariant === 'REGISTER' && (
          <Controller name='name' control={control} render={({ field }) => (
            <div className='flex flex-col gap-2'>
              <input type='text' placeholder='name' {...field}/>
              {errors.name?.message &&
                  <span className='text-sm font-light text-red-400'>{errors.name?.message}</span>}
            </div>
          )}/>
        )}
        <Controller name='email' control={control} render={({ field }) => (
          <div className='flex flex-col gap-2'>
            <input type='text' placeholder='email' {...field}/>
            {errors.email?.message &&
                <span className='text-sm font-light text-red-400'>{errors.email?.message}</span>}
          </div>
        )}/>
        <Controller name='password' control={control} render={({ field }) => (
          <div className='flex flex-col gap-2'>
            <input type='password' placeholder='password' {...field}/>
            {errors.password?.message &&
                <span className='text-sm font-light text-red-400'>{errors.password?.message}</span>}
          </div>
        )}/>

        <button
          type='submit'
          className='self-start px-2 py-1 text-white bg-black/40 rounded disabled:cursor-default disabled:opacity-30'
        >
          {authVariant === 'REGISTER' ? 'Register' : 'Sign in'}
        </button>
      </form>

      <div className='flex gap-4'>
        <AuthSocial icon={BsGoogle} onClick={() => authSocial('google')}/>
        <AuthSocial icon={BsGithub} onClick={() => authSocial('github')}/>
      </div>

      <div className='flex gap-4 items-center'>
        <p className='text-sm'>{authVariant === 'REGISTER' ? 'Already have an account?' : 'New one?'}</p>
        <button
          onClick={authToggleVariant}
          type='button'
          className='px-2 py-1 text-white bg-black/40 rounded disabled:cursor-default disabled:opacity-30'
        >
          {authVariant === 'REGISTER' ? 'Login' : 'Create an account'}
        </button>
      </div>
    </div>
  );
};

export default AuthForm;