import { isRejectedWithValue } from "@reduxjs/toolkit";
import { toast } from "react-toastify";
import { setRights, setToken, setUser } from "../redux/slices/authSlice";

/**
 * Middleware function for handling RTK Query errors.
 * It logs rejected actions, handles 401 unauthorized errors,
 * and displays error messages using toast notifications.
 *
 * @param {Object} api - The Redux API object.
 * @returns {Function} A middleware function that takes next and action as parameters.
 */

export const rtkQueryErrorLogger = (api) => (next) => (action) => {
    if (isRejectedWithValue(action)) {
        console.warn("We got a rejected action!", action);
        if (action.payload.originalStatus === 401) {
            api.dispatch(setToken(null));
            api.dispatch(setUser(null));
            api.dispatch(setRights(null));
            toast.error("Your session has expired. Please log in again.");
            return;
        }
        const errorMessage =
            action?.payload?.data &&
                typeof action?.payload?.data === "object" &&
                "message" in action?.payload?.data
                ? action.payload.data.message
                : `Error: ${action?.payload?.status}`;

        toast.error(errorMessage);
    }

    return next(action);
};