import { fetchBaseQuery } from "@reduxjs/toolkit/query";
import { createApi } from "@reduxjs/toolkit/query/react";
import { dataToQueryParameter } from "./APIHelper";
import { baseUrl } from "./config";

export const apiSlice = createApi({
  baseQuery: fetchBaseQuery({
    baseUrl: baseUrl,
    prepareHeaders: (headers, { getState }) => {
      const token = getState().auth.token;
      if (token) {
        headers.set("authorization", `Bearer ${token}`);
      }
      return headers;
    },
  }),
  keepUnusedDataFor: 3,
  endpoints: (builder) => ({
    get: builder.query({
      query: (arg) => {
        const endpoint = arg?.endpoint || arg;
        const params = arg?.params ? dataToQueryParameter(arg.params) : "";
        return `${endpoint}${params}`;
      },
    }),

    generic: builder.mutation({
      query: ({ endpoint, method = "POST", data, params, headers }) => ({
        url: params ? `${endpoint}${dataToQueryParameter(params)}` : endpoint,
        method,
        body: data,
        headers: headers || { "Content-Type": "application/json" },
      }),
      transformResponse: (res) => res?.data || res,
    }),

    upload: builder.mutation({
      query: ({ endpoint, data, params }) => {
        const formData = new FormData();
        if (data) {
          Object.entries(data).forEach(([key, value]) =>
            formData.append(key, value),
          );
        }
        return {
          url: params ? `${endpoint}${dataToQueryParameter(params)}` : endpoint,
          method: "POST",
          body: formData,
        };
      },
      transformResponse: (res) => res?.data || res,
    }),

    blobRequest: builder.query({
      query: ({ endpoint, params }) => ({
        url: params ? `${endpoint}${dataToQueryParameter(params)}` : endpoint,
        responseHandler: async (res) => {
          if (!res.ok) {
            const text = await res.text();
            throw new Error(text || `Request failed with status ${res.status}`);
          }
          return res.blob();
        },
      }),
    }),

    ReferenceRequest: builder.mutation({
      query: ({ endpoint, body, params }) => ({
        url: params ? `${endpoint}${dataToQueryParameter(params)}` : endpoint,
        method: "POST",
        body: body,
        responseHandler: async (res) => {
          if (!res.ok) {
            let errMsg = `Request failed with status ${res.status}`;
            try { const j = await res.json(); errMsg = j?.detail || j?.message || errMsg; } catch {}
            throw new Error(errMsg);
          }
          return res.blob();
        },
      }),
    }),
  }),
});

export const {
  useGetQuery,
  useLazyGetQuery,
  useGenericMutation,
  useUploadMutation,
  useLazyBlobRequestQuery,
  useReferenceRequestMutation,
} = apiSlice;
