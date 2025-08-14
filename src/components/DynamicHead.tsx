import Head from "next/head";

type DynamicHeadProps = {
    title?: string;
    fallback?: string;
};

export default function DynamicHead({ title, fallback = "Loading..." }: DynamicHeadProps) {
    const finalTitle = title ?? fallback;

    return (
        <Head>
            <title>{finalTitle}</title>
        </Head>
    );
}
