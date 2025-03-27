import { disallow } from "joi";
import { userAgent } from "next/server";

export default async function robots(){
    return {
        rules: [
            {
                userAgent: "*",
                allow: "/",
                disallow: ["/dashboard"]
            }
        ],
        sitemap: `${process.env.NEXT_PUBLIC_APP_URL}/sitemap.xml`,
        host: `${process.env.NEXT_PUBLIC_APP_URL}`
    }
}