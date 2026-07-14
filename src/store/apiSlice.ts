import { createApi, fetchBaseQuery, type BaseQueryFn, type FetchArgs, type FetchBaseQueryError } from '@reduxjs/toolkit/query/react';
import { logout } from './slices/authSlice';

const baseQuery = fetchBaseQuery({
  baseUrl: '/api/',
  credentials: 'include',
});

const baseQueryWithReauth: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  let result = await baseQuery(args, api, extraOptions);

  if (result.error && (result.error.status === 401 || result.error.status === 403)) {
    const isRefreshRequest = typeof args === 'string' ? args.includes('auth/refresh') : args.url.includes('auth/refresh');
    
    if (!isRefreshRequest) {
      // Attempt to refresh the tokens silently
      const refreshResult = await baseQuery({ url: 'auth/refresh', method: 'POST' }, api, extraOptions);
      
      if (refreshResult.data) {
        // Retry the original query
        result = await baseQuery(args, api, extraOptions);
      } else {
        // If refresh fails, log out
        api.dispatch(logout());
      }
    }
  }
  return result;
};

export const apiSlice = createApi({
  reducerPath: 'api',
  baseQuery: baseQueryWithReauth,
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

    // 8. Update Safeguard Profile
    updateSafeguardProfile: builder.mutation({
      query: (profileData) => ({
        url: 'auth/safeguard/profile',
        method: 'PUT',
        body: profileData,
      }),
      invalidatesTags: ['Safeguard'],
    }),

    // 9. Get Safeguards list
    getSafeguards: builder.query<any, void>({
      query: () => 'auth/safeguards',
      providesTags: ['Safeguard'],
    }),

    // 10. Get Regional Parents list
    getRegionalParents: builder.query<any, void>({
      query: () => 'auth/regional/parents',
      providesTags: ['Parent'],
    }),

    // 10b. Update Unified Profile (Admins, Teachers, etc.)
    updateProfile: builder.mutation({
      query: (profileData) => ({
        url: 'auth/profile',
        method: 'PUT',
        body: profileData,
      }),
    }),

    // 10c. Change Password
    changePassword: builder.mutation({
      query: (passwordData) => ({
        url: 'auth/password',
        method: 'PUT',
        body: passwordData,
      }),
    }),

    // 11. Logout User
    logout: builder.mutation<any, void>({
      query: () => ({
        url: 'auth/logout',
        method: 'POST',
      }),
    }),

    // 12. Forgot Password
    forgotPassword: builder.mutation<any, { email: string }>({
      query: (forgotData) => ({
        url: 'auth/forgot-password',
        method: 'POST',
        body: forgotData,
      }),
    }),

    // 13. Reset Password
    resetPassword: builder.mutation<any, any>({
      query: (resetData) => ({
        url: 'auth/reset-password',
        method: 'POST',
        body: resetData,
      }),
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
  useUpdateSafeguardProfileMutation,
  useUpdateProfileMutation,
  useChangePasswordMutation,
  useGetSafeguardsQuery,
  useGetRegionalParentsQuery,
  useLogoutMutation,
  useForgotPasswordMutation,
  useResetPasswordMutation,
} = apiSlice;

