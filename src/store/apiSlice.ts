import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const apiSlice = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({
    baseUrl: '/api/',
    prepareHeaders: (headers) => {
      const getCookie = (name: string): string | null => {
        const value = `; ${document.cookie}`;
        const parts = value.split(`; ${name}=`);
        if (parts.length === 2) return parts.pop()?.split(';').shift() || null;
        return null;
      };
      const token = getCookie('token') || localStorage.getItem('token');
      if (token) {
        headers.set('authorization', `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ['Parent', 'Student', 'Safeguard'],
  endpoints: (builder) => ({
    // 1. Parent Auth
    registerParent: builder.mutation({
      query: (credentials) => ({
        url: 'auth/register/parent',
        method: 'POST',
        body: credentials,
      }),
    }),
    loginParent: builder.mutation({
      query: (credentials) => ({
        url: 'auth/login/parent',
        method: 'POST',
        body: credentials,
      }),
    }),

    // 2. Child Management (Student Registration)
    registerChild: builder.mutation({
      query: (childData) => ({
        url: 'auth/register/child',
        method: 'POST',
        body: childData,
      }),
      invalidatesTags: ['Parent'],
    }),

    // 3. Student Auth
    loginStudent: builder.mutation({
      query: (credentials) => ({
        url: 'auth/login/student',
        method: 'POST',
        body: credentials,
      }),
    }),

    // 4. Regional Safeguard Auth
    registerSafeguard: builder.mutation({
      query: (safeguardData) => ({
        url: 'auth/register/safeguard',
        method: 'POST',
        body: safeguardData,
      }),
      invalidatesTags: ['Safeguard'],
    }),
    loginSafeguard: builder.mutation({
      query: (credentials) => ({
        url: 'auth/login/safeguard',
        method: 'POST',
        body: credentials,
      }),
    }),

    // 5. General Auth / Regional Admin Login
    loginGeneral: builder.mutation({
      query: (credentials) => ({
        url: 'auth/login',
        method: 'POST',
        body: credentials,
      }),
    }),

    // 6. Get Current User Session (getMe)
    getMe: builder.query<any, void>({
      query: () => 'auth/me',
      providesTags: ['Parent', 'Student', 'Safeguard'],
    }),

    // 7. Update Parent Profile
    updateParentProfile: builder.mutation({
      query: (profileData) => ({
        url: 'auth/parent/profile',
        method: 'PUT',
        body: profileData,
      }),
      invalidatesTags: ['Parent'],
    }),
  }),
});

export const {
  useRegisterParentMutation,
  useLoginParentMutation,
  useRegisterChildMutation,
  useLoginStudentMutation,
  useRegisterSafeguardMutation,
  useLoginSafeguardMutation,
  useLoginGeneralMutation,
  useGetMeQuery,
  useUpdateParentProfileMutation,
} = apiSlice;
