"use client";

import { SWRConfig } from "swr";
import axios from "axios";

const fetcher = (url) => axios.get(url, { withCredentials: true }).then((res) => res.data);

export default function SWRProvider({ children }) {
    return (
        <SWRConfig value={{ fetcher, revalidateOnFocus: true, shouldRetryOnError: false }}>
            {children}
        </SWRConfig>
    );
}
